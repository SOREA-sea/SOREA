import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any, // Utilise la version récente de l'API Stripe
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, id, type } = body;

    // Conversion du prix en centimes (ex: 0.95 € devient 95)
    const unitAmount = Math.round(parseFloat(price || "0.95") * 100);

    // Détermination de la page de redirection selon le type d'achat
    let redirectPath = "mirror/miroir";
    if (type === "visualisation") {
      redirectPath = "visualization/visualisation";
    } else if (type === "bien-etre") {
      redirectPath = "Wheel-Spinner/BienEtre";
    } else if (type === "nutrition") {
      redirectPath = "Wheel-Spinner/Nutrition";
    } else if (type === "sport") {
      redirectPath = "Wheel-Spinner/Sport";
    }

    // Création de la session de paiement Stripe Checkout unique
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: title || "Article SOREA",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${redirectPath}?success=true&itemId=${id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${redirectPath}?canceled=true`,
    });

    // Gestion de la mise à jour ou de la création dans GameProduct pour Prisma Studio
    if (id && id !== "undefined" && id !== "null") {
      await (prisma.gameProduct as any).update({
        where: { id: Number(id) },
        data: { isPurchased: true },
      }).catch((e: any) => console.log("Erreur mise à jour id", e));
    } else {
      // Création automatique si l'élément vient d'un Wheel-Spinner sans ID pré-existant
      if (type === "bien-etre") {
        await prisma.gameProduct.create({
          data: {
            title: "Wheel-Spinner Bien-être",
            text: "Paiement pour rejouer à la roue Bien-être",
            price: Number(price) || 0.99,
            type: "bien-etre",
            isActive: true,
            isPurchased: true,
          } as any,
        }).catch((e) => console.log("Erreur création WS Bien-être", e));
      } else if (type === "nutrition") {
        await prisma.gameProduct.create({
          data: {
            title: "Wheel-Spinner Nutrition",
            text: "Paiement pour rejouer à la roue Nutrition",
            price: Number(price) || 0.99,
            type: "nutrition",
            isActive: true,
            isPurchased: true,
          } as any,
        }).catch((e) => console.log("Erreur création WS Nutrition", e));
      } else if (type === "sport") {
        await prisma.gameProduct.create({
          data: {
            title: "Wheel-Spinner Sport",
            text: "Paiement pour rejouer à la roue Sport",
            price: Number(price) || 0.99,
            type: "sport",
            isActive: true,
            isPurchased: true,
          } as any,
        }).catch((e) => console.log("Erreur création WS Sport", e));
      }
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Erreur Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}