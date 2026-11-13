"use server";

import prisma from "@/lib/prisma";

export async function createAffirmationAction(data: { title: string; text: string; price: number }) {
  try {
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

export async function createVisualisationAction(data: { title: string; description: string; price: number }) {
  try {
    const newProduct = await prisma.gameProduct.create({
      data: {
        title: data.title,
        text: data.description || "",
        price: data.price,
        type: "visualisation",
        isActive: true,
        isPurchased: false,
      } as any,
    });
    return { success: true, product: newProduct };
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