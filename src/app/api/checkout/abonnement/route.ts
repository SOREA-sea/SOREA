import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

// POST /api/checkout/abonnement  { formule: "mensuel" | "annuel" }
// Ouvre un paiement Stripe pour un abonnement SANS nouvel essai gratuit.
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;
    if (!sessionId) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }
    const user = session.user;

    const { formule } = await req.json();
    const priceId =
      formule === "annuel"
        ? process.env.STRIPE_PRICE_ID_ABONNEMENT_ANNUEL
        : formule === "mensuel"
        ? process.env.STRIPE_PRICE_ID_ABONNEMENT
        : null;
    if (!priceId) {
      return NextResponse.json({ error: "Formule invalide ou prix non configuré" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      // Si le client existe déjà chez Stripe (il a pris l'essai), on le réutilise
      ...(user.stripeCustomerId ? { customer: user.stripeCustomerId } : { customer_email: user.email }),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { metadata: { userId: String(user.id) } },
      metadata: { userId: String(user.id) },
      success_url: `${baseUrl}/dashboard?abonnement=ok`,
      cancel_url: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    console.error("Erreur checkout abonnement:", e);
    return NextResponse.json({ error: "Impossible d'ouvrir le paiement" }, { status: 500 });
  }
}