// src/lib/cycleCalc.ts
// Calcul du cycle menstruel : source unique de vérité, utilisable côté serveur ET navigateur.
// Toutes les dates sont des jours au format "AAAA-MM-JJ" (aucun décalage de fuseau horaire ni d'heure d'été possible).

export type CyclePhaseName = "Hiver" | "Printemps" | "Été" | "Automne";

export interface PeriodEntry {
  startDate: string;       // 1er jour des règles, "AAAA-MM-JJ"
  endDate: string | null;  // dernier jour de règles, "AAAA-MM-JJ", ou null si inconnu
}

export interface CycleSettings {
  cycleLength: number;
  periodLength: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function clampCycleLength(value: unknown): number {
  return Math.min(Math.max(Math.round(Number(value)) || 28, 20), 90);
}

export function clampPeriodLength(value: unknown): number {
  return Math.min(Math.max(Math.round(Number(value)) || 5, 1), 10);
}

function toUtc(day: string): number {
  const [y, m, d] = day.slice(0, 10).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Nombre de jours entre deux jours "AAAA-MM-JJ" (positif si b est après a). */
export function dayDiff(a: string, b: string): number {
  return Math.round((toUtc(b) - toUtc(a)) / DAY_MS);
}

/** Ajoute (ou retire) des jours à un jour "AAAA-MM-JJ". */
export function addDays(day: string, n: number): string {
  return new Date(toUtc(day) + n * DAY_MS).toISOString().slice(0, 10);
}

/** Jour "AAAA-MM-JJ" d'une date locale (cases du calendrier, aujourd'hui côté navigateur...). */
export function localDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Aujourd'hui dans un fuseau horaire donné (côté serveur). */
export function todayString(timezone = "Europe/Paris"): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Phase pour un jour de cycle donné (jour 1 = 1er jour des règles). */
export function phaseForCycleDay(day: number, cycleLength: number, periodLength: number): CyclePhaseName {
  const cLength = clampCycleLength(cycleLength);
  const pLength = clampPeriodLength(periodLength);

  if (day <= pLength) return "Hiver";

  // Ovulation ≈ 14 jours avant la fin du cycle, avec au moins 2 jours de phase folliculaire
  // et 4 jours de phase lutéale garantis
  let ovulationDay = cLength - 14;
  ovulationDay = Math.max(ovulationDay, pLength + 4);
  ovulationDay = Math.min(ovulationDay, cLength - 5);
  const ovStart = ovulationDay - 1;
  const ovEnd = ovulationDay + 1;

  if (day < ovStart) return "Printemps";
  if (day <= ovEnd) return "Été";
  return "Automne";
}

/** Durée réelle des règles d'une entrée de l'historique (ou valeur de secours si la fin est inconnue). */
export function entryPeriodLength(entry: PeriodEntry, fallback: number): number {
  if (!entry.endDate) return clampPeriodLength(fallback);
  const length = dayDiff(entry.startDate, entry.endDate) + 1;
  return length >= 1 ? clampPeriodLength(length) : clampPeriodLength(fallback);
}

/**
 * Position d'un jour dans le cycle, à partir de l'historique réel des règles :
 * - les cycles passés utilisent leurs vraies dates (durée réelle du cycle et des règles) ;
 * - le cycle en cours et les cycles à venir utilisent les durées moyennes prévues.
 */
export function getCyclePositionForDay(day: string, settings: CycleSettings, history: PeriodEntry[]) {
  if (history.length === 0) return null;

  const sorted = history
    .map((e) => ({ startDate: e.startDate.slice(0, 10), endDate: e.endDate ? e.endDate.slice(0, 10) : null }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const defaultCycle = clampCycleLength(settings.cycleLength);
  const defaultPeriod = clampPeriodLength(settings.periodLength);

  // Dernier début de règles avant (ou le jour même de) la date demandée
  let idx = -1;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].startDate <= day) idx = i;
    else break;
  }
  const isBeforeFirst = idx === -1;
  const entry = sorted[isBeforeFirst ? 0 : idx];
  const next = isBeforeFirst ? undefined : sorted[idx + 1];

  // Durée réelle du cycle si le suivant est connu et plausible
  let cycleLength = defaultCycle;
  if (next) {
    const actual = dayDiff(entry.startDate, next.startDate);
    if (actual >= 20 && actual <= 90) cycleLength = actual;
  }

  const diff = dayDiff(entry.startDate, day);
  const cycleDay = (((diff % cycleLength) + cycleLength) % cycleLength) + 1;

  // La durée réelle des règles ne vaut que pour le cycle réellement enregistré
  const isRecordedCycle = !isBeforeFirst && diff < cycleLength;
  const periodLength = isRecordedCycle ? entryPeriodLength(entry, defaultPeriod) : defaultPeriod;

  return {
    cycleDay,
    cycleLength,
    periodLength,
    phase: phaseForCycleDay(cycleDay, cycleLength, periodLength),
    entryStart: entry.startDate,
  };
}

/** Informations du jour (même format qu'avant, avec la durée réelle en plus). */
export function computeCycleInfo(
  isActive: boolean,
  settings: CycleSettings,
  history: PeriodEntry[],
  timezone = "Europe/Paris"
) {
  const today = todayString(timezone);

  // Si inactif ou sans date : par défaut, le 1er du mois courant
  const entries: PeriodEntry[] =
    !isActive || history.length === 0 ? [{ startDate: `${today.slice(0, 8)}01`, endDate: null }] : history;

  const pos = getCyclePositionForDay(today, settings, entries)!;
  return {
    currentDay: pos.cycleDay,
    daysUntilNext: pos.cycleLength - pos.cycleDay + 1,
    phase: pos.phase,
    cycleLength: pos.cycleLength,
    periodLength: pos.periodLength,
    refDate: `${pos.entryStart}T00:00:00.000Z`,
  };
}