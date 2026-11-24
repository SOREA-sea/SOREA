import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST() {
  try {
    // Qui est connecté ?
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!session || session.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Session expirée." }, { status: 401 });
    }
    const user = session.user;

    const priceId = process.env.STRIPE_PRICE_ID_ABONNEMENT;
    if (!priceId) {
      return NextResponse.json({ error: "STRIPE_PRICE_ID_ABONNEMENT manquant dans le .env." }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Abonnement avec 7 jours d'essai : 0 € aujourd'hui, la carte est enregistrée
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      payment_method_collection: "always",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: String(user.id) },
      },
      metadata: { userId: String(user.id) },
      success_url: `${baseUrl}/dashboard?essai=ok`,
      cancel_url: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err: any) {
    console.error("Erreur Stripe (essai) :", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}