// pour pas vous perdre je donne ici un rendu de ce qu'il y a 
// lib/cyclePhase.ts
// Utilitaire partagé pour déterminer la phase du cycle à une date donnée.
// Reprend exactement la logique déjà utilisée dans MenstrualCalendar (getPhaseForDate),
// pour que le Miroir et le Calendrier restent toujours cohérents entre eux.

import type { Phase } from "./affirmations";

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
  cycleInfo: CycleInfo | null
): Phase {
  if (!cycleInfo || !profile || !profile.isActive) return "Printemps";

  const ref = new Date(cycleInfo.refDate);
  ref.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - ref.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const cLength = profile.cycleLength || 28;
  const currentDay = (((diffDays % cLength) + cLength) % cLength) + 1;
  const pLength = profile.periodLength || 5;

  if (currentDay <= pLength) return "Hiver";
  const ovStart = cLength - 14;
  const ovEnd = cLength - 12;
  if (currentDay < ovStart) return "Printemps";
  if (currentDay >= ovStart && currentDay <= ovEnd) return "Été";
  return "Automne";
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
    return getPhaseForDate(new Date(), data.profile, data.cycleInfo);
  } catch (e) {
    console.error("Impossible de récupérer la phase du cycle", e);
    return "Printemps";
  }
}