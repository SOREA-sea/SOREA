import { NextResponse } from "next/server";
import { requireAuth } from "../middleware/auth";
import prisma from "@/lib/prisma";

/**
 * API Products - Gestion des produits de la boutique
 *
 * GET - Récupérer tous les produits actifs (PUBLIC)
 *       Retourne une liste de produits depuis la DB (fallback: données statiques si DB indisponible)
 *
 * POST - Créer un nouveau produit (PROTECTED - admin only)
 *        Body: { name, description, price, stockQuantity, imageUrl }
 */

// GET - Récupérer tous les produits (PUBLIC)
export async function GET() {
  try {
    // Récupérer tous les produits actifs depuis la base de données
    const products = await prisma.shopProduct.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: products,
      message: "Produits récupérés avec succès",
    }, { status: 200 });

  } catch (error) {
    console.error("[GET /api/products] Erreur:", error);

    // Fallback: données statiques pour le développement si la DB est indisponible
    const seed = [
      { id: 1, name: "Relaxation Kit", description: "Kit pour moments de détente", price: 29.99, imageUrl: '/images/product_1.webp' },
      { id: 2, name: "Bougie Aromatique", description: "Senteur apaisante", price: 19.99, imageUrl: '/images/product_2.webp' },
      { id: 3, name: "Journal de Bien-être", description: "Suivez vos habitudes", price: 24.99, imageUrl: '/images/product_3.webp' },
      { id: 4, name: "Tapis de Yoga", description: "Confort optimal", price: 39.99, imageUrl: '/images/product_4.webp' },
      { id: 5, name: "Huiles Essentielles", description: "Pack découverte", price: 34.99, imageUrl: '/images/product_5.webp' },
      { id: 6, name: "Coussin de Méditation", description: "Zafu traditionnel", price: 44.99, imageUrl: '/images/product_6.webp' },
    ];

    return NextResponse.json({
      data: seed,
      message: "Produits récupérés (fallback static)",
    }, { status: 200 });
  }
}

// POST - Créer un nouveau produit (PROTECTED - admin only)
export async function POST(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAuth("admin");
    if (!("id" in auth)) return auth; // auth returned a NextResponse error

    const body = await request.json();
    const { name, description, price, stockQuantity, imageUrl } = body;

    // Validation des champs obligatoires
    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Les champs 'name' et 'price' sont obligatoires" },
        { status: 400 }
      );
    }

    // Validation du prix
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: "Le prix doit être un nombre positif" },
        { status: 400 }
      );
    }

    // Création du produit
    const newProduct = await prisma.shopProduct.create({
      data: {
        name,
        description: description || null,
        price,
        stockQuantity: stockQuantity ?? 0,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json({
      data: newProduct,
      message: "Produit créé avec succès",
    }, { status: 201 });

  } catch (error) {
    console.error("[POST /api/products] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, stockQuantity, imageUrl, isActive } = body;

    // Validation de l'ID
    if (!id) {
      return NextResponse.json(
        { error: "L'ID du produit est requis" },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe
    const existingProduct = await prisma.shopProduct.findUnique({
      where: { id: parsedId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // Mise à jour du produit
    const updatedProduct = await prisma.shopProduct.update({
      where: { id: parsedId },
      data: {
        name: name ?? existingProduct.name,
        description: description ?? existingProduct.description,
        price: price ?? existingProduct.price,
        stockQuantity: stockQuantity ?? existingProduct.stockQuantity,
        imageUrl: imageUrl ?? existingProduct.imageUrl,
        isActive: isActive ?? existingProduct.isActive,
      },
    });

    return NextResponse.json({
      data: updatedProduct,
      message: "Produit mis à jour avec succès",
    }, { status: 200 });

  } catch (error) {
    console.error("[PUT /api/products] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Désactiver un produit (soft delete)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    // Validation de l'ID
    if (!id) {
      return NextResponse.json(
        { error: "L'ID du produit est requis" },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe
    const existingProduct = await prisma.shopProduct.findUnique({
      where: { id: parsedId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // Soft delete : désactiver le produit au lieu de le supprimer
    // Cela préserve l'historique des commandes
    await prisma.shopProduct.update({
      where: { id: parsedId },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Produit désactivé avec succès",
    }, { status: 200 });

  } catch (error) {
    console.error("[DELETE /api/products] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
