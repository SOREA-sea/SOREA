import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { utilisateurConnecte } from "@/lib/utilisateurConnecte";
import { effacerDonneesSuivi } from "@/lib/donneesSuivi";

/**
 * Consentement explicite au traitement des données de santé (RGPD, article 9).
 *
 * GET    : { consenti, depuis, retireLe }
 * POST   : donne le consentement (date enregistrée comme preuve)
 * DELETE : { effacerCycle?: boolean } retire le consentement ; le suivi est alors bloqué.
 *          Avec effacerCycle, les données du cycle sont aussi effacées.
 */

export async function GET() {
  const user = await utilisateurConnecte();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  return NextResponse.json({
    consenti: !!user.healthConsentAt,
    depuis: user.healthConsentAt?.toISOString() ?? null,
    retireLe: user.healthConsentWithdrawnAt?.toISOString() ?? null,
  });
}

export async function POST() {
  try {
    const user = await utilisateurConnecte();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    const maj = await prisma.user.update({
      where: { id: user.id },
      data: { healthConsentAt: user.healthConsentAt ?? new Date() },
    });
    return NextResponse.json({ consenti: true, depuis: maj.healthConsentAt?.toISOString() ?? null });
  } catch (error) {
    console.error("Erreur consentement santé POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await utilisateurConnecte();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    const body = await request.json().catch(() => ({}));

    await prisma.user.update({
      where: { id: user.id },
      data: { healthConsentAt: null, healthConsentWithdrawnAt: new Date() },
    });
    if (body.effacerCycle === true) await effacerDonneesSuivi(user.id, { cycle: true, carnet: false });

    return NextResponse.json({ consenti: false, cycleEfface: body.effacerCycle === true });
  } catch (error) {
    console.error("Erreur consentement santé DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
