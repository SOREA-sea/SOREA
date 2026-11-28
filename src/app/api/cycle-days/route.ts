import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { aConsentiSante, refusSansConsentement } from "@/lib/consentementSante";

/**
 * Réglages d'un jour du calendrier (onglet Paramètre) : « Mes règles sont en retard », « Plus de précisions »,
 * « Test d'ovulation positif » et « Rapport ». Données de santé : uniquement celles de la session en cours.
 *
 * GET : tous les jours renseignés de l'utilisatrice connectée.
 * PUT : { day: "AAAA-MM-JJ", late?, note?, ovulationTest?, intercourse? } (bouton « Valider »).
 *       Un jour sans aucune information est supprimé.
 */

const JOUR = /^\d{4}-\d{2}-\d{2}$/;

async function utilisateurConnecte() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;
  if (!sessionId) return null;
  const session = await prisma.userSession.findUnique({ where: { id: sessionId } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.userId;
}

const versClient = (d: { day: string; late: boolean; note: string | null; ovulationTest: boolean; intercourse: boolean }) => ({
  day: d.day,
  late: d.late,
  note: d.note ?? "",
  ovulationTest: d.ovulationTest,
  intercourse: d.intercourse,
});

export async function GET() {
  try {
    const userId = await utilisateurConnecte();
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    // Sans consentement aux données de santé : rien n'est lu
    if (!(await aConsentiSante(userId))) return NextResponse.json({ days: [], consentementRequis: true }, { status: 200 });

    const jours = await prisma.cycleDay.findMany({ where: { userId }, orderBy: { day: "asc" } });
    return NextResponse.json({ days: jours.map(versClient) }, { status: 200 });
  } catch (error) {
    console.error("Erreur cycle-days GET:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await utilisateurConnecte();
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    if (!(await aConsentiSante(userId))) return refusSansConsentement();

    const body = await request.json();
    const day = typeof body.day === "string" ? body.day : "";
    if (!JOUR.test(day)) return NextResponse.json({ error: "Jour invalide" }, { status: 400 });

    const valeurs = {
      late: body.late === true,
      note: typeof body.note === "string" ? body.note.trim().slice(0, 2000) || null : null,
      ovulationTest: body.ovulationTest === true,
      intercourse: body.intercourse === true,
    };

    // Plus rien pour ce jour : on supprime la ligne plutôt que de garder une ligne vide
    if (!valeurs.late && !valeurs.note && !valeurs.ovulationTest && !valeurs.intercourse) {
      await prisma.cycleDay.deleteMany({ where: { userId, day } });
      return NextResponse.json({ day: { day, late: false, note: "", ovulationTest: false, intercourse: false } }, { status: 200 });
    }

    const enregistre = await prisma.cycleDay.upsert({
      where: { userId_day: { userId, day } },
      update: valeurs,
      create: { userId, day, ...valeurs },
    });
    return NextResponse.json({ day: versClient(enregistre) }, { status: 200 });
  } catch (error) {
    console.error("Erreur cycle-days PUT:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
