import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";
import { utilisateurConnecte } from "@/lib/utilisateurConnecte";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2025-01-27.acacia" as any,
});

/**
 * DELETE /api/account : supprimer définitivement son compte (droit à l'effacement, RGPD article 17).
 * Body : { password, confirmation: "SUPPRIMER" }
 *
 * 1. Le mot de passe est vérifié (5 essais par quart d'heure) : une personne devant un appareil resté connecté
 *    ne peut pas supprimer le compte.
 * 2. L'abonnement Stripe est résilié immédiatement, pour que les prélèvements s'arrêtent. Si Stripe ne répond pas,
 *    rien n'est supprimé. Les factures restent chez Stripe (obligation comptable).
 * 3. Le compte et toutes ses données sont effacés (suppression en cascade dans la base), puis le cookie est retiré.
 *
 * Les comptes coach et administrateur ne se suppriment pas ici : leurs séances, avis et réservations concernent
 * d'autres personnes. Ils passent par l'équipe SOREA.
 */
export async function DELETE(request: Request) {
  try {
    const user = await utilisateurConnecte();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    if (user.role !== "user") {
      return NextResponse.json(
        { error: "Un compte coach ou administrateur ne peut pas être supprimé ici. Contacte l'équipe SOREA." },
        { status: 403 }
      );
    }

    const limite = checkRateLimit(`suppression-compte:${user.id}`, 5, 15 * 60_000);
    if (!limite.allowed) {
      return NextResponse.json({ error: "Trop de tentatives. Réessaie dans quelques minutes." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    if (body.confirmation !== "SUPPRIMER") {
      return NextResponse.json({ error: "Tape SUPPRIMER pour confirmer." }, { status: 400 });
    }
    const password = typeof body.password === "string" ? body.password : "";
    if (!password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
    }

    // Abonnement en cours : résiliation immédiate chez Stripe avant toute suppression
    if (user.stripeSubscriptionId && user.subscriptionStatus !== "canceled") {
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (err) {
        const code = (err as { code?: string }).code;
        // Abonnement déjà inexistant chez Stripe : rien à résilier
        if (code !== "resource_missing") {
          console.error("Suppression de compte : résiliation Stripe impossible", err);
          return NextResponse.json(
            { error: "Impossible de résilier ton abonnement pour le moment. Ton compte n'a pas été supprimé, réessaie plus tard." },
            { status: 502 }
          );
        }
      }
    }

    await prisma.user.delete({ where: { id: user.id } });

    const cookieStore = await cookies();
    cookieStore.delete("sorea_session");

    return NextResponse.json({ supprime: true });
  } catch (error) {
    console.error("Erreur suppression de compte:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
