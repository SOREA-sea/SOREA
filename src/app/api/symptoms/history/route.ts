import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { localDay } from "@/lib/cycleCalc";

/**
 * GET /api/symptoms/history
 * Toutes les synthèses quotidiennes (SymptomLog) de l'utilisatrice connectée, + son prénom et son nom.
 * Sert à /dashboard/suivi : regroupement par cycle, période « Par date » et rapport médecin.
 * Données de santé : uniquement celles de la session en cours, jamais d'un autre compte.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const logs = await prisma.symptomLog.findMany({
      where: { userId: session.userId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(
      {
        user: session.user,
        logs: logs.map((log) => ({
          id: log.id,
          // /api/symptoms enregistre minuit à l'heure locale du serveur : on relit donc le jour en heure locale
          day: localDay(new Date(log.date)),
          flow: log.flow,
          mood: log.mood,
          physicalSymptoms: log.physicalSymptoms,
          note: log.note,
          updatedAt: log.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur symptoms/history GET:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
