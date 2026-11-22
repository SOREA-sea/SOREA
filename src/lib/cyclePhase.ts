// pour pas vous perdre je donne ici un rendu de ce qu'il y a 
// lib/cyclePhase.ts
// Utilitaire partagé pour déterminer la phase du cycle à une date donnée.
// Reprend exactement la logique déjà utilisée dans MenstrualCalendar (getPhaseForDate),
// pour que le Miroir et le Calendrier restent toujours cohérents entre eux.

import type { Phase } from "./affirmations";
import { getCyclePositionForDay, localDay, type PeriodEntry } from "./cycleCalc";

export interface CycleProfile {
  isActive: boolean;
  cycleLength: number;
  periodLength: number;
  lastPeriodStartDate: string | null;
}

export interface CycleInfo {
  currentDay: number;
  daysUntilNext: number;
  phase: string;
  refDate: string;
}

/**
 * Calcule la phase (Hiver / Printemps / Été / Automne) pour une date donnée,
 * à partir du profil de cycle de l'utilisatrice.
 * Retourne "Printemps" par défaut si le profil est inactif/absent
 * (valeur neutre, pour ne jamais bloquer le Miroir).
 */
export function getPhaseForDate(
  date: Date,
  profile: CycleProfile | null,
  cycleInfo: CycleInfo | null,
  history: PeriodEntry[] = []
): Phase {
  if (!cycleInfo || !profile || !profile.isActive) return "Printemps";

  // Historique réel des règles ; à défaut, on repart de la date de référence du cycle en cours
  const entries: PeriodEntry[] =
    history.length > 0 ? history : [{ startDate: String(cycleInfo.refDate).slice(0, 10), endDate: null }];

  // Même calcul que le calendrier, le suivi et le serveur (src/lib/cycleCalc.ts)
  const position = getCyclePositionForDay(
    localDay(date),
    { cycleLength: profile.cycleLength, periodLength: profile.periodLength },
    entries
  );
  return (position ? position.phase : "Printemps") as Phase;
}

/**
 * Va chercher le profil de cycle de l'utilisatrice connectée et renvoie la phase du jour.
 * Utilisé côté Miroir pour ne plus dépendre d'une phase codée en dur.
 */
export async function fetchCurrentPhase(): Promise<Phase> {
  try {
    const res = await fetch("/api/menstrual-profile");
    if (!res.ok) return "Printemps";
    const data = await res.json();
    // La phase du jour est calculée par le serveur : une seule source de vérité, identique au calendrier
    if (!data.profile?.isActive || !data.cycleInfo) return "Printemps";
    return data.cycleInfo.phase as Phase;
  } catch (e) {
    console.error("Impossible de récupérer la phase du cycle", e);
    return "Printemps";
  }
}