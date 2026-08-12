import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Liste de tous les produits (admin only)
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const products = await prisma.shopProduct.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            cartItems: true,
            favoriteProducts: true,
          },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Erreur admin/products GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// POST — Créer un nouveau produit
// Body: { name, description, price, stockQuantity, imageUrl }
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, stockQuantity, imageUrl } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Les champs 'name' et 'price' sont requis" },
        { status: 400 }
      );
    }

    const product = await prisma.shopProduct.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity) || 0,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json({ message: "Produit créé", product }, { status: 201 });
  } catch (error) {
    console.error("Erreur admin/products POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// PATCH — Modifier un produit
// Body: { productId, name?, description?, price?, stockQuantity?, isActive?, imageUrl? }
export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { productId, name, description, price, stockQuantity, isActive, imageUrl } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId est requis" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const product = await prisma.shopProduct.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ message: "Produit mis à jour", product });
  } catch (error) {
    console.error("Erreur admin/products PATCH:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// DELETE — Supprimer un produit
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ error: "Le paramètre 'id' est requis" }, { status: 400 });
    }

    await prisma.shopProduct.delete({ where: { id: parseInt(productId, 10) } });

    return NextResponse.json({ message: "Produit supprimé" });
  } catch (error) {
    console.error("Erreur admin/products DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
