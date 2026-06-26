import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";

async function getOrCreateCart(userId: number) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true }, orderBy: { createdAt: "asc" } } },
  });

  if (cart) return cart;

  return prisma.cart.create({ data: { userId }, include: { items: { include: { product: true } } } });
}

function formatCart(cart: { id: number; userId: number; items: any[] }) {
  const items = cart.items.filter((i) => i.product?.isActive ?? true);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalItems,
    subtotal,
    count: totalItems,
    total: subtotal,
  };
}

// POST — Ajouter une séance (CoachSession) au panier en la mappant sur un ShopProduct
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (!("id" in auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const sessionId = Number(body?.sessionId);
    const quantity = body?.quantity === undefined ? 1 : Number(body.quantity);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return NextResponse.json({ error: "sessionId invalide" }, { status: 400 });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "La quantité doit être un entier positif" }, { status: 400 });
    }

    const session = await prisma.coachSession.findUnique({ where: { id: sessionId } });
    if (!session || !session.isPublished) {
      return NextResponse.json({ error: "Séance non trouvée" }, { status: 404 });
    }

    // Rechercher un produit déjà créé pour cette séance
    const marker = `(session:${session.id})`;
    let product = await prisma.shopProduct.findFirst({ where: { name: { contains: marker } } });

    if (!product) {
      // Créer un produit temporaire représentant la séance
      const stock = session.capacity ?? 1;
      product = await prisma.shopProduct.create({
        data: {
          name: `Séance: ${session.title} ${marker}`,
          description: session.description ?? null,
          price: session.price,
          stockQuantity: stock,
          imageUrl: null,
          isActive: true,
        },
      });
    }

    if (quantity > product.stockQuantity) {
      return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
    }

    const cart = await getOrCreateCart(auth.id);
    const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: product.id } });

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;
      if (nextQuantity > product.stockQuantity) {
        return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
      }

      await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: nextQuantity, unitPrice: product.price } });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId: product.id, quantity, unitPrice: product.price } });
    }

    const updatedCart = await getOrCreateCart(auth.id);
    const formatted = formatCart(updatedCart);

    return NextResponse.json({ ...formatted, message: "Séance ajoutée au panier" }, { status: 201 });
  } catch (error) {
    console.error("Erreur cart/session POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
