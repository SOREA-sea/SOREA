// pour pas vous perdre je donne ici un rendu de ce qu'il y a 
// lib/affirmations.ts
// Base manuelle des affirmations du Miroir SOREA — plus d'appel API.
// Classées par saison du cycle (Hiver / Printemps / Été / Automne).
// Tu peux librement modifier les textes ci-dessous par tes propres formulations.

export type Phase = "Hiver" | "Printemps" | "Été" | "Automne";

export interface Affirmation {
  id: string;
  phase: Phase;
  text: string;
}

export const AFFIRMATIONS: Affirmation[] = [
  // ------- HIVER (règles) : repos, douceur, régénération -------
  { id: "hiv-01", phase: "Hiver", text: "Je m'autorise à ralentir." },
  { id: "hiv-02", phase: "Hiver", text: "Mon corps mérite du repos et de la douceur." },
  { id: "hiv-03", phase: "Hiver", text: "Je m'écoute sans culpabilité." },
  { id: "hiv-04", phase: "Hiver", text: "Chaque cycle est une renaissance." },
  { id: "hiv-05", phase: "Hiver", text: "Je prends soin de moi comme d'une amie chère." },
  { id: "hiv-06", phase: "Hiver", text: "Il est normal d'avoir besoin de calme aujourd'hui." },
  { id: "hiv-07", phase: "Hiver", text: "Je fais confiance au rythme de mon corps." },
  { id: "hiv-08", phase: "Hiver", text: "Je m'accorde le droit de dire non." },
  { id: "hiv-09", phase: "Hiver", text: "Je me régénère à mon propre rythme." },
  { id: "hiv-10", phase: "Hiver", text: "Ma sensibilité est une force, pas une faiblesse." },
  { id: "hiv-11", phase: "Hiver", text: "Je choisis la bienveillance envers moi-même." },
  { id: "hiv-12", phase: "Hiver", text: "Je respire, je relâche, je me repose." },
  { id: "hiv-13", phase: "Hiver", text: "Aujourd'hui, prendre soin de moi est ma priorité." },

  // ------- PRINTEMPS (folliculaire) : renouveau, énergie montante -------
  { id: "pri-01", phase: "Printemps", text: "Je me sens pleine d'énergie nouvelle." },
  { id: "pri-02", phase: "Printemps", text: "Je suis ouverte aux belles opportunités." },
  { id: "pri-03", phase: "Printemps", text: "Ma créativité s'éveille naturellement." },
  { id: "pri-04", phase: "Printemps", text: "J'avance avec confiance et légèreté." },
  { id: "pri-05", phase: "Printemps", text: "Je crois en mon plein potentiel." },
  { id: "pri-06", phase: "Printemps", text: "Chaque jour est une nouvelle chance de grandir." },
  { id: "pri-07", phase: "Printemps", text: "Je suis curieuse et enthousiaste face à la vie." },
  { id: "pri-08", phase: "Printemps", text: "Mon optimisme grandit avec moi." },
  { id: "pri-09", phase: "Printemps", text: "Je m'autorise à essayer de nouvelles choses." },
  { id: "pri-10", phase: "Printemps", text: "Je fleuris à mon propre rythme." },
  { id: "pri-11", phase: "Printemps", text: "Je nourris mes projets avec joie." },
  { id: "pri-12", phase: "Printemps", text: "Je suis capable de transformer mes idées en réalité." },
  { id: "pri-13", phase: "Printemps", text: "Ma motivation revient naturellement." },

  // ------- ÉTÉ (ovulatoire) : rayonnement, confiance, connexion -------
  { id: "ete-01", phase: "Été", text: "Je rayonne de confiance aujourd'hui." },
  { id: "ete-02", phase: "Été", text: "Je m'exprime avec assurance et clarté." },
  { id: "ete-03", phase: "Été", text: "Je mérite l'amour et la reconnaissance." },
  { id: "ete-04", phase: "Été", text: "Mon énergie attire les belles rencontres." },
  { id: "ete-05", phase: "Été", text: "Je suis fière du chemin parcouru." },
  { id: "ete-06", phase: "Été", text: "Je communique avec assurance." },
  { id: "ete-07", phase: "Été", text: "Je suis digne d'être vue et entendue." },
  { id: "ete-08", phase: "Été", text: "Je célèbre ma force et ma vitalité." },
  { id: "ete-09", phase: "Été", text: "Je m'aime telle que je suis, pleinement." },
  { id: "ete-10", phase: "Été", text: "Je brille sans avoir besoin de me justifier." },
  { id: "ete-11", phase: "Été", text: "Ma présence a de la valeur." },
  { id: "ete-12", phase: "Été", text: "Je m'autorise à occuper de l'espace." },

  // ------- AUTOMNE (lutéale) : introspection, recentrage, limites -------
  { id: "aut-01", phase: "Automne", text: "Je m'accorde le droit de poser mes limites." },
  { id: "aut-02", phase: "Automne", text: "Je me recentre sur ce qui compte vraiment." },
  { id: "aut-03", phase: "Automne", text: "Mes émotions sont valables, je les accueille." },
  { id: "aut-04", phase: "Automne", text: "Je fais le tri avec douceur dans ma vie." },
  { id: "aut-05", phase: "Automne", text: "Je m'autorise à dire ce dont j'ai besoin." },
  { id: "aut-06", phase: "Automne", text: "Je lâche ce qui ne me sert plus." },
  { id: "aut-07", phase: "Automne", text: "Je m'écoute avant de me juger." },
  { id: "aut-08", phase: "Automne", text: "Je transforme ma sensibilité en clarté." },
  { id: "aut-09", phase: "Automne", text: "Je choisis la paix plutôt que la perfection." },
  { id: "aut-10", phase: "Automne", text: "Je me fais confiance, même dans le doute." },
  { id: "aut-11", phase: "Automne", text: "Je mérite douceur, même quand tout ralentit." },
  { id: "aut-12", phase: "Automne", text: "Je m'accepte pleinement, ici et maintenant." },
];

/**
 * Tire une affirmation aléatoire pour une phase donnée,
 * en évitant de répéter celles déjà utilisées dans la session/jour en cours.
 * Si toutes les affirmations de la phase ont été utilisées, on relance le cycle.
 */
export function pickAffirmation(phase: Phase, usedIds: string[]): Affirmation {
  const pool = AFFIRMATIONS.filter((a) => a.phase === phase);
  const unused = pool.filter((a) => !usedIds.includes(a.id));
  const candidates = unused.length > 0 ? unused : pool;
  const random = candidates[Math.floor(Math.random() * candidates.length)];
  return random;
}