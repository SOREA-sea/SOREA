"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";
import { getFavoriWheel, setFavoriWheel, WheelCategory } from "../lib/favorites-store";

const themesData = [
  {
    name: "Nourrir mon corps",
    iconPath: "/image_icone/image_Wheel-Spinner/Nourrir_mon_corps.png",
    desc: "Plongez au plus profond de vos pensées pour mieux vous comprendre.",
    objectifs: [
      "Évite de t'éparpiller, concentre-toi sur tes réponses.",
      "Prends le temps d'écrire sans aucun filtre.",
      "Accueille chaque pensée avec bienveillance."
    ],
    defis: [
      "Nourrir mon corps 1",
      "Nourrir mon corps 2",
      "Nourrir mon corps 3",
      "Nourrir mon corps 4",
      "Nourrir mon corps 5",
      "Nourrir mon corps 6",
      "Nourrir mon corps 7",
      "Nourrir mon corps 8",
      "Nourrir mon corps 9",
      "Nourrir mon corps 10",
      "Nourrir mon corps 11",
      "Nourrir mon corps 12",
      "Nourrir mon corps 13",
      "Nourrir mon corps 14",
      "Nourrir mon corps 15",
      "Nourrir mon corps 16",
      "Nourrir mon corps 17",
      "Nourrir mon corps 18",
      "Nourrir mon corps 19",
      "Nourrir mon corps 20",
      "Nourrir mon corps 21",
      "Nourrir mon corps 22",
      "Nourrir mon corps 23",
      "Nourrir mon corps 24",
      "Nourrir mon corps 25",
      "Nourrir mon corps 26",
      "Nourrir mon corps 27",
      "Nourrir mon corps 28",
      "Nourrir mon corps 29",
      "Nourrir mon corps 30",
      "Nourrir mon corps 31",
      "Nourrir mon corps 32",
      "Nourrir mon corps 33",
      "Nourrir mon corps 34",
      "Nourrir mon corps 35",
      "Nourrir mon corps 36",
      "Nourrir mon corps 37"
    ]
  },
  {
    name: "Équilibre & harmonie",
    iconPath: "/image_icone/image_Wheel-Spinner/Équilibre_&_harmonie.png",
    desc: "Célébrez les petites victoires et les bonheurs quotidiens.",
    objectifs: [
      "Ouvre ton cœur aux cadeaux simples de la vie.",
      "Exprime sincèrement ce que tu ressens.",
      "Prends conscience de l'abondance qui t'entoure."
    ],
    defis: [
      "Équilibre & harmonie 1",
      "Équilibre & harmonie 2",
      "Équilibre & harmonie 3",
      "Équilibre & harmonie 4",
      "Équilibre & harmonie 5",
      "Équilibre & harmonie 6",
      "Équilibre & harmonie 7",
      "Équilibre & harmonie 8",
      "Équilibre & harmonie 9",
      "Équilibre & harmonie 10",
      "Équilibre & harmonie 11",
      "Équilibre & harmonie 12",
      "Équilibre & harmonie 13",
      "Équilibre & harmonie 14",
      "Équilibre & harmonie 15",
      "Équilibre & harmonie 16",
      "Équilibre & harmonie 17",
      "Équilibre & harmonie 18",
      "Équilibre & harmonie 19",
      "Équilibre & harmonie 20",
      "Équilibre & harmonie 21",
      "Équilibre & harmonie 22",
      "Équilibre & harmonie 23",
      "Équilibre & harmonie 24",
      "Équilibre & harmonie 25",
      "Équilibre & harmonie 26",
      "Équilibre & harmonie 27",
      "Équilibre & harmonie 28",
      "Équilibre & harmonie 29",
      "Équilibre & harmonie 30",
      "Équilibre & harmonie 31",
      "Équilibre & harmonie 32",
      "Équilibre & harmonie 33",
      "Équilibre & harmonie 34",
      "Équilibre & harmonie 35",
      "Équilibre & harmonie 36",
      "Équilibre & harmonie 37"
    ]
  },
  {
    name: "Hydratation consciente",
    iconPath: "/image_icone/image_Wheel-Spinner/Hydratation_consciente.png",
    desc: "Vivez l'instant présent sans jugement.",
    objectifs: [
      "Reste ancré ici et maintenant.",
      "Observe tes sensations corporelles.",
      "Ralentis ton rythme cardiaque par le souffle."
    ],
    defis: [
      "Hydratation consciente 1",
      "Hydratation consciente 2",
      "Hydratation consciente 3",
      "Hydratation consciente 4",
      "Hydratation consciente 5",
      "Hydratation consciente 6",
      "Hydratation consciente 7",
      "Hydratation consciente 8",
      "Hydratation consciente 9",
      "Hydratation consciente 10",
      "Hydratation consciente 11",
      "Hydratation consciente 12",
      "Hydratation consciente 13",
      "Hydratation consciente 14",
      "Hydratation consciente 15",
      "Hydratation consciente 16",
      "Hydratation consciente 17",
      "Hydratation consciente 18",
      "Hydratation consciente 19",
      "Hydratation consciente 20",
      "Hydratation consciente 21",
      "Hydratation consciente 22",
      "Hydratation consciente 23",
      "Hydratation consciente 24",
      "Hydratation consciente 25",
      "Hydratation consciente 26",
      "Hydratation consciente 27",
      "Hydratation consciente 28",
      "Hydratation consciente 29",
      "Hydratation consciente 30",
      "Hydratation consciente 31",
      "Hydratation consciente 32",
      "Hydratation consciente 33",
      "Hydratation consciente 34",
      "Hydratation consciente 35",
      "Hydratation consciente 36",
      "Hydratation consciente 37"
    ]
  },
  {
    name: "Énergie & vitalité",
    iconPath: "/image_icone/image_Wheel-Spinner/Énergie_&_vitalité.png",
    desc: "Accueillez et comprenez le message derrière chaque émotion.",
    objectifs: [
      "Nomme précisément ce que tu ressens.",
      "Ne refoule aucune émotion, laisse-la traverser.",
      "Fais preuve d'empathie envers toi et les autres."
    ],
    defis: [
      "Énergie & vitalité 1",
      "Énergie & vitalité 2",
      "Énergie & vitalité 3",
      "Énergie & vitalité 4",
      "Énergie & vitalité 5",
      "Énergie & vitalité 6",
      "Énergie & vitalité 7",
      "Énergie & vitalité 8",
      "Énergie & vitalité 9",
      "Énergie & vitalité 10",
      "Énergie & vitalité 11",
      "Énergie & vitalité 12",
      "Énergie & vitalité 13",
      "Énergie & vitalité 14",
      "Énergie & vitalité 15",
      "Énergie & vitalité 16",
      "Énergie & vitalité 17",
      "Énergie & vitalité 18",
      "Énergie & vitalité 19",
      "Énergie & vitalité 20",
      "Énergie & vitalité 21",
      "Énergie & vitalité 22",
      "Énergie & vitalité 23",
      "Énergie & vitalité 24",
      "Énergie & vitalité 25",
      "Énergie & vitalité 26",
      "Énergie & vitalité 27",
      "Énergie & vitalité 28",
      "Énergie & vitalité 29",
      "Énergie & vitalité 30",
      "Énergie & vitalité 31",
      "Énergie & vitalité 32",
      "Énergie & vitalité 33",
      "Énergie & vitalité 34",
      "Énergie & vitalité 35",
      "Énergie & vitalité 36",
      "Énergie & vitalité 37"
    ]
  },
  {
    name: "Couleurs dans l'assiette",
    iconPath: "/image_icone/image_Wheel-Spinner/Couleurs_dans_l'assiette.png",
    desc: "Osez sortir de votre zone de confort pas à pas.",
    objectifs: [
      "Passe à l'action sans chercher la perfection.",
      "Fais confiance à tes capacités naturelles.",
      "Chaque petit pas est une grande victoire."
    ],
    defis: [
      "Couleurs dans l'assiette 1",
      "Couleurs dans l'assiette 2",
      "Couleurs dans l'assiette 3",
      "Couleurs dans l'assiette 4",
      "Couleurs dans l'assiette 5",
      "Couleurs dans l'assiette 6",
      "Couleurs dans l'assiette 7",
      "Couleurs dans l'assiette 8",
      "Couleurs dans l'assiette 9",
      "Couleurs dans l'assiette 10",
      "Couleurs dans l'assiette 11",
      "Couleurs dans l'assiette 12",
      "Couleurs dans l'assiette 13",
      "Couleurs dans l'assiette 14",
      "Couleurs dans l'assiette 15",
      "Couleurs dans l'assiette 16",
      "Couleurs dans l'assiette 17",
      "Couleurs dans l'assiette 18",
      "Couleurs dans l'assiette 19",
      "Couleurs dans l'assiette 20",
      "Couleurs dans l'assiette 21",
      "Couleurs dans l'assiette 22",
      "Couleurs dans l'assiette 23",
      "Couleurs dans l'assiette 24",
      "Couleurs dans l'assiette 25",
      "Couleurs dans l'assiette 26",
      "Couleurs dans l'assiette 27",
      "Couleurs dans l'assiette 28",
      "Couleurs dans l'assiette 29",
      "Couleurs dans l'assiette 30",
      "Couleurs dans l'assiette 31",
      "Couleurs dans l'assiette 32",
      "Couleurs dans l'assiette 33",
      "Couleurs dans l'assiette 34",
      "Couleurs dans l'assiette 35",
      "Couleurs dans l'assiette 36",
      "Couleurs dans l'assiette 37"
    ]
  },
  {
    name: "Savourer l'instant",
    iconPath: "/image_icone/image_Wheel-Spinner/Savourer_l'instant.png",
    desc: "Canalisez votre énergie et gérez vos impulsions.",
    objectifs: [
      "Garde ton calme face aux imprévus.",
      "Reste focus sur l'essentiel.",
      "Apprends à faire des pauses salvatrices."
    ],
    defis: [
      "Savourer l'instant 1",
      "Savourer l'instant 2",
      "Savourer l'instant 3",
      "Savourer l'instant 4",
      "Savourer l'instant 5",
      "Savourer l'instant 6",
      "Savourer l'instant 7",
      "Savourer l'instant 8",
      "Savourer l'instant 9",
      "Savourer l'instant 10",
      "Savourer l'instant 11",
      "Savourer l'instant 12",
      "Savourer l'instant 13",
      "Savourer l'instant 14",
      "Savourer l'instant 15",
      "Savourer l'instant 16",
      "Savourer l'instant 17",
      "Savourer l'instant 18",
      "Savourer l'instant 19",
      "Savourer l'instant 20",
      "Savourer l'instant 21",
      "Savourer l'instant 22",
      "Savourer l'instant 23",
      "Savourer l'instant 24",
      "Savourer l'instant 25",
      "Savourer l'instant 26",
      "Savourer l'instant 27",
      "Savourer l'instant 28",
      "Savourer l'instant 29",
      "Savourer l'instant 30",
      "Savourer l'instant 31",
      "Savourer l'instant 32",
      "Savourer l'instant 33",
      "Savourer l'instant 34",
      "Savourer l'instant 35",
      "Savourer l'instant 36",
      "Savourer l'instant 37"
    ]
  },
  {
    name: "Saveurs du monde",
    iconPath: "/image_icone/image_Wheel-Spinner/Saveurs_du_monde.png",
    desc: "Nourrissez votre esprit de positif et de créativité.",
    objectifs: [
      "Laisse libre cours à ton imagination.",
      "Explore de nouvelles perspectives.",
      "Entoure-toi d'idées stimulantes."
    ],
    defis: [
      "Saveurs du monde 1",
      "Saveurs du monde 2",
      "Saveurs du monde 3",
      "Saveurs du monde 4",
      "Saveurs du monde 5",
      "Saveurs du monde 6",
      "Saveurs du monde 7",
      "Saveurs du monde 8",
      "Saveurs du monde 9",
      "Saveurs du monde 10",
      "Saveurs du monde 11",
      "Saveurs du monde 12",
      "Saveurs du monde 13",
      "Saveurs du monde 14",
      "Saveurs du monde 15",
      "Saveurs du monde 16",
      "Saveurs du monde 17",
      "Saveurs du monde 18",
      "Saveurs du monde 19",
      "Saveurs du monde 20",
      "Saveurs du monde 21",
      "Saveurs du monde 22",
      "Saveurs du monde 23",
      "Saveurs du monde 24",
      "Saveurs du monde 25",
      "Saveurs du monde 26",
      "Saveurs du monde 27",
      "Saveurs du monde 28",
      "Saveurs du monde 29",
      "Saveurs du monde 30",
      "Saveurs du monde 31",
      "Saveurs du monde 32",
      "Saveurs du monde 33",
      "Saveurs du monde 34",
      "Saveurs du monde 35",
      "Saveurs du monde 36",
      "Saveurs du monde 37"
    ]
  },
  {
    name: "Digestion sereine",
    iconPath: "/image_icone/image_Wheel-Spinner/Digestion_sereine.png",
    desc: "Prenez du temps pour écouter vos besoins fondamentaux.",
    objectifs: [
      "Accorde-toi un moment de douceur mérité.",
      "Écoute les signaux de ton corps.",
      "Reviens à ton essence."
    ],
    defis: [
      "Digestion sereine 1",
      "Digestion sereine 2",
      "Digestion sereine 3",
      "Digestion sereine 4",
      "Digestion sereine 5",
      "Digestion sereine 6",
      "Digestion sereine 7",
      "Digestion sereine 8",
      "Digestion sereine 9",
      "Digestion sereine 10",
      "Digestion sereine 11",
      "Digestion sereine 12",
      "Digestion sereine 13",
      "Digestion sereine 14",
      "Digestion sereine 15",
      "Digestion sereine 16",
      "Digestion sereine 17",
      "Digestion sereine 18",
      "Digestion sereine 19",
      "Digestion sereine 20",
      "Digestion sereine 21",
      "Digestion sereine 22",
      "Digestion sereine 23",
      "Digestion sereine 24",
      "Digestion sereine 25",
      "Digestion sereine 26",
      "Digestion sereine 27",
      "Digestion sereine 28",
      "Digestion sereine 29",
      "Digestion sereine 30",
      "Digestion sereine 31",
      "Digestion sereine 32",
      "Digestion sereine 33",
      "Digestion sereine 34",
      "Digestion sereine 35",
      "Digestion sereine 36",
      "Digestion sereine 37"
    ]
  },
  {
    name: "Mon assiette intelligente",
    iconPath: "/image_icone/image_Wheel-Spinner/Mon_assiette_intelligente.png",
    desc: "Clarifiez vos rêves et planifiez l'avenir en toute sérénité.",
    objectifs: [
      "Évite de t'éparpiller et choisis la priorité absolue du moment.",
      "Connecte-toi à un projet ou un rêve qui a un réel sens à tes yeux.",
      "Mets des mots sur ce que tu souhaites accomplir pour commencer à le rendre concret."
    ],
    defis: [
      "Mon assiette intelligente 1",
      "Mon assiette intelligente 2",
      "Mon assiette intelligente 3",
      "Mon assiette intelligente 4",
      "Mon assiette intelligente 5",
      "Mon assiette intelligente 6",
      "Mon assiette intelligente 7",
      "Mon assiette intelligente 8",
      "Mon assiette intelligente 9",
      "Mon assiette intelligente 10",
      "Mon assiette intelligente 11",
      "Mon assiette intelligente 12",
      "Mon assiette intelligente 13",
      "Mon assiette intelligente 14",
      "Mon assiette intelligente 15",
      "Mon assiette intelligente 16",
      "Mon assiette intelligente 17",
      "Mon assiette intelligente 18",
      "Mon assiette intelligente 19",
      "Mon assiette intelligente 20",
      "Mon assiette intelligente 21",
      "Mon assiette intelligente 22",
      "Mon assiette intelligente 23",
      "Mon assiette intelligente 24",
      "Mon assiette intelligente 25",
      "Mon assiette intelligente 26",
      "Mon assiette intelligente 27",
      "Mon assiette intelligente 28",
      "Mon assiette intelligente 29",
      "Mon assiette intelligente 30",
      "Mon assiette intelligente 31",
      "Mon assiette intelligente 32",
      "Mon assiette intelligente 33",
      "Mon assiette intelligente 34",
      "Mon assiette intelligente 35",
      "Mon assiette intelligente 36",
      "Mon assiette intelligente 37"
    ]
  },
  {
    name: "Relation alimentaire",
    iconPath: "/image_icone/image_Wheel-Spinner/Relation_alimentaire.png",
    desc: "Libérez-vous du contrôle et acceptez le flux de la vie.",
    objectifs: [
      "Accepte ce que tu ne peux pas changer.",
      "Détends tes muscles et ton esprit.",
      "Fais confiance au processus naturel."
    ],
    defis: [
      "Relation alimentaire 1",
      "Relation alimentaire 2",
      "Relation alimentaire 3",
      "Relation alimentaire 4",
      "Relation alimentaire 5",
      "Relation alimentaire 6",
      "Relation alimentaire 7",
      "Relation alimentaire 8",
      "Relation alimentaire 9",
      "Relation alimentaire 10",
      "Relation alimentaire 11",
      "Relation alimentaire 12",
      "Relation alimentaire 13",
      "Relation alimentaire 14",
      "Relation alimentaire 15",
      "Relation alimentaire 16",
      "Relation alimentaire 17",
      "Relation alimentaire 18",
      "Relation alimentaire 19",
      "Relation alimentaire 20",
      "Relation alimentaire 21",
      "Relation alimentaire 22",
      "Relation alimentaire 23",
      "Relation alimentaire 24",
      "Relation alimentaire 25",
      "Relation alimentaire 26",
      "Relation alimentaire 27",
      "Relation alimentaire 28",
      "Relation alimentaire 29",
      "Relation alimentaire 30",
      "Relation alimentaire 31",
      "Relation alimentaire 32",
      "Relation alimentaire 33",
      "Relation alimentaire 34",
      "Relation alimentaire 35",
      "Relation alimentaire 36",
      "Relation alimentaire 37"
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
    borderCarte: "var(--color-SOREA-R1)", //LED Rose
    bgBulle: "var(--color-Blanc-Rose)", // Cercle indicatif
    borderBulle: "var(--color-SOREA-R2)", //Bordure du cercle indicatif
    textAccent: "var(--color-SOREA-R1)",
    socle: "var(--color-Rose-feature)",
    socleText: "var(--color-SOREA-R2)",
    conic1: "var(--color-Blanc-Violet)",
    conic2: "var(--color-SOREA-R2)",
    pointerCenter: "var(--color-SOREA-R2)",
    pointerDot: "var(--color-SOREA-R1)",
    centerDot: "var(--color-Rose-feature)",
    btnPrimary: "#725D6E",
    btnPrimaryHover: "#5d4b5a",
  },
  vibrant: {
    bgCarte: "var(--color-Blanc-Rose)",
    borderCarte: "var(--color-SOREA-R1)", //LED Rose
    bgBulle: "var(--color-Blanc-Rose)", // Cercle indicatif
    borderBulle: "var(--color-SOREA-R2)", //Bordure du cercle indicatif
    textAccent: "var(--color-SOREA-R1)",
    socle: "var(--color-SOREA-R2)",
    socleText: "var(--color-SOREA-R2)",
    conic1: "var(--color-Blanc-Violet)",
    conic2: "var(--color-SOREA-R1)",
    pointerCenter: "var(--color-SOREA-R1)",
    pointerDot: "var(--color-SOREA-R1)",
    centerDot: "var(--color-SOREA-R2)",
    btnPrimary: "var(--color-Gris1-SOREA)",
    btnPrimaryHover: "#5d4b5a",
  }
};

// ============================================================================
// COMPOSANT
// ============================================================================
export default function WheelSpinnerNutrition() {
  const [isFavori, setIsFavori] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
    const [themeActif, setThemeActif] = useState<'clair' | 'vibrant'>(() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('soreaThemeActif_Nutrition') as 'clair' | 'vibrant' || 'clair';
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
    setIsFavori(getFavoriWheel() === "nutrition");
  }, []);

  const handleToggleFavori = () => {
    setFavoriWheel("nutrition" as WheelCategory);
    setIsFavori(true);
  };

  const basculerTheme = () => {
    setThemeActif((prev) => {
      const nouveauTheme = prev === 'clair' ? 'vibrant' : 'clair';

      if (typeof window !== 'undefined') {
        localStorage.setItem('soreaThemeActif_Nutrition', nouveauTheme);
        window.dispatchEvent(new Event("themeChange_Nutrition"));
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

          <div className="text-[15px] font-[700] text-[#212121] text-center mb-[20px] leading-[1.4] px-[10px]">
            <strong>Défi du jour :</strong> <br />
            <span className="font-medium mt-1 inline-block">{resultatGagnant?.defiDuJour}</span>
          </div>

          <div className="h-[1px] w-full my-[15px]" style={{ background: `radial-gradient(circle, ${theme.borderCarte} 0%, transparent 100%)` }}></div>

          <div className="text-[20px] font-[800] text-[#212121] text-center mb-[15px]">Objectif</div>
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
                        
                        {/* Bouton Favoris */}
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
        
                        {/*Bouton Style / Couleur */}
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
              style={{ color: theme.socleText, WebkitTextStroke: '2px var(--color-SOREA-R1)', paintOrder: 'stroke fill' }}
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
  onClick={() => { 
    setChoixUtilisateur('oui');
    
    // Logique d'ajout du défi dans le localStorage
    if (resultatGagnant?.defiDuJour) {
      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
      const todayKey = localToday.toISOString().split('T')[0];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sorea_todos_')) {
          const stored = localStorage.getItem(key);
          let todosObj = stored ? JSON.parse(stored) : {};
          const currentTodos = todosObj[todayKey] || [];
          
          const exists = currentTodos.some((t: any) => t.text === resultatGagnant.defiDuJour);
          if (!exists) {
            todosObj[todayKey] = [
              ...currentTodos,
              { id: `${todayKey}-${Date.now()}`, text: resultatGagnant.defiDuJour, completed: false, category: 'nutrition' }
            ];
            localStorage.setItem(key, JSON.stringify(todosObj));
            window.dispatchEvent(new Event('storage'));
          }
          break;
        }
      }
    }
  }}
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