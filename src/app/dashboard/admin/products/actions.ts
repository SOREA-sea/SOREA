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