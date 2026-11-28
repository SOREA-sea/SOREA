import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Consentement explicite au traitement des données de santé (RGPD, article 9).
// Sans consentement en cours, aucune donnée de suivi (cycle, jours, symptômes) n'est lue ni enregistrée.
// Le consentement se donne sur /suivi, à l'inscription ou dans « Mes données » (/dashboard/profile),
// et se retire à tout moment au même endroit.

export async function aConsentiSante(userId: number): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { healthConsentAt: true } });
  return !!user?.healthConsentAt;
}

// Réponse commune des routes de suivi quand le consentement manque (le client affiche alors la demande)
export function refusSansConsentement() {
  return NextResponse.json(
    {
      error: "Pour utiliser le suivi, donne d'abord ton accord au traitement de tes données de santé.",
      consentementRequis: true,
    },
    { status: 403 }
  );
}
