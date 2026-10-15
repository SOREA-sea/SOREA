export interface DefaultAffirmation {
  id: string;
  text: string;
}

export const defaultAffirmationsList: DefaultAffirmation[] = [
  { id: "def_1", text: "Je suis pleinement confiant(e) en mes capacités." },
  { id: "def_2", text: "Je suis serein(e) et calme en toute circonstance." },
  { id: "def_3", text: "Je cultive des relations saines et bienveillantes." },
  { id: "def_4", text: "Je m'accorde de la valeur et du respect chaque jour." },
  { id: "def_5", text: "Je suis capable d'accomplir de grandes choses." },
  { id: "def_6", text: "Je possède en moi la force nécessaire pour avancer." },
  { id: "def_7", text: "Je mérite le succès, l’amour et la paix intérieure." },
  { id: "def_8", text: "Je suis aligné(e) avec mes valeurs profondes." },
  { id: "def_9", text: "Je suis digne d'amour et de respect." },
  { id: "def_10", text: "Je choisis la paix intérieure à chaque instant." },
  { id: "def_11", text: "Je suis fier(e) de tout le chemin parcouru." },
  { id: "def_12", text: "Je mérite le bonheur et la réussite." },
  { id: "def_13", text: "Je suis maître de mes pensées et de mes choix." },
  { id: "def_14", text: "Je m'accepte pleinement tel(le) que je suis." },
  { id: "def_15", text: "Je transforme les défis en opportunités de grandir." },
  { id: "def_16", text: "Je diffuse une énergie positive autour de moi." },
  { id: "def_17", text: "Je suis en parfaite harmonie avec mon corps." },
  { id: "def_18", text: "Je crée un environnement harmonieux et apaisant." },
  { id: "def_19", text: "Je suis ouvert(e) aux bonnes opportunités qui s'offrent à moi." },
  { id: "def_20", text: "Je suis capable de surmonter tout ce qui se présente à moi." },
  { id: "def_21", text: "La gratitude m’accompagne tout au long de la journée." },
  { id: "def_22", text: "Je suis digne d’une vie belle, riche et épanouissante." },
  { id: "def_23", text: "Je choisis de vivre aujourd’hui dans la joie, l’abondance et l’amour." },
  { id: "def_24", text: "Aujourd’hui, je choisis d’avancer avec confiance." },
  { id: "def_25", text: "Je suis gratifiant(e) des bienfaits qui m'entourent." },
  { id: "def_26", text: "Je suis en paix avec mon passé et concentré sur mon avenir." },
  { id: "def_27", text: "Chaque jour est une nouvelle opportunité de réussir." },
  { id: "def_28", text: "Je suis capable d'atteindre mes objectifs et je le sais." },
  { id: "def_29", text: "Je suis capable d’atteindre mon objectif grâce à son action constante." },
  { id: "def_30", text: "Mes pensées influencent mes actions et façonnent ma réalité." },
  { id: "def_31", text: "Ma foi et ma détermination m’aident à concrétiser mes ambitions." },
  { id: "def_32", text: "Je concentre mon énergie sur la richesse que je veux créer." },
  { id: "def_33", text: "Chaque jour, je visualise clairement la vie que je désire." },
  { id: "def_34", text: "Je deviens maintenant la personne que j’ai décidé d’être." },
  { id: "def_35", text: "J’agis avec détermination jusqu’à atteindre mes objectifs." },
  { id: "def_36", text: "Je crois en ma capacité à réaliser ce qui me tient à coeur." },
  { id: "def_37", text: "Je continue de suivre ce qui me tient à cœur." },
  { id: "def_38", text: "J’attire naturellement les bonnes opportunités." },
  { id: "def_39", text: "Je suis productif(ve), concentré(e) et inspiré(e)." },
  { id: "def_40", text: "Je suis magnifique, unique et spéciale, et j’apprends à m’accepter comme je suis. Je suis aimée et appréciée." },
  { id: "def_41", text: "Je mérite le meilleur et j’ai de la valeur." },
  { id: "def_42", text: "Je crois en mon plein potentiel et en mes capacités." },
  { id: "def_43", text: "Je construis la vie que je mérite." },
  { id: "def_44", text: "Je mérite de vivre la vie de mes rêves." },
  { id: "def_45", text: "Je suis capable de relever tous les défis et de réussir tout ce que j’entreprends." },
  { id: "def_46", text: "Dans ma vie, je suis riche de baucoup de choses et je le sais." },
  { id: "def_47", text: "Le succès vient à moi facilement et régulièrement." },
  { id: "def_48", text: "Je transforme les obstacles en opportunités de me performer." },
  { id: "def_49", text: "Je me construis avec ce qui est aligné à mes valeurs." },
  { id: "def_50", text: "Je suis en harmonie avec ma définition d’une vie extraordinaire." },
  { id: "def_51", text: "Je choisis de vivre chaque journée avec une attitude positive et constructive." },
  { id: "def_52", text: "Je mérite d’être heureuse et épanouie dans tous les domaines de ma vie." },
  { id: "def_53", text: "Je peux réussir, J’oses, Je persévères, Je m’entoure des bonnes personnes, Je prends les bonnes décisions et J’attire les bonnes opportunités." },
    // ... (Générer les 365 affirmations au total suivant ces règles)
];

// Complète automatiquement le tableau jusqu'à 365 si nécessaire
while (defaultAffirmationsList.length < 365) {
  const index = defaultAffirmationsList.length + 1;
  defaultAffirmationsList.push({
    id: `def_${index}`,
    text: `Je suis en constante évolution (#${index}).`
  });
}

export function pickDefaultAffirmation(usedIds: string[]): DefaultAffirmation {
  const available = defaultAffirmationsList.filter(item => !usedIds.includes(item.id));
  const pool = available.length > 0 ? available : defaultAffirmationsList;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}