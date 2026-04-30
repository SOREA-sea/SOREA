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
  const items = cart.items.filter((i) => i.product?.isActive ?? true);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return {
  id: cart.id,
  userId: cart.userId,
  items,
    totalItems,
    subtotal,
  };
}

// GET - return user's cart (protected)
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
import { NextResponse } from "next/server";
<<<<<<< HEAD
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
=======
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
>>>>>>> 9dc8bd7d3f4b4abceee42031d261d3f6604eb98d
  } catch (error) {
    console.error("Erreur cart GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

<<<<<<< HEAD
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
=======
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
>>>>>>> 9dc8bd7d3f4b4abceee42031d261d3f6604eb98d
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
<<<<<<< HEAD
      const nextQuantity = existingItem.quantity + quantity;
      if (nextQuantity > product.stockQuantity) {
        return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQuantity, unitPrice: product.price },
      });
    } else {
=======
      // Incrémenter la quantité
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Ajouter le produit
>>>>>>> 9dc8bd7d3f4b4abceee42031d261d3f6604eb98d
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.price,
        },
      });
    }

<<<<<<< HEAD
    const updatedCart = await getOrCreateCart(auth.id);
    return NextResponse.json(
      { cart: formatCart(updatedCart), message: "Produit ajouté au panier" },
      { status: 201 }
    );
=======
    // Retourner le nouveau count
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });
    const count = updatedCart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return NextResponse.json({ message: "Produit ajouté au panier", count }, { status: 200 });
>>>>>>> 9dc8bd7d3f4b4abceee42031d261d3f6604eb98d
  } catch (error) {
    console.error("Erreur cart POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

<<<<<<< HEAD
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
=======
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
>>>>>>> 9dc8bd7d3f4b4abceee42031d261d3f6604eb98d
  } catch (error) {
    console.error("Erreur cart DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 9dc8bd7d3f4b4abceee42031d261d3f6604eb98d
