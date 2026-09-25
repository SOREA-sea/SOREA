"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";
import { getFavoriWheel, setFavoriWheel, WheelCategory } from "../lib/favorites-store";

const themesData = [
  {
    name: "Introspection",
    iconPath: "/image_icone/image_Wheel-Spinner/Introspection.png",
    desc: "Plongez au plus profond de vos pensées pour mieux vous comprendre.",
    objectifs: [
      "Découvre tes principes et tes valeurs en te libérant des injonctions sociales et des jugements."
    ],
    defis: [
      "Identifie une croyance limitante et écrit son opposée.",
      "Note trois moments où tu as agi pour plaire aux autres plutôt qu'à toi-même. Surmonte cette limite et valorise ta propre valeur.",
      "Liste tes 5 valeurs fondamentales et vérifie si ton quotidien les respecte.",
      "Écris une lettre à ton enfant intérieur pour valider ses besoins ignorés et pardonner ton passé. Au moins quelques mots. ",
      "Identifie une habitude qui ne te ressemble plus.",
      "Décris ton plus grand rêve sans te censurer. Analyse le bien qu’il peut te procurer.",
      "Note une décision que tu repousses et demande toi pourquoi.",
      "Observer comment tu réagis face au conflit : fuite, soumission ou lutte ? L'objectif est de comprendre ton mécanisme, de l'accepter et de faire face désormais à toute forme d'obstacles.",
      "Écris ce qui te donne réellement de la bonne énergie et argumente autant que tu le souhaite. (ça peut être n’importe quoi ou n’importe qui comme une personne, une couleur, une activité etc.).",
      "Note ce que tu apprécies chez ta personnalité.",
      "Introspection 11",
      "Introspection 12",
      "Introspection 13",
      "Introspection 14",
      "Introspection 15",
      "Introspection 16",
      "Introspection 17",
      "Introspection 18",
      "Introspection 19",
      "Introspection 20",
      "Introspection 21",
      "Introspection 22",
      "Introspection 23",
      "Introspection 24",
      "Introspection 25",
      "Introspection 26",
      "Introspection 27",
      "Introspection 28",
      "Introspection 29",
      "Introspection 30",
      "Introspection 31",
      "Introspection 32",
      "Introspection 33",
      "Introspection 34",
      "Introspection 35",
      "Introspection 36",
      "Introspection 37"
    ]
  },
  {
    name: "Gratitude",
    iconPath: "/image_icone/image_Wheel-Spinner/Gratitude.png",
    desc: "Célébrez les petites victoires et les bonheurs quotidiens.",
    objectifs: [
      "Ouvre ton cœur aux cadeaux simples de la vie.",
      "Exprime sincèrement ce que tu ressens.",
      "Prends conscience de l'abondance qui t'entoure."
    ],
    defis: [
      "Envoie un message de remerciement inattendu à un proche.",
      "Note trois détails agréables croisés sur ton chemin aujourd'hui.",
      "Remercie-toi pour un effort difficile que tu as fourni récemment.",
      "Pense à une épreuve passée et trouve un élément positif qui en découle.",
      "Écris sur une personne qui a changé ta vie positivement.",
      "Prends le temps d'apprécier ton repas aujourd'hui sans écran.",
      "Identifie une chose matérielle que tu es heureux de posséder.",
      "Souri à trois inconnus ou collègues aujourd'hui.",
      "Fais la liste de 5 plaisirs simples qui illuminent tes journées.",
      "Prends une minute pour contempler un paysage et dire merci.",
      "Gratitude 11",
      "Gratitude 12",
      "Gratitude 13",
      "Gratitude 14",
      "Gratitude 15",
      "Gratitude 16",
      "Gratitude 17",
      "Gratitude 18",
      "Gratitude 19",
      "Gratitude 20",
      "Gratitude 21",
      "Gratitude 22",
      "Gratitude 23",
      "Gratitude 24",
      "Gratitude 25",
      "Gratitude 26",
      "Gratitude 27",
      "Gratitude 28",
      "Gratitude 29",
      "Gratitude 30",
      "Gratitude 31",
      "Gratitude 32",
      "Gratitude 33",
      "Gratitude 34",
      "Gratitude 35",
      "Gratitude 36",
      "Gratitude 37"
    ]
  },
  {
    name: "Pleine conscience",
    iconPath: "/image_icone/image_Wheel-Spinner/Pleine_conscience.png",
    desc: "Vivez l'instant présent sans jugement.",
    objectifs: [
      "Reste ancré ici et maintenant.",
      "Observe tes sensations corporelles.",
      "Ralentis ton rythme cardiaque par le souffle."
    ],
    defis: [
      "Prends 5 grandes respirations en fermant les yeux.",
      "Écoute une chanson attentivement sans rien faire d'autre.",
      "Observe un objet ordinaire pendant 2 minutes sous tous ses angles.",
      "Marche lentement en ressentant le contact de tes pieds sur le sol.",
      "Fais un scan corporel rapide de la tête aux pieds.",
      "Décris 5 choses bleues ou vertes visibles autour de toi.",
      "Pratique la respiration carrée (4s inspire, 4s blocage, 4s expire, 4s blocage) durant 1 minute.",
      "Ferme les yeux et identifie 3 bruits distincts dans ton environnement.",
      "Prends conscience de ta posture et ajuste-la pour ton confort.",
      "Sens le souffle d'air frais entrer et sortir par tes narines.",
      "Pleine conscience 11",
      "Pleine conscience 12",
      "Pleine conscience 13",
      "Pleine conscience 14",
      "Pleine conscience 15",
      "Pleine conscience 16",
      "Pleine conscience 17",
      "Pleine conscience 18",
      "Pleine conscience 19",
      "Pleine conscience 20",
      "Pleine conscience 21",
      "Pleine conscience 22",
      "Pleine conscience 23",
      "Pleine conscience 24",
      "Pleine conscience 25",
      "Pleine conscience 26",
      "Pleine conscience 27",
      "Pleine conscience 28",
      "Pleine conscience 29",
      "Pleine conscience 30",
      "Pleine conscience 31",
      "Pleine conscience 32",
      "Pleine conscience 33",
      "Pleine conscience 34",
      "Pleine conscience 35",
      "Pleine conscience 36",
      "Pleine conscience 37"
    ]
  },
  {
    name: "Intelligence émotionnelle",
    iconPath: "/image_icone/image_Wheel-Spinner/Intelligence_émotionnelle.png",
    desc: "Accueillez et comprenez le message derrière chaque émotion.",
    objectifs: [
      "Nomme précisément ce que tu ressens.",
      "Ne refoule aucune émotion, laisse-la traverser.",
      "Fais preuve d'empathie envers toi et les autres."
    ],
    defis: [
      "Prends un instant pour nommer ton émotion dominante en ce moment.",
      "Décris où se situe ton stress physiquement dans ton corps.",
      "Rappelle-toi une colère récente et trouve le besoin caché derrière.",
      "Pense à quelqu'un qui t'a agacé et essaie d'imaginer sa perspective.",
      "Écris sur une émotion complexe que tu as du mal à exprimer.",
      "Pratique l'écoute active sans couper la parole lors de ta prochaine discussion.",
      "Note 3 phrases douces à te dire quand la tristesse arrive.",
      "Identifie un déclencheur émotionnel fréquent chez toi.",
      "Fais un dessin ou gribouille l'allure qu'aurait ton humeur actuelle.",
      "Prends le temps de valider tes ressentis sans te juger.",
      "Intelligence émotionnelle 11",
      "Intelligence émotionnelle 12",
      "Intelligence émotionnelle 13",
      "Intelligence émotionnelle 14",
      "Intelligence émotionnelle 15",
      "Intelligence émotionnelle 16",
      "Intelligence émotionnelle 17",
      "Intelligence émotionnelle 18",
      "Intelligence émotionnelle 19",
      "Intelligence émotionnelle 20",
      "Intelligence émotionnelle 21",
      "Intelligence émotionnelle 22",
      "Intelligence émotionnelle 23",
      "Intelligence émotionnelle 24",
      "Intelligence émotionnelle 25",
      "Intelligence émotionnelle 26",
      "Intelligence émotionnelle 27",
      "Intelligence émotionnelle 28",
      "Intelligence émotionnelle 29",
      "Intelligence émotionnelle 30",
      "Intelligence émotionnelle 31",
      "Intelligence émotionnelle 32",
      "Intelligence émotionnelle 33",
      "Intelligence émotionnelle 34",
      "Intelligence émotionnelle 35",
      "Intelligence émotionnelle 36",
      "Intelligence émotionnelle 37"
    ]
  },
  {
    name: "Action & Confiance",
    iconPath: "/image_icone/image_Wheel-Spinner/Action_&_Défis_de_confiance.png",
    desc: "Osez sortir de votre zone de confort pas à pas.",
    objectifs: [
      "Passe à l'action sans chercher la perfection.",
      "Fais confiance à tes capacités naturelles.",
      "Chaque petit pas est une grande victoire."
    ],
    defis: [
      "Prends une décision que tu repousses depuis plusieurs jours.",
      "Fais une tâche de 5 minutes immédiatement sans procrastiner.",
      "Répète un mantra de confiance à voix haute devant le miroir.",
      "Prends contact avec quelqu'un que tu as perdu de vue.",
      "Dis non poliment à une demande qui ne te convient pas.",
      "Partage une idée en public ou lors d'une réunion.",
      "Fixe-toi un micro-défi pour cet après-midi.",
      "Écris ta plus grande réussite et relis-la fièrement.",
      "Fais une liste de tes forces (au moins 5 compétences).",
      "Engage une conversation avec quelqu'un que tu connais peu.",
      "Action & Confiance 11",
      "Action & Confiance 12",
      "Action & Confiance 13",
      "Action & Confiance 14",
      "Action & Confiance 15",
      "Action & Confiance 16",
      "Action & Confiance 17",
      "Action & Confiance 18",
      "Action & Confiance 19",
      "Action & Confiance 20",
      "Action & Confiance 21",
      "Action & Confiance 22",
      "Action & Confiance 23",
      "Action & Confiance 24",
      "Action & Confiance 25",
      "Action & Confiance 26",
      "Action & Confiance 27",
      "Action & Confiance 28",
      "Action & Confiance 29",
      "Action & Confiance 30",
      "Action & Confiance 31",
      "Action & Confiance 32",
      "Action & Confiance 33",
      "Action & Confiance 34",
      "Action & Confiance 35",
      "Action & Confiance 36",
      "Action & Confiance 37"
    ]
  },
  {
    name: "Maîtrise de soi",
    iconPath: "/image_icone/image_Wheel-Spinner/Maîtrise_de_soi.png",
    desc: "Canalisez votre énergie et gérez vos impulsions.",
    objectifs: [
      "Garde ton calme face aux imprévus.",
      "Reste focus sur l'essentiel.",
      "Apprends à faire des pauses salvatrices."
    ],
    defis: [
      "Passe la prochaine heure sans regarder ton téléphone.",
      "Attends 10 secondes avant de répondre à une question stressante.",
      "Évite de te plaindre de quoi que ce soit pendant une demi-journée.",
      "Organise et nettoie ton bureau de travail immédiatement.",
      "Établis une priorité claire pour le reste de ta journée.",
      "Résiste à une distraction immédiate (comme un réseau social).",
      "Termine une tâche commencée avant d'en ouvrir une autre.",
      "Prends une pause de 2 minutes loin de tout écran.",
      "Prépare ta liste de tâches pour demain pour te libérer l'esprit.",
      "Refuse une tentation impulsive aujourd'hui.",
      "Maîtrise de soi 11",
      "Maîtrise de soi 12",
      "Maîtrise de soi 13",
      "Maîtrise de soi 14",
      "Maîtrise de soi 15",
      "Maîtrise de soi 16",
      "Maîtrise de soi 17",
      "Maîtrise de soi 18",
      "Maîtrise de soi 19",
      "Maîtrise de soi 20",
      "Maîtrise de soi 21",
      "Maîtrise de soi 22",
      "Maîtrise de soi 23",
      "Maîtrise de soi 24",
      "Maîtrise de soi 25",
      "Maîtrise de soi 26",
      "Maîtrise de soi 27",
      "Maîtrise de soi 28",
      "Maîtrise de soi 29",
      "Maîtrise de soi 30",
      "Maîtrise de soi 31",
      "Maîtrise de soi 32",
      "Maîtrise de soi 33",
      "Maîtrise de soi 34",
      "Maîtrise de soi 35",
      "Maîtrise de soi 36",
      "Maîtrise de soi 37"
    ]
  },
  {
    name: "Inspiration",
    iconPath: "/image_icone/image_Wheel-Spinner/Inspiration.png",
    desc: "Nourrissez votre esprit de positif et de créativité.",
    objectifs: [
      "Laisse libre cours à ton imagination.",
      "Explore de nouvelles perspectives.",
      "Entoure-toi d'idées stimulantes."
    ],
    defis: [
      "Cherche et note une citation inspirante aujourd'hui.",
      "Regarde une courte vidéo ou écoute un podcast enrichissant.",
      "Écris une idée farfelue sans chercher à savoir si elle est réaliste.",
      "Change d'itinéraire ou de chemin pour rentrer chez toi aujourd'hui.",
      "Prends en photo un détail visuel que tu trouves magnifique.",
      "Pense à une personne inspirante et note une de ses qualités à imiter.",
      "Écoute un genre musical que tu n'as pas l'habitude d'écouter.",
      "Dessine ou schématise un projet qui te tient à cœur.",
      "Lis un article sur un sujet totalement nouveau pour toi.",
      "Fais une liste d'activités créatives que tu aimerais tester.",
      "Inspiration 11",
      "Inspiration 12",
      "Inspiration 13",
      "Inspiration 14",
      "Inspiration 15",
      "Inspiration 16",
      "Inspiration 17",
      "Inspiration 18",
      "Inspiration 19",
      "Inspiration 20",
      "Inspiration 21",
      "Inspiration 22",
      "Inspiration 23",
      "Inspiration 24",
      "Inspiration 25",
      "Inspiration 26",
      "Inspiration 27",
      "Inspiration 28",
      "Inspiration 29",
      "Inspiration 30",
      "Inspiration 31",
      "Inspiration 32",
      "Inspiration 33",
      "Inspiration 34",
      "Inspiration 35",
      "Inspiration 36",
      "Inspiration 37"
    ]
  },
  {
    name: "Reconnexion à soi",
    iconPath: "/image_icone/image_Wheel-Spinner/Reconnexion_à_soi.png",
    desc: "Prenez du temps pour écouter vos besoins fondamentaux.",
    objectifs: [
      "Accorde-toi un moment de douceur mérité.",
      "Écoute les signaux de ton corps.",
      "Reviens à ton essence."
    ],
    defis: [
      "Prends un bain chaud ou une douche relaxante en conscience.",
      "Prépare ton infusion ou boisson favorite et déguste-la lentement.",
      "Étire ton corps doucement pendant 3 minutes.",
      "Passe 15 minutes en pleine nature ou dans un parc.",
      "Écris ce dont tu as le plus besoin physiquement en ce moment.",
      "Débranche tous tes appareils électroniques après 21h.",
      "Fais-toi un auto-massage des mains ou du visage.",
      "Installe-toi confortablement et ferme les yeux sans objectif.",
      "Lis quelques pages d'un livre passionnant.",
      "Note ce qui te fait te sentir le plus en sécurité émotionnellement.",
      "Reconnexion à soi 11",
      "Reconnexion à soi 12",
      "Reconnexion à soi 13",
      "Reconnexion à soi 14",
      "Reconnexion à soi 15",
      "Reconnexion à soi 16",
      "Reconnexion à soi 17",
      "Reconnexion à soi 18",
      "Reconnexion à soi 19",
      "Reconnexion à soi 20",
      "Reconnexion à soi 21",
      "Reconnexion à soi 22",
      "Reconnexion à soi 23",
      "Reconnexion à soi 24",
      "Reconnexion à soi 25",
      "Reconnexion à soi 26",
      "Reconnexion à soi 27",
      "Reconnexion à soi 28",
      "Reconnexion à soi 29",
      "Reconnexion à soi 30",
      "Reconnexion à soi 31",
      "Reconnexion à soi 32",
      "Reconnexion à soi 33",
      "Reconnexion à soi 34",
      "Reconnexion à soi 35",
      "Reconnexion à soi 36",
      "Reconnexion à soi 37"
    ]
  },
  {
    name: "Vision & Projection",
    iconPath: "/image_icone/image_Wheel-Spinner/Vision_&_Projection.png",
    desc: "Clarifiez vos rêves et planifiez l'avenir en toute sérénité.",
    objectifs: [
      "Évite de t'éparpiller et choisis la priorité absolue du moment.",
      "Connecte-toi à un projet ou un rêve qui a un réel sens à tes yeux.",
      "Mets des mots sur ce que tu souhaites accomplir pour commencer à le rendre concret."
    ],
    defis: [
      "Décris un objectif qui te tient à cœur. Juste un seul.",
      "Crée une liste de 3 étapes concrètes pour atteindre ton rêve.",
      "Visualise ta vie réussie dans 2 ans les yeux fermés pendant 1 minute.",
      "Écris ta définition personnelle de la réussite.",
      "Identifie le premier petit pas que tu peux faire dès demain.",
      "Quelle est la plus grande opportunité qui s'offre à toi actuellement ?",
      "Si tu n'avais aucune peur d'échouer, que ferais-tu aujourd'hui ?",
      "Fais la liste de tes objectifs pour le mois à venir.",
      "Choisis un mot ou un symbole pour représenter ton année.",
      "Identifie une croyance limitante qui t'empêche d'avancer.",
      "Vision & Projection 11",
      "Vision & Projection 12",
      "Vision & Projection 13",
      "Vision & Projection 14",
      "Vision & Projection 15",
      "Vision & Projection 16",
      "Vision & Projection 17",
      "Vision & Projection 18",
      "Vision & Projection 19",
      "Vision & Projection 20",
      "Vision & Projection 21",
      "Vision & Projection 22",
      "Vision & Projection 23",
      "Vision & Projection 24",
      "Vision & Projection 25",
      "Vision & Projection 26",
      "Vision & Projection 27",
      "Vision & Projection 28",
      "Vision & Projection 29",
      "Vision & Projection 30",
      "Vision & Projection 31",
      "Vision & Projection 32",
      "Vision & Projection 33",
      "Vision & Projection 34",
      "Vision & Projection 35",
      "Vision & Projection 36",
      "Vision & Projection 37"
    ]
  },
  {
    name: "Lâcher-prise",
    iconPath: "/image_icone/image_Wheel-Spinner/Lâcher-prise & Libération.png",
    desc: "Libérez-vous du contrôle et acceptez le flux de la vie.",
    objectifs: [
      "Accepte ce que tu ne peux pas changer.",
      "Détends tes muscles et ton esprit.",
      "Fais confiance au processus naturel."
    ],
    defis: [
      "Écris une frustration sur un papier et déchire-le physiquement.",
      "Prends conscience d'une situation hors de ton contrôle et lâche l'affaire.",
      "Souffle un bon coup en relâchant tes épaules.",
      "Autorise-toi à ne pas être parfait aujourd'hui.",
      "Pardonne mentalement à quelqu'un ou à toi-même pour une bévue.",
      "Passe 10 minutes sans planifier ni regarder l'heure.",
      "Accepte un imprévu aujourd'hui avec le sourire.",
      "Dis 'ce n'est pas grave' à haute voix face à une petite contrariété.",
      "Fais de l'espace sur ton bureau en jetant le superflu.",
      "Confie une inquiétude à l'écrit puis ferme ton carnet.",
      "Lâcher-prise 11",
      "Lâcher-prise 12",
      "Lâcher-prise 13",
      "Lâcher-prise 14",
      "Lâcher-prise 15",
      "Lâcher-prise 16",
      "Lâcher-prise 17",
      "Lâcher-prise 18",
      "Lâcher-prise 19",
      "Lâcher-prise 20",
      "Lâcher-prise 21",
      "Lâcher-prise 22",
      "Lâcher-prise 23",
      "Lâcher-prise 24",
      "Lâcher-prise 25",
      "Lâcher-prise 26",
      "Lâcher-prise 27",
      "Lâcher-prise 28",
      "Lâcher-prise 29",
      "Lâcher-prise 30",
      "Lâcher-prise 31",
      "Lâcher-prise 32",
      "Lâcher-prise 33",
      "Lâcher-prise 34",
      "Lâcher-prise 35",
      "Lâcher-prise 36",
      "Lâcher-prise 37"
    ]
  }
];

const raisonsIndisponibilite = [
  "J'ai du mal à me lancer aujourd'hui",
  "Ce défi ne correspond pas à mon énergie du moment",
];

// ============================================================================
// THÈMES DE COULEURS — couleurs Figma exactes
// ============================================================================
const THEMES = {
  clair: {
    bgCarte: "var(--color-Blanc-Rose)",
    borderCarte: "var(--color-SOREA-V1)", //LED
    bgBulle: "var(--color-Rose-feature)", // Cercle indicatif
    borderBulle: "var(--color-SOREA-R2)",  //Bordure du cercle indicatif
    textAccent: "#var(--color-SOREA-V1)",
    socle: "#DBCEEF", // Corps
    socleText: "var(--color-SOREA-V1)", 
    conic1: "#C0ACFF",
    conic2: "var(--color-Rose-feature)",
    pointerCenter: "#DBCEEF",
    pointerDot: "var(--color-SOREA-V2)",
    centerDot: "#DBCEEF",
    btnPrimary: "var(--color-Gris1-SOREA)",
    btnPrimaryHover: "#5d4b5a",
  },
  vibrant: {
    bgCarte: "var(--color-Blanc-Rose)",
    borderCarte: "var(--color-SOREA-V1)",
    bgBulle: "var(--color-Rose-feature)",
    borderBulle: "var(--color-SOREA-R2)",
    textAccent: "var(--color-SOREA-V1)",
    socle: "var(--color-SOREA-V2)",
    socleText: "var(--color-SOREA-V1)",
    conic1: "var(--color-SOREA-V1)",
    conic2: "var(--color-Rose-feature)",
    pointerCenter: "var(--color-SOREA-V1)",
    pointerDot: "var(--color-SOREA-V1)",
    centerDot: "var(--color-SOREA-V2)",
    btnPrimary: "var(--color-Gris1-SOREA)",
    btnPrimaryHover: "#5A37AC", 
  }
};

// ============================================================================
// COMPOSANT
// ============================================================================
export default function WheelSpinnerBienEtre() {
  const [isFavori, setIsFavori] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [themeActif, setThemeActif] = useState<'clair' | 'vibrant'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('soreaThemeActif_BienEtre') as 'clair' | 'vibrant' || 'clair';
    }
    return 'clair';
  });

  const [estEnTrainDeTourner, setEstEnTrainDeTourner] = useState(false);

  const [afficherFenetreResultat, setAfficherFenetreResultat] = useState(false);
  const [resultatGagnant, setResultatGagnant] = useState<{
    name: string;
    iconPath: string;
    objectifs: string[];
    defiDuJour: string;
  } | null>(null);
  const [choixUtilisateur, setChoixUtilisateur] = useState<'attente' | 'oui' | 'non'>('attente');
  const [raisonSelectionnee, setRaisonSelectionnee] = useState("");
  const [raisonPersonnalisee, setRaisonPersonnalisee] = useState("");

  const wheelGroupRef = useRef<HTMLDivElement>(null);
  const angleActuel = useRef(0);
  const idleRafRef = useRef<number | null>(null);

  const theme = THEMES[themeActif];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsFavori(getFavoriWheel() === "bien-etre");
  }, []);

  const handleToggleFavori = () => {
    setFavoriWheel("bien-etre" as WheelCategory);
    setIsFavori(true);
  };

  const basculerTheme = () => {
    setThemeActif((prev) => {
      const nouveauTheme = prev === 'clair' ? 'vibrant' : 'clair';

      if (typeof window !== 'undefined') {
        localStorage.setItem('soreaThemeActif_BienEtre', nouveauTheme);
        window.dispatchEvent(new Event("themeChange_BienEtre"));
      }
      return nouveauTheme;
    });
  };

  useEffect(() => {
    if (estEnTrainDeTourner || afficherFenetreResultat) return;
    let derniereExecution: number | null = null;
    const rotationDeFond = (tempsActuel: number) => {
      if (!derniereExecution) derniereExecution = tempsActuel;
      const delta = tempsActuel - derniereExecution;
      derniereExecution = tempsActuel;
      angleActuel.current += 0.02 * delta;
      if (wheelGroupRef.current) {
        wheelGroupRef.current.style.transition = 'none';
        wheelGroupRef.current.style.transform = `rotate(${angleActuel.current}deg)`;
      }
      idleRafRef.current = requestAnimationFrame(rotationDeFond);
    };
    idleRafRef.current = requestAnimationFrame(rotationDeFond);
    return () => {
      if (idleRafRef.current) cancelAnimationFrame(idleRafRef.current);
    };
  }, [estEnTrainDeTourner, afficherFenetreResultat]);

  const tournerLaRoue = () => {
    if (estEnTrainDeTourner || afficherFenetreResultat) return;
    setEstEnTrainDeTourner(true);
    setAfficherFenetreResultat(false);
    setChoixUtilisateur('attente');
    setRaisonSelectionnee("");
    setRaisonPersonnalisee("");
    if (idleRafRef.current) cancelAnimationFrame(idleRafRef.current);

    const sectorIndex = Math.floor(Math.random() * 10);
    const angleSecteur = 360 - (sectorIndex * 36) - 18;
    const degresDeDepart = angleActuel.current;
    const moduloDepart = ((degresDeDepart % 360) + 360) % 360;
    let difference = angleSecteur - moduloDepart;
    if (difference <= 0) difference += 360;
    const toursSupplementaires = (5 + Math.floor(Math.random() * 3)) * 360;
    const angleFinal = degresDeDepart + difference + toursSupplementaires;

    if (wheelGroupRef.current) {
      wheelGroupRef.current.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)';
      wheelGroupRef.current.style.transform = `rotate(${angleFinal}deg)`;
    }

    setTimeout(() => {
      setEstEnTrainDeTourner(false);
      angleActuel.current = angleFinal % 360;
      if (wheelGroupRef.current) {
        wheelGroupRef.current.style.transition = 'none';
        wheelGroupRef.current.style.transform = `rotate(${angleActuel.current}deg)`;
      }
      const themeGagnant = themesData[sectorIndex];
      const randomDefi = themeGagnant.defis[Math.floor(Math.random() * themeGagnant.defis.length)];
      setResultatGagnant({
        name: themeGagnant.name,
        iconPath: themeGagnant.iconPath,
        objectifs: themeGagnant.objectifs,
        defiDuJour: randomDefi
      });
      setAfficherFenetreResultat(true);
    }, 4000);
  };

  const reinitialiserJeu = () => {
    setAfficherFenetreResultat(false);
    setResultatGagnant(null);
    setChoixUtilisateur('attente');
  };

  return (
    <div className="w-full flex justify-evenly items-center relative pt-32 pb-0" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* COLONNE GAUCHE : CARTE DÉFI */}
      <div className="relative w-[320px] flex flex-col">

        <div
          className={`w-full min-h-[480px] border-[2px] border-dashed rounded-[24px] p-[30px_24px] shadow-[0px_10px_30px_rgba(0,0,0,0.05)] flex flex-col transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${afficherFenetreResultat ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-[40px] pointer-events-none'}`}
          style={{ backgroundColor: theme.bgCarte, borderColor: theme.borderCarte }}
        >
          <div
            className="w-[72px] h-[72px] rounded-full border-[1.5px] flex items-center justify-center mx-auto mb-[15px] shadow-[0px_4px_12px_rgba(127,77,197,0.08)] transition-colors duration-500"
            style={{ backgroundColor: theme.bgBulle, borderColor: theme.borderBulle }}
          >
            {resultatGagnant && <img src={resultatGagnant.iconPath} alt={resultatGagnant.name} className="w-[40px] h-[40px] object-contain" />}
          </div>

          <div className="flex items-center justify-center gap-[6px] mb-[20px] relative">

  <span
    className="text-[22px] font-[800] text-center transition-colors duration-500"
    style={{ color: theme.textAccent }}
  >
    {resultatGagnant?.name}
  </span>

  {/* 🔽 AJOUTER À PARTIR D'ICI */}
  <div className="relative flex items-center cursor-pointer group">

    <img
  src="/image_icone/Help.svg"
  alt="Aide"
  className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110"
/>

    <div
      className="
        invisible
        opacity-0
        group-hover:visible
        group-hover:opacity-100
        transition-all
        duration-300

        absolute
        bottom-[125%]
        left-1/2
        -translate-x-1/2

        w-[220px]
        rounded-[8px]
        px-[12px]
        py-[10px]

        text-[12px]
        leading-[1.4]
        text-white
        font-normal
        text-center

        shadow-lg
        z-20
      "
      style={{ backgroundColor: theme.borderCarte }}
    >

      {themesData.find(t => t.name === resultatGagnant?.name)?.desc}

      <div
        className="
          absolute
          top-full
          left-1/2
          -translate-x-1/2
          w-0
          h-0
          border-l-[5px]
          border-r-[5px]
          border-t-[5px]
          border-l-transparent
          border-r-transparent
        "
        style={{ borderTopColor: theme.borderCarte }}
      />

    </div>

  </div>
  {/* 🔼 FIN DE L'AJOUT */}

</div>

          <div className="text-[15px] font-[700] text-[#1A1A1A] text-center mb-[20px] leading-[1.4] px-[10px]">
            <strong>Défi du jour :</strong> <br />
            <span className="font-medium mt-1 inline-block">{resultatGagnant?.defiDuJour}</span>
          </div>

          <div className="h-[1px] w-full my-[15px]" style={{ background: `radial-gradient(circle, ${theme.borderCarte} 0%, transparent 100%)` }}></div>

          <div className="text-[20px] font-[800] text-[#1A1A1A] text-center mb-[15px]">Objectif</div>
          <ul className="text-[14px] leading-[1.6] text-[#333333] pl-[20px] m-0 list-disc">
            {resultatGagnant?.objectifs.map((obj, i) => (
              <li key={i} className="mb-[12px]">{obj}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* COLONNE CENTRALE : ROUE */}
      <div className="flex items-center justify-center relative mt-[-55px] transform scale-[1.35] origin-top">
        
        {/*MENU DÉROULANT EN HAUT À DROITE DE LA ROUE */}
        <div ref={menuRef} className="absolute -top-[100px] right-[-100px] translate-x-[110px] z-50 transform scale-[0.74]">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center p-3 bg-white/90 backdrop-blur border border-purple-100 rounded-full shadow-md hover:bg-white transition-all cursor-pointer"
            >
              <img 
                src="/image_icone/OutilDéroulant.svg" 
                alt="Outils" 
                className="w-6 h-6 object-contain" 
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-purple-100 rounded-2xl shadow-xl p-2 flex flex-col gap-2 z-50">
                
                {/*Bouton Favoris */}
                <button
                  onClick={() => {
                    handleToggleFavori();
                  }}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors text-left cursor-pointer"
                >
                  <Star size={30} className={isFavori ? "fill-[#8B47FF] text-[#8B47FF]" : "text-purple-300"} />
                  <span className="text-sm font-bold text-[#592592]">
                    {isFavori ? "Roue Favorite" : "Mettre en favori"}
                  </span>
                </button>

                {/* Bouton Style / Couleur */}
                <button
                  onClick={() => {
                    basculerTheme();
                  }}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors text-left cursor-pointer"
                >
                  <img 
                    src="/image_icone/Palette-peinture_Stroke.svg" 
                    alt="Palette de style" 
                    className="w-7 h-7 object-contain" 
                  />
                  <span className="text-sm font-bold text-[#592592]">Style</span>
                </button>

              </div>
            )}
          </div>
        </div>
        {/*FIN DU MENU DÉROULANT */}

        <div className="absolute top-[34%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-0">
          <div
            className="relative w-[161.93px] h-[311px] flex justify-center items-end pb-[10px] drop-shadow-[0px_38px_26px_rgba(0,0,0,0.25)] transition-colors duration-500"
            style={{ backgroundColor: theme.socle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent pointer-events-none"></div>
            <span
              className="text-[24px] font-[600] tracking-[10px] indent-[6px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-500"
              style={{ color: theme.socleText, WebkitTextStroke: '2px #FBFAFF', paintOrder: 'stroke fill' }}
            >
              SOREA
            </span>
          </div>
          <div
            className="w-[210px] h-[35px] shadow-[inset_0px_5px_15px_rgba(0,0,0,0.25)] relative transition-colors duration-500"
            style={{ backgroundColor: theme.socle, clipPath: 'polygon(7% 0%, 93% 0%, 100% 100%, 0% 100%)' }}
          ></div>
        </div>

        <div 
          className={`relative w-[340px] h-[340px] flex justify-center items-center ${afficherFenetreResultat ? 'cursor-default' : 'cursor-pointer'}`} 
          onClick={tournerLaRoue}
        >
          <div className="w-[330px] h-[330px] relative flex justify-center items-center" style={{ transformStyle: 'preserve-3d' }}>
            <div
              className="absolute inset-0 rounded-full drop-shadow-[0px_8px_15px_#000000] pointer-events-none z-[2] transition-colors duration-500"
              style={{ background: `radial-gradient(circle, transparent 65%, ${theme.socle} 65%)`, transform: 'translateZ(2px)' }}
            ></div>

            <div
              ref={wheelGroupRef}
              className="absolute inset-0 flex justify-center items-center z-[3]"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div
                className="absolute w-[330px] h-[330px] rounded-full flex justify-center items-center z-[1] transition-colors duration-500"
                style={{
                  transform: 'translateZ(1px)',
                  background: `conic-gradient(${theme.conic1} 0deg 36deg, ${theme.conic2} 36deg 72deg, ${theme.conic1} 72deg 108deg, ${theme.conic2} 108deg 144deg, ${theme.conic1} 144deg 180deg, ${theme.conic2} 180deg 216deg, ${theme.conic1} 216deg 252deg, ${theme.conic2} 252deg 288deg, ${theme.conic1} 288deg 324deg, ${theme.conic2} 324deg 360deg)`
                }}
              >
                {themesData.map((themeObj, i) => (
                  <div
                    key={`icon-${i}`}
                    className="absolute w-[25px] h-[25px] flex justify-center items-center"
                    style={{ transform: `rotate(${i * 36 + 18}deg) translateY(-115px)` }}
                  >
                    <img src={themeObj.iconPath} alt={themeObj.name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>

              {Array.from({ length: 10 }).map((_, i) => {
                const isYellow = i % 2 === 0;
                return (
                  <div
                    key={`dot-${i}`}
                    className="absolute w-[8px] h-[8px] rounded-full z-[3] transition-colors duration-500"
                    style={{
                      background: isYellow ? 'radial-gradient(circle, #FFFFFF 0%, #FDCF5A 100%)' : `radial-gradient(circle, #FFFFFF 0%, ${theme.borderCarte} 100%)`,
                      transform: `rotate(${i * 36}deg) translateY(-159px) translateZ(3px)`,
                      transformOrigin: 'center center'
                    }}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="absolute inset-0 z-[5] pointer-events-none">
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[37px] h-[50px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] z-[5]">
              <svg className="w-full h-full block" viewBox="0 0 37 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sorea-grad-dyn" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme.conic2} />
                    <stop offset="100%" stopColor={theme.conic1} />
                  </linearGradient>
                </defs>
                <path d="M18.5 0C8.28 0 0 8.28 0 18.5C0 29.5 18.5 50 18.5 50C18.5 50 37 29.5 37 18.5C37 8.28 28.72 0 18.5 0Z" fill="url(#sorea-grad-dyn)" />
              </svg>
              <div className="absolute top-[14px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[16px] h-[16px]">
                <div
                  className="w-[16px] h-[16px] rounded-full flex justify-center items-center shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-500"
                  style={{ backgroundColor: theme.pointerCenter }}
                >
                  <div
                    className="w-[8px] h-[8px] rounded-full transition-colors duration-500"
                    style={{ background: `radial-gradient(circle, #FFFFFF 0%, ${theme.pointerDot} 100%)` }}
                  ></div>
                </div>
              </div>
            </div>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[21.99px] h-[21.99px] rounded-full z-[10] shadow-[inset_0px_5px_4px_rgba(75,85,99,0.70),_0px_0px_20px_rgba(0,0,0,1)] transition-colors duration-500"
              style={{ backgroundColor: theme.centerDot }}
            ></div>
          </div>
        </div>
      </div>

      {/* COLONNE DROITE : BOUTONS D'ACTION */}
      <div className={`flex flex-col gap-[16px] w-[240px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${afficherFenetreResultat ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-[40px] pointer-events-none'}`}>

        {choixUtilisateur === 'attente' && (
          <>
            <button
              onClick={() => { setChoixUtilisateur('oui');}}
              className="p-[16px] text-white rounded-[8px] text-[15px] font-[600] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] transition-all border-none cursor-pointer"
              style={{ backgroundColor: theme.btnPrimary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.btnPrimaryHover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.btnPrimary}
            >
              C'est parti !
            </button>
            <button
              onClick={() => setChoixUtilisateur('non')}
              className="p-[16px] bg-[#B9B2B9] text-[#333] rounded-[8px] text-[15px] font-[600] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] hover:bg-[#a59fa5] hover:-translate-y-[2px] transition-all border-none cursor-pointer"
            >
              Je ne peux pas le faire
            </button>
          </>
        )}

        {choixUtilisateur === 'oui' && (
          <div className="flex flex-col gap-4 text-center bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: theme.borderBulle }}>
            <p className="font-bold text-lg" style={{ color: theme.textAccent }}>Super ! Bon défi 🎉</p>
            <button onClick={reinitialiserJeu} className="text-[#4b3b5c] underline font-semibold mt-2 cursor-pointer bg-transparent border-none">Fermer et recommencer</button>
          </div>
        )}

        {choixUtilisateur === 'non' && (
          <div className="flex flex-col gap-3 text-left bg-white p-5 rounded-2xl shadow-sm border" style={{ borderColor: theme.borderBulle }}>
            <label className="text-[#4b3b5c] text-[13px] font-semibold mb-1">Tu peux choisir une raison ou écrire la tienne :</label>
            <div className="flex flex-col gap-2">
              {raisonsIndisponibilite.map((raison) => (
                <button
                  key={raison}
                  type="button"
                  onClick={() => setRaisonSelectionnee(raison)}
                  className="rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: raisonSelectionnee === raison ? theme.bgBulle : 'white',
                    border: `1px solid ${raisonSelectionnee === raison ? theme.borderCarte : theme.borderBulle}`,
                    color: '#4b3b5c'
                  }}
                >
                  {raison}
                </button>
              ))}
            </div>
            <textarea
              value={raisonPersonnalisee}
              onChange={(e) => setRaisonPersonnalisee(e.target.value)}
              className="w-full border rounded-xl p-3 text-[13px] focus:outline-none resize-none mt-2"
              style={{ borderColor: theme.borderBulle }}
              rows={3}
              placeholder="Écris ici pourquoi tu ne peux pas le faire..."
            />
            <button
              onClick={() => { setRaisonSelectionnee(""); setRaisonPersonnalisee(""); reinitialiserJeu(); }}
              className="bg-[#4b3b5c] text-white border-none rounded-full p-2 text-[14px] font-bold cursor-pointer mt-2 hover:bg-[#32273e] transition-colors"
            >
              Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}