import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

// POST /api/billing/portail : ouvre le portail Stripe (résilier, changer de carte)
export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;
    if (!sessionId) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!session || session.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const customerId = session.user.stripeCustomerId;
    if (!customerId) {
      return NextResponse.json({ error: "Aucun abonnement à gérer pour ce compte." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portail = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: portail.url });
  } catch (e) {
    console.error("Erreur portail Stripe:", e);
    return NextResponse.json({ error: "Impossible d'ouvrir la gestion de l'abonnement" }, { status: 500 });
  }
}