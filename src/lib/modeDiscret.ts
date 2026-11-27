// Mode discret (flocon) : saisons (Hiver, Printemps...) au lieu des phases du cycle.
// Enregistré en base dans le profil menstruel, propre au compte (plus dans le navigateur).
// Utilisé côté navigateur par le calendrier, /dashboard/suivi et le miroir.

const ANCIENNE_CLE = "sorea_snowflake_mode";

export async function enregistrerModeDiscret(actif: boolean): Promise<boolean> {
  try {
    const res = await fetch("/api/menstrual-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discreetMode: actif }),
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// Valeur à afficher à partir du profil lu en base.
// Jamais enregistrée (null) : reprise unique de l'ancien réglage du navigateur, envoyé au compte puis effacé.
export function lireModeDiscret(valeurEnBase: boolean | null | undefined): boolean {
  let ancien: string | null = null;
  try {
    ancien = localStorage.getItem(ANCIENNE_CLE);
    localStorage.removeItem(ANCIENNE_CLE);
  } catch {
    // stockage du navigateur indisponible : on s'en tient à la base
  }
  if (typeof valeurEnBase === "boolean") return valeurEnBase;
  if (ancien === "true") {
    void enregistrerModeDiscret(true);
    return true;
  }
  return false;
}
