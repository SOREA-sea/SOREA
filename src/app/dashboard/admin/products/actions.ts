"use server";

import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/app/api/middleware/auth";

// Non exportée : ce n'est donc pas une server action appelable depuis le navigateur
async function estAdmin() {
  const user = await getUserFromRequest();
  const roles = (user?.role || "").toLowerCase().split(",").map((r) => r.trim());
  return !!user && roles.includes("admin");
}

export async function createAffirmationAction(data: { title: string; text: string; price: number }) {
  try {
    if (!(await estAdmin())) {
      return { success: false, error: "Accès refusé" };
    }
    const newProduct = await prisma.gameProduct.create({
      data: {
        title: data.title,
        text: data.text,
        price: data.price,
        type: "affirmation",
        isActive: true,
        isPurchased: false,
      } as any,
    });
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Boutique d'affirmations : lue depuis la base, donc identique pour tous les comptes
export async function getBoutiqueAffirmationsAction() {
  try {
    const products = await prisma.gameProduct.findMany({
      where: { type: "affirmation", isActive: true },
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true, text: true, price: true },
    });
    return {
      success: true,
      products: products.map((p) => ({ ...p, id: String(p.id) })),
    };
  } catch (error: any) {
    return { success: false, error: error.message, products: [] };
  }
}

// Retire une affirmation de la Boutique (admin uniquement) : désactivée, pas supprimée, pour garder l'historique des achats
export async function retirerAffirmationBoutiqueAction(data: { title: string; text: string }) {
  try {
    if (!(await estAdmin())) {
      return { success: false, error: "Accès refusé" };
    }
    await prisma.gameProduct.updateMany({
      where: { type: "affirmation", title: data.title, text: data.text, isActive: true },
      data: { isActive: false },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createVisualisationAction(data: {
  title: string;
  description: string;
  price: number;
  images?: any[]; // miniatures affichées dans la Boutique (3 max)
  imagesCount?: number; // nombre total d'images de la pellicule
}) {
  try {
    if (!(await estAdmin())) {
      return { success: false, error: "Accès refusé" };
    }
    const newProduct = await prisma.gameProduct.create({
      data: {
        title: data.title,
        text: data.description || "",
        price: data.price,
        type: "visualisation",
        isActive: true,
        isPurchased: false,
        images: JSON.stringify((data.images || []).slice(0, 3)),
        imagesCount: data.imagesCount ?? (data.images ? data.images.length : 0),
      } as any,
    });
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Boutique des pellicules : lue depuis la base, donc identique pour tous les comptes
export async function getBoutiqueVisualisationsAction() {
  try {
    const products: any[] = await prisma.gameProduct.findMany({
      where: { type: "visualisation", isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return {
      success: true,
      products: products.map((p) => {
        let images: any[] = [];
        try {
          images = p.images ? JSON.parse(p.images) : [];
        } catch {
          images = [];
        }
        return {
          id: String(p.id),
          title: p.title,
          description: p.text,
          price: p.price,
          images,
          imagesCount: p.imagesCount ?? images.length,
        };
      }),
    };
  } catch (error: any) {
    return { success: false, error: error.message, products: [] };
  }
}

// Retire une pellicule de la Boutique (admin uniquement) : désactivée, pas supprimée, pour garder l'historique des achats
export async function retirerVisualisationBoutiqueAction(data: { title: string; description: string }) {
  try {
    if (!(await estAdmin())) {
      return { success: false, error: "Accès refusé" };
    }
    await prisma.gameProduct.updateMany({
      where: { type: "visualisation", title: data.title, text: data.description || "", isActive: true },
      data: { isActive: false },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createWheelBienEtreAction() {
  try {
    const existing = await prisma.gameProduct.findFirst({
      where: { title: "Wheel-Spinner Bien-être" },
    });

    if (existing) {
      const updated = await prisma.gameProduct.update({
        where: { id: existing.id },
        data: { isPurchased: true, isActive: true },
      });
      return { success: true, product: updated };
    }

    const newProduct = await prisma.gameProduct.create({
      data: {
        title: "Wheel-Spinner Bien-être",
        text: "Paiement pour rejouer à la roue Bien-être",
        price: 0.99,
        type: "bien-etre",
        isActive: true,
        isPurchased: true,
      } as any,
    });
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createWheelNutritionAction() {
  try {
    const existing = await prisma.gameProduct.findFirst({
      where: { title: "Wheel-Spinner Nutrition" },
    });

    if (existing) {
      const updated = await prisma.gameProduct.update({
        where: { id: existing.id },
        data: { isPurchased: true, isActive: true },
      });
      return { success: true, product: updated };
    }

    const newProduct = await prisma.gameProduct.create({
      data: {
        title: "Wheel-Spinner Nutrition",
        text: "Paiement pour rejouer à la roue Nutrition",
        price: 0.99,
        type: "nutrition",
        isActive: true,
        isPurchased: true,
      } as any,
    });
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createWheelSportAction() {
  try {
    const existing = await prisma.gameProduct.findFirst({
      where: { title: "Wheel-Spinner Sport" },
    });

    if (existing) {
      const updated = await prisma.gameProduct.update({
        where: { id: existing.id },
        data: { isPurchased: true, isActive: true },
      });
      return { success: true, product: updated };
    }

    const newProduct = await prisma.gameProduct.create({
      data: {
        title: "Wheel-Spinner Sport",
        text: "Paiement pour rejouer à la roue Sport",
        price: 0.99,
        type: "sport",
        isActive: true,
        isPurchased: true,
      } as any,
    });
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}