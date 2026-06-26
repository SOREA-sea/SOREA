// Renvoie le lundi de la semaine de la date donnée, au format "YYYY-MM-DD"
export function getWeekStartISO(d: Date): string {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Dim, 1 = Lun, ...
  const diff = day === 0 ? -6 : 1 - day; // ramène au lundi de la semaine
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

/**
 * Renvoie la date du jour au format "YYYY-MM-DD", dans un fuseau horaire donné.
 * Par défaut "Europe/Paris" (au lieu de UTC), pour que "aujourd'hui" corresponde
 * bien à la journée vécue par l'utilisateur, même tôt le matin.
 */
export function getTodayISO(timezone: string = "Europe/Paris"): string {
  // en-CA donne directement le format YYYY-MM-DD
  return new Date().toLocaleDateString("en-CA", { timeZone: timezone });
}