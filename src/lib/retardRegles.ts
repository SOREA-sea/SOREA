// Retard de règles côté serveur : même règle que le calendrier (MenstrualCalendar, retardRegles / avecRetard).
// « Mes règles sont en retard » validé après le début des dernières règles, sans nouveau début depuis :
// les règles prévues ne comptent plus, et les prévisions repartent de demain.
// Utilisé pour la phase du jour calculée par le serveur (roues, affirmations, miroir).

import prisma from "@/lib/prisma";
import { addDays, type PeriodEntry } from "@/lib/cycleCalc";

// Situations sans retard possible (pas de cycle, ou cycle irrégulier suivi autrement)
const SANS_RETARD = ["enceinte", "menopausee", "postpartum", "perimenopause"];

export async function historiqueAvecRetard(
  userId: number,
  profile: { isActive: boolean; lastPeriodStartDate: Date | null; situation?: string | null },
  history: PeriodEntry[],
  today: string
): Promise<PeriodEntry[]> {
  if (!profile.isActive || !profile.lastPeriodStartDate || history.length === 0) return history;
  if (profile.situation && SANS_RETARD.includes(profile.situation)) return history;

  const debut = profile.lastPeriodStartDate.toISOString().slice(0, 10);
  const retard = await prisma.cycleDay.findFirst({
    where: { userId, late: true, day: { gt: debut, lte: today } },
    select: { id: true },
  });
  if (!retard) return history;

  // Début fictif demain : aujourd'hui n'est plus en phase Hiver prévue, le cycle s'allonge jusqu'aux vraies règles
  return [...history, { startDate: addDays(today, 1), endDate: null }];
}
