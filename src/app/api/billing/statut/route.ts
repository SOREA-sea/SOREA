import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

/**
 * GET /api/billing/statut : état de l'abonnement de l'utilisatrice connectée, pour la rubrique « Mon abonnement ».
 * - statut : celui enregistré par le webhook Stripe (trialing, active, past_due, canceled...) ou null
 * - essaiFin : fin des 7 jours offerts à l'inscription
 * - formule, prochaineEcheance, resiliationPrevue : lus chez Stripe quand un abonnement existe
 *   (si Stripe ne répond pas, ces champs restent vides et la page affiche quand même le statut)
 * - gerable : un client Stripe existe, le portail (résilier, changer de carte) peut s'ouvrir
 */
export async function GET() {
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
    const user = session.user;

    let formule: "mensuel" | "annuel" | null = null;
    let prochaineEcheance: string | null = null;
    let resiliationPrevue = false;

    if (user.stripeSubscriptionId) {
      try {
        const abonnement = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const item = abonnement.items?.data?.[0];
        const intervalle = item?.price?.recurring?.interval;
        formule = intervalle === "year" ? "annuel" : intervalle === "month" ? "mensuel" : null;
        // Selon la version de l'API Stripe, la fin de période est sur l'abonnement ou sur sa ligne
        const finPeriode =
          (abonnement as { current_period_end?: number }).current_period_end ??
          (item as { current_period_end?: number } | undefined)?.current_period_end;
        if (finPeriode) prochaineEcheance = new Date(finPeriode * 1000).toISOString();
        resiliationPrevue = !!abonnement.cancel_at_period_end;
      } catch (e) {
        console.error("Erreur lecture abonnement Stripe:", e);
      }
    }

    return NextResponse.json({
      statut: user.subscriptionStatus ?? null,
      essaiFin: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
      formule,
      prochaineEcheance,
      resiliationPrevue,
      gerable: !!user.stripeCustomerId,
    });
  } catch (e) {
    console.error("Erreur statut abonnement:", e);
    return NextResponse.json({ error: "Impossible de lire l'abonnement" }, { status: 500 });
  }
}
