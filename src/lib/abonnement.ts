import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

type Resultat =
  | { erreur: NextResponse; user?: undefined }
  | { erreur?: undefined; user: NonNullable<Awaited<ReturnType<typeof chercherUtilisateur>>> };

async function chercherUtilisateur() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;
  if (!sessionId) return null;
  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

// À appeler en début de route : refuse l'accès si l'essai est fini et qu'il n'y a pas d'abonnement
export async function exigerAbonnement(): Promise<Resultat> {
  const user = await chercherUtilisateur();
  if (!user) {
    return { erreur: NextResponse.json({ error: "Non connecté" }, { status: 401 }) };
  }
  const essaiTermine =
    !!user.trialEndsAt &&
    user.trialEndsAt <= new Date() &&
    user.subscriptionStatus !== "trialing" &&
    user.subscriptionStatus !== "active";
  if (essaiTermine) {
    return {
      erreur: NextResponse.json({ error: "Abonnement requis", code: "ABONNEMENT_REQUIS" }, { status: 402 }),
    };
  }
  return { user };
}

// À appeler dans un layout.tsx : renvoie vers /dashboard (où la frame bloque) si l'essai est fini.
// Les visiteurs non connectés ne sont pas concernés (la page gère elle-même sa connexion).
export async function exigerAbonnementPage() {
  const user = await chercherUtilisateur();
  if (!user) return;
  const essaiTermine =
    !!user.trialEndsAt &&
    user.trialEndsAt <= new Date() &&
    user.subscriptionStatus !== "trialing" &&
    user.subscriptionStatus !== "active";
  if (essaiTermine) redirect("/dashboard/dossierperso");
}