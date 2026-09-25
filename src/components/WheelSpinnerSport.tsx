"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";
import { getFavoriWheel, setFavoriWheel, WheelCategory } from "../lib/favorites-store";

const themesData = [
  {
    name: "Ma force intérieure",
    iconPath: "/image_icone/image_Wheel-Spinner/Force_intérieure.png",
    desc: "Plongez au plus profond de vos pensées pour mieux vous comprendre.",
    objectifs: [
      "Évite de t'éparpiller, concentre-toi sur tes réponses.",
      "Prends le temps d'écrire sans aucun filtre.",
      "Accueille chaque pensée avec bienveillance."
    ],
    defis: [
      "Ma force intérieure 1",
      "Ma force intérieure 2",
      "Ma force intérieure 3",
      "Ma force intérieure 4",
      "Ma force intérieure 5",
      "Ma force intérieure 6",
      "Ma force intérieure 7",
      "Ma force intérieure 8",
      "Ma force intérieure 9",
      "Ma force intérieure 10",
      "Ma force intérieure 11",
      "Ma force intérieure 12",
      "Ma force intérieure 13",
      "Ma force intérieure 14",
      "Ma force intérieure 15",
      "Ma force intérieure 16",
      "Ma force intérieure 17",
      "Ma force intérieure 18",
      "Ma force intérieure 19",
      "Ma force intérieure 20",
      "Ma force intérieure 21",
      "Ma force intérieure 22",
      "Ma force intérieure 23",
      "Ma force intérieure 24",
      "Ma force intérieure 25",
      "Ma force intérieure 26",
      "Ma force intérieure 27",
      "Ma force intérieure 28",
      "Ma force intérieure 29",
      "Ma force intérieure 30",
      "Ma force intérieure 31",
      "Ma force intérieure 32",
      "Ma force intérieure 33",
      "Ma force intérieure 34",
      "Ma force intérieure 35",
      "Ma force intérieure 36",
      "Ma force intérieure 37"
    ]
  },
  {
    name: "Équilibre corporel",
    iconPath: "/image_icone/image_Wheel-Spinner/Équilibre_corporel.png",
    desc: "Célébrez les petites victoires et les bonheurs quotidiens.",
    objectifs: [
      "Ouvre ton cœur aux cadeaux simples de la vie.",
      "Exprime sincèrement ce que tu ressens.",
      "Prends conscience de l'abondance qui t'entoure."
    ],
    defis: [
      "Équilibre corporel 1",
      "Équilibre corporel 2",
      "Équilibre corporel 3",
      "Équilibre corporel 4",
      "Équilibre corporel 5",
      "Équilibre corporel 6",
      "Équilibre corporel 7",
      "Équilibre corporel 8",
      "Équilibre corporel 9",
      "Équilibre corporel 10",
      "Équilibre corporel 11",
      "Équilibre corporel 12",
      "Équilibre corporel 13",
      "Équilibre corporel 14",
      "Équilibre corporel 15",
      "Équilibre corporel 16",
      "Équilibre corporel 17",
      "Équilibre corporel 18",
      "Équilibre corporel 19",
      "Équilibre corporel 20",
      "Équilibre corporel 21",
      "Équilibre corporel 22",
      "Équilibre corporel 23",
      "Équilibre corporel 24",
      "Équilibre corporel 25",
      "Équilibre corporel 26",
      "Équilibre corporel 27",
      "Équilibre corporel 28",
      "Équilibre corporel 29",
      "Équilibre corporel 30",
      "Équilibre corporel 31",
      "Équilibre corporel 32",
      "Équilibre corporel 33",
      "Équilibre corporel 34",
      "Équilibre corporel 35",
      "Équilibre corporel 36",
      "Équilibre corporel 37"
    ]
  },
  {
    name: "Fluidité du corps",
    iconPath: "/image_icone/image_Wheel-Spinner/Fluidité_du_corps.png",
    desc: "Vivez l'instant présent sans jugement.",
    objectifs: [
      "Reste ancré ici et maintenant.",
      "Observe tes sensations corporelles.",
      "Ralentis ton rythme cardiaque par le souffle."
    ],
    defis: [
      "Fluidité du corps 1",
      "Fluidité du corps 2",
      "Fluidité du corps 3",
      "Fluidité du corps 4",
      "Fluidité du corps 5",
      "Fluidité du corps 6",
      "Fluidité du corps 7",
      "Fluidité du corps 8",
      "Fluidité du corps 9",
      "Fluidité du corps 10",
      "Fluidité du corps 11",
      "Fluidité du corps 12",
      "Fluidité du corps 13",
      "Fluidité du corps 14",
      "Fluidité du corps 15",
      "Fluidité du corps 16",
      "Fluidité du corps 17",
      "Fluidité du corps 18",
      "Fluidité du corps 19",
      "Fluidité du corps 20",
      "Fluidité du corps 21",
      "Fluidité du corps 22",
      "Fluidité du corps 23",
      "Fluidité du corps 24",
      "Fluidité du corps 25",
      "Fluidité du corps 26",
      "Fluidité du corps 27",
      "Fluidité du corps 28",
      "Fluidité du corps 29",
      "Fluidité du corps 30",
      "Fluidité du corps 31",
      "Fluidité du corps 32",
      "Fluidité du corps 33",
      "Fluidité du corps 34",
      "Fluidité du corps 35",
      "Fluidité du corps 36",
      "Fluidité du corps 37"
    ]
  },
  {
    name: "Énergie & Motivation",
    iconPath: "/image_icone/image_Wheel-Spinner/Énergie_&_Motivation.png",
    desc: "Accueillez et comprenez le message derrière chaque émotion.",
    objectifs: [
      "Nomme précisément ce que tu ressens.",
      "Ne refoule aucune émotion, laisse-la traverser.",
      "Fais preuve d'empathie envers toi et les autres."
    ],
    defis: [
      "Énergie & Motivation 1",
      "Énergie & Motivation 2",
      "Énergie & Motivation 3",
      "Énergie & Motivation 4",
      "Énergie & Motivation 5",
      "Énergie & Motivation 6",
      "Énergie & Motivation 7",
      "Énergie & Motivation 8",
      "Énergie & Motivation 9",
      "Énergie & Motivation 10",
      "Énergie & Motivation 11",
      "Énergie & Motivation 12",
      "Énergie & Motivation 13",
      "Énergie & Motivation 14",
      "Énergie & Motivation 15",
      "Énergie & Motivation 16",
      "Énergie & Motivation 17",
      "Énergie & Motivation 18",
      "Énergie & Motivation 19",
      "Énergie & Motivation 20",
      "Énergie & Motivation 21",
      "Énergie & Motivation 22",
      "Énergie & Motivation 23",
      "Énergie & Motivation 24",
      "Énergie & Motivation 25",
      "Énergie & Motivation 26",
      "Énergie & Motivation 27",
      "Énergie & Motivation 28",
      "Énergie & Motivation 29",
      "Énergie & Motivation 30",
      "Énergie & Motivation 31",
      "Énergie & Motivation 32",
      "Énergie & Motivation 33",
      "Énergie & Motivation 34",
      "Énergie & Motivation 35",
      "Énergie & Motivation 36",
      "Énergie & Motivation 37"
    ]
  },
  {
    name: "Écoute corporelle",
    iconPath: "/image_icone/image_Wheel-Spinner/Écoute_corporelle.png",
    desc: "Osez sortir de votre zone de confort pas à pas.",
    objectifs: [
      "Passe à l'action sans chercher la perfection.",
      "Fais confiance à tes capacités naturelles.",
      "Chaque petit pas est une grande victoire."
    ],
    defis: [
      "Écoute corporelle 1",
      "Écoute corporelle 2",
      "Écoute corporelle 3",
      "Écoute corporelle 4",
      "Écoute corporelle 5",
      "Écoute corporelle 6",
      "Écoute corporelle 7",
      "Écoute corporelle 8",
      "Écoute corporelle 9",
      "Écoute corporelle 10",
      "Écoute corporelle 11",
      "Écoute corporelle 12",
      "Écoute corporelle 13",
      "Écoute corporelle 14",
      "Écoute corporelle 15",
      "Écoute corporelle 16",
      "Écoute corporelle 17",
      "Écoute corporelle 18",
      "Écoute corporelle 19",
      "Écoute corporelle 20",
      "Écoute corporelle 21",
      "Écoute corporelle 22",
      "Écoute corporelle 23",
      "Écoute corporelle 24",
      "Écoute corporelle 25",
      "Écoute corporelle 26",
      "Écoute corporelle 27",
      "Écoute corporelle 28",
      "Écoute corporelle 29",
      "Écoute corporelle 30",
      "Écoute corporelle 31",
      "Écoute corporelle 32",
      "Écoute corporelle 33",
      "Écoute corporelle 34",
      "Écoute corporelle 35",
      "Écoute corporelle 36",
      "Écoute corporelle 37"
    ]
  },
  {
    name: "Récupération active",
    iconPath: "/image_icone/image_Wheel-Spinner/Récupération_active.png",
    desc: "Canalisez votre énergie et gérez vos impulsions.",
    objectifs: [
      "Garde ton calme face aux imprévus.",
      "Reste focus sur l'essentiel.",
      "Apprends à faire des pauses salvatrices."
    ],
    defis: [
      "Récupération active 1",
      "Récupération active 2",
      "Récupération active 3",
      "Récupération active 4",
      "Récupération active 5",
      "Récupération active 6",
      "Récupération active 7",
      "Récupération active 8",
      "Récupération active 9",
      "Récupération active 10",
      "Récupération active 11",
      "Récupération active 12",
      "Récupération active 13",
      "Récupération active 14",
      "Récupération active 15",
      "Récupération active 16",
      "Récupération active 17",
      "Récupération active 18",
      "Récupération active 19",
      "Récupération active 20",
      "Récupération active 21",
      "Récupération active 22",
      "Récupération active 23",
      "Récupération active 24",
      "Récupération active 25",
      "Récupération active 26",
      "Récupération active 27",
      "Récupération active 28",
      "Récupération active 29",
      "Récupération active 30",
      "Récupération active 31",
      "Récupération active 32",
      "Récupération active 33",
      "Récupération active 34",
      "Récupération active 35",
      "Récupération active 36",
      "Récupération active 37"
    ]
  },
  {
    name: "Le plaisir de bouger",
    iconPath: "/image_icone/image_Wheel-Spinner/Le_plaisir_de_bouger.png",
    desc: "Nourrissez votre esprit de positif et de créativité.",
    objectifs: [
      "Laisse libre cours à ton imagination.",
      "Explore de nouvelles perspectives.",
      "Entoure-toi d'idées stimulantes."
    ],
    defis: [
      "Le plaisir de bouger 1",
      "Le plaisir de bouger 2",
      "Le plaisir de bouger 3",
      "Le plaisir de bouger 4",
      "Le plaisir de bouger 5",
      "Le plaisir de bouger 6",
      "Le plaisir de bouger 7",
      "Le plaisir de bouger 8",
      "Le plaisir de bouger 9",
      "Le plaisir de bouger 10",
      "Le plaisir de bouger 11",
      "Le plaisir de bouger 12",
      "Le plaisir de bouger 13",
      "Le plaisir de bouger 14",
      "Le plaisir de bouger 15",
      "Le plaisir de bouger 16",
      "Le plaisir de bouger 17",
      "Le plaisir de bouger 18",
      "Le plaisir de bouger 19",
      "Le plaisir de bouger 20",
      "Le plaisir de bouger 21",
      "Le plaisir de bouger 22",
      "Le plaisir de bouger 23",
      "Le plaisir de bouger 24",
      "Le plaisir de bouger 25",
      "Le plaisir de bouger 26",
      "Le plaisir de bouger 27",
      "Le plaisir de bouger 28",
      "Le plaisir de bouger 29",
      "Le plaisir de bouger 30",
      "Le plaisir de bouger 31",
      "Le plaisir de bouger 32",
      "Le plaisir de bouger 33",
      "Le plaisir de bouger 34",
      "Le plaisir de bouger 35",
      "Le plaisir de bouger 36",
      "Le plaisir de bouger 37"
    ]
  },
  {
    name: "Oser se dépasser",
    iconPath: "/image_icone/image_Wheel-Spinner/Oser_se_dépasser.png",
    desc: "Prenez du temps pour écouter vos besoins fondamentaux.",
    objectifs: [
      "Accorde-toi un moment de douceur mérité.",
      "Écoute les signaux de ton corps.",
      "Reviens à ton essence."
    ],
    defis: [
      "Oser se dépasser 1",
      "Oser se dépasser 2",
      "Oser se dépasser 3",
      "Oser se dépasser 4",
      "Oser se dépasser 5",
      "Oser se dépasser 6",
      "Oser se dépasser 7",
      "Oser se dépasser 8",
      "Oser se dépasser 9",
      "Oser se dépasser 10",
      "Oser se dépasser 11",
      "Oser se dépasser 12",
      "Oser se dépasser 13",
      "Oser se dépasser 14",
      "Oser se dépasser 15",
      "Oser se dépasser 16",
      "Oser se dépasser 17",
      "Oser se dépasser 18",
      "Oser se dépasser 19",
      "Oser se dépasser 20",
      "Oser se dépasser 21",
      "Oser se dépasser 22",
      "Oser se dépasser 23",
      "Oser se dépasser 24",
      "Oser se dépasser 25",
      "Oser se dépasser 26",
      "Oser se dépasser 27",
      "Oser se dépasser 28",
      "Oser se dépasser 29",
      "Oser se dépasser 30",
      "Oser se dépasser 31",
      "Oser se dépasser 32",
      "Oser se dépasser 33",
      "Oser se dépasser 34",
      "Oser se dépasser 35",
      "Oser se dépasser 36",
      "Oser se dépasser 37"
    ]
  },
  {
    name: "Mouvement & Régularité",
    iconPath: "/image_icone/image_Wheel-Spinner/Mouvement_&_Régularité.png",
    desc: "Clarifiez vos rêves et planifiez l'avenir en toute sérénité.",
    objectifs: [
      "Évite de t'éparpiller et choisis la priorité absolue du moment.",
      "Connecte-toi à un projet ou un rêve qui a un réel sens à tes yeux.",
      "Mets des mots sur ce que tu souhaites accomplir pour commencer à le rendre concret."
    ],
    defis: [
      "Mouvement & Régularité 1",
      "Mouvement & Régularité 2",
      "Mouvement & Régularité 3",
      "Mouvement & Régularité 4",
      "Mouvement & Régularité 5",
      "Mouvement & Régularité 6",
      "Mouvement & Régularité 7",
      "Mouvement & Régularité 8",
      "Mouvement & Régularité 9",
      "Mouvement & Régularité 10",
      "Mouvement & Régularité 11",
      "Mouvement & Régularité 12",
      "Mouvement & Régularité 13",
      "Mouvement & Régularité 14",
      "Mouvement & Régularité 15",
      "Mouvement & Régularité 16",
      "Mouvement & Régularité 17",
      "Mouvement & Régularité 18",
      "Mouvement & Régularité 19",
      "Mouvement & Régularité 20",
      "Mouvement & Régularité 21",
      "Mouvement & Régularité 22",
      "Mouvement & Régularité 23",
      "Mouvement & Régularité 24",
      "Mouvement & Régularité 25",
      "Mouvement & Régularité 26",
      "Mouvement & Régularité 27",
      "Mouvement & Régularité 28",
      "Mouvement & Régularité 29",
      "Mouvement & Régularité 30",
      "Mouvement & Régularité 31",
      "Mouvement & Régularité 32",
      "Mouvement & Régularité 33",
      "Mouvement & Régularité 34",
      "Mouvement & Régularité 35",
      "Mouvement & Régularité 36",
      "Mouvement & Régularité 37"
    ]
  },
  {
    name: "Bien dans son corps",
    iconPath: "/image_icone/image_Wheel-Spinner/Bien_dans_son_corps.png",
    desc: "Libérez-vous du contrôle et acceptez le flux de la vie.",
    objectifs: [
      "Accepte ce que tu ne peux pas changer.",
      "Détends tes muscles et ton esprit.",
      "Fais confiance au processus naturel."
    ],
    defis: [
      "Bien dans son corps 1",
      "Bien dans son corps 2",
      "Bien dans son corps 3",
      "Bien dans son corps 4",
      "Bien dans son corps 5",
      "Bien dans son corps 6",
      "Bien dans son corps 7",
      "Bien dans son corps 8",
      "Bien dans son corps 9",
      "Bien dans son corps 10",
      "Bien dans son corps 11",
      "Bien dans son corps 12",
      "Bien dans son corps 13",
      "Bien dans son corps 14",
      "Bien dans son corps 15",
      "Bien dans son corps 16",
      "Bien dans son corps 17",
      "Bien dans son corps 18",
      "Bien dans son corps 19",
      "Bien dans son corps 20",
      "Bien dans son corps 21",
      "Bien dans son corps 22",
      "Bien dans son corps 23",
      "Bien dans son corps 24",
      "Bien dans son corps 25",
      "Bien dans son corps 26",
      "Bien dans son corps 27",
      "Bien dans son corps 28",
      "Bien dans son corps 29",
      "Bien dans son corps 30",
      "Bien dans son corps 31",
      "Bien dans son corps 32",
      "Bien dans son corps 33",
      "Bien dans son corps 34",
      "Bien dans son corps 35",
      "Bien dans son corps 36",
      "Bien dans son corps 37"
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
    bgCarte: "var(--color-Blanc-Violet)",
    borderCarte: "var(--color-SOREA-B1)", //LED 
    bgBulle: "var(--color-Blanc-Violet)", // Cercle indicatif
    borderBulle: "var(--color-SOREA-B2)", //Bordure du cercle indicatif
    textAccent: "var(--color-SOREA-B1)",
    socle: "var(--color-SOREA-B2)",
    socleText: "var(--color-SOREA-B2)",
    conic1: "var(--color-Blanc-Violet)",
    conic2: "var(--color-SOREA-B2)",
    pointerCenter: "var(--color-SOREA-B2)",
    pointerDot: "var(--color-SOREA-B1)",
    centerDot: "var(--color-SOREA-B2)",
    btnPrimary: "var(--color-Gris1-SOREA)",
    btnPrimaryHover: "#5d4b5a",
  },
  vibrant: {
    bgCarte: "var(--color-Blanc-Violet)",
    borderCarte: "var(--color-SOREA-B1)", //LED
    bgBulle: "var(--color-Blanc-Violet)", // Cercle indicatif
    borderBulle: "var(--color-SOREA-B2)", //Bordure du cercle indicatif
    textAccent: "var(--color-SOREA-B1)",
    socle: "var(--color-Bleu-UX)",
    socleText: "var(--color-Bleu-UX)",
    conic1: "var(--color-Blanc-Violet)",
    conic2: "var(--color-SOREA-B1)",
    pointerCenter: "var(--color-SOREA-B1)",
    pointerDot: "var(--color-SOREA-B1)",
    centerDot: "var(--color-SOREA-B2)",
    btnPrimary: "var(--color-Gris1-SOREA)",
    btnPrimaryHover: "var(--color-Gris2-SOREA)",
  }
};

// ============================================================================
// COMPOSANT
// ============================================================================
export default function WheelSpinnerSport() {
  const [isFavori, setIsFavori] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
    const [themeActif, setThemeActif] = useState<'clair' | 'vibrant'>(() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('soreaThemeActif_Sport') as 'clair' | 'vibrant' || 'clair';
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
    setIsFavori(getFavoriWheel() === "sport");
  }, []);

  const handleToggleFavori = () => {
    setFavoriWheel("sport" as WheelCategory);
    setIsFavori(true);
  };

  const basculerTheme = () => {
    setThemeActif((prev) => {
      const nouveauTheme = prev === 'clair' ? 'vibrant' : 'clair';

      if (typeof window !== 'undefined') {
        localStorage.setItem('soreaThemeActif_Sport', nouveauTheme);
        window.dispatchEvent(new Event("themeChange_Sport"));
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
              style={{ color: theme.socleText, WebkitTextStroke: '2px var(--color-SOREA-B1)', paintOrder: 'stroke fill' }}
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