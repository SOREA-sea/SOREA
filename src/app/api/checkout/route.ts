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

    // Création de la session de paiement Stripe Checkout
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${type === "visualisation" ? "visualization/visualisation" : "mirror/miroir"}?success=true&itemId=${id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${type === "visualisation" ? "visualization/visualisation" : "mirror/miroir"}?canceled=true`,
    });

    // Bascule isPurchased à true uniquement lorsque le client passe à l'action de paiement
    if (id) {
      await (prisma.gameProduct as any).update({
        where: { id: Number(id) },
        data: { isPurchased: true },
      }).catch((e: any) => console.log("Erreur lors de la mise à jour isPurchased", e));
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Erreur Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
