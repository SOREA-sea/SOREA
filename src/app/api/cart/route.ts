import { NextResponse } from "next/server";
import { requireAuth } from "../middleware/auth";
import prisma from "@/lib/prisma";

type CartItemPayload = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    stockQuantity: number;
    isActive: boolean;
  };
};

async function getOrCreateCart(userId: number) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageUrl: true,
              stockQuantity: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (cart) return cart;

  return prisma.cart.create({
    data: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageUrl: true,
              stockQuantity: true,
              isActive: true,
            },
          },
        },
      },
    },
  });
}

function formatCart(cart: { id: number; userId: number; items: CartItemPayload[] }) {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items: cart.items,
    totalItems,
    subtotal,
  };
}

export async function GET() {
  try {
    const auth = await requireAuth();
    if (!("id" in auth)) return auth;

    const cart = await getOrCreateCart(auth.id);
    return NextResponse.json({ cart: formatCart(cart) }, { status: 200 });
  } catch (error) {
    console.error("Erreur cart GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (!("id" in auth)) return auth;

    const body = await request.json();
    const productId = Number(body?.productId);
    const quantity = body?.quantity === undefined ? 1 : Number(body.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "productId invalide" }, { status: 400 });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "La quantité doit être un entier positif" }, { status: 400 });
    }

    const product = await prisma.shopProduct.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    if (quantity > product.stockQuantity) {
      return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
    }

    const cart = await getOrCreateCart(auth.id);
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;
      if (nextQuantity > product.stockQuantity) {
        return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQuantity, unitPrice: product.price },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.price,
        },
      });
    }

    const updatedCart = await getOrCreateCart(auth.id);
    return NextResponse.json(
      { cart: formatCart(updatedCart), message: "Produit ajouté au panier" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur cart POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    if (!("id" in auth)) return auth;

    const body = await request.json();
    const itemId = Number(body?.itemId);
    const quantity = Number(body?.quantity);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json({ error: "itemId invalide" }, { status: 400 });
    }

    if (!Number.isInteger(quantity)) {
      return NextResponse.json({ error: "La quantité doit être un entier" }, { status: 400 });
    }

    const cart = await getOrCreateCart(auth.id);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else if (quantity > item.product.stockQuantity) {
      return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity, unitPrice: item.product.price },
      });
    }

    const updatedCart = await getOrCreateCart(auth.id);
    return NextResponse.json({ cart: formatCart(updatedCart), message: "Panier mis à jour" });
  } catch (error) {
    console.error("Erreur cart PATCH:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth();
    if (!("id" in auth)) return auth;

    const { searchParams } = new URL(request.url);
    const itemIdParam = searchParams.get("itemId");
    const cart = await getOrCreateCart(auth.id);

    if (itemIdParam) {
      const itemId = Number(itemIdParam);
      if (!Number.isInteger(itemId) || itemId <= 0) {
        return NextResponse.json({ error: "itemId invalide" }, { status: 400 });
      }

      const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
      if (!item) {
        return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
      }

      await prisma.cartItem.delete({ where: { id: itemId } });
      const updatedCart = await getOrCreateCart(auth.id);

      return NextResponse.json({ cart: formatCart(updatedCart), message: "Article supprimé du panier" });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const updatedCart = await getOrCreateCart(auth.id);

    return NextResponse.json({ cart: formatCart(updatedCart), message: "Panier vidé" });
  } catch (error) {
    console.error("Erreur cart DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}