import { NextResponse } from "next/server";
import { getUserFromRequest } from "../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Retourne le panier de l'utilisateur connecté
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ items: [], total: 0 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                isActive: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0, count: 0 });
    }

    // Filtrer les produits inactifs
    const activeItems = cart.items.filter((item) => item.product.isActive);

    const total = activeItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const count = activeItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      items: activeItems,
      total,
      count,
    });
  } catch (error) {
    console.error("Erreur cart GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// POST — Ajouter un produit au panier (ou incrémenter la quantité)
// Body: { productId: number, quantity?: number }
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Connectez-vous pour ajouter au panier" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId est requis" }, { status: 400 });
    }

    // Vérifier que le produit existe et est actif
    const product = await prisma.shopProduct.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    // Trouver ou créer le panier
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Incrémenter la quantité
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Ajouter le produit
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.price,
        },
      });
    }

    // Retourner le nouveau count
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });
    const count = updatedCart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return NextResponse.json({ message: "Produit ajouté au panier", count }, { status: 200 });
  } catch (error) {
    console.error("Erreur cart POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// DELETE — Retirer un item du panier
// Query: ?itemId=123  ou  ?itemId=123&decrement=true
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const decrement = searchParams.get("decrement") === "true";

    if (!itemId) {
      return NextResponse.json({ error: "itemId est requis" }, { status: 400 });
    }

    const parsedId = parseInt(itemId, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "itemId invalide" }, { status: 400 });
    }

    // Vérifier que l'item appartient bien au panier de l'utilisateur
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parsedId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Item introuvable" }, { status: 404 });
    }

    if (decrement && cartItem.quantity > 1) {
      await prisma.cartItem.update({
        where: { id: parsedId },
        data: { quantity: cartItem.quantity - 1 },
      });
    } else {
      await prisma.cartItem.delete({ where: { id: parsedId } });
    }

    // Retourner le nouveau count
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });
    const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return NextResponse.json({ message: "Panier mis à jour", count });
  } catch (error) {
    console.error("Erreur cart DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
