"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";
import { getFavoriWheel, setFavoriWheel, WheelCategory } from "../lib/favorites-store";

const categoriesData = {
  "bien-etre": {
    taches: [
      { title: "Introspection", text: "Écris ce que tu veux être dans un an" },
      { title: "Gratitude", text: "Note tous les compliments que tu as reçus (même les plus petits)" },
      { title: "Pleine Conscience", text: "Observe ta respiration pendant 5 minutes" },
      { title: "Intelligence émotionnelle", text: "Liste les personnes qui t'inspirent et précise pourquoi" },
      { title: "Action & Défis de confiance", text: "Réalise un rêve que tu repousses depuis longtemps (commence par un petit pas)" },
      { title: "Maîtrise de soi", text: "Planifie ta journée idéale et essaie de la vivre" },
      { title: "Inspiration", text: "Regarde un documentaire inspirant" },
      { title: "Reconnexion à soi", text: "Fais un détox digital pendant 12h" },
      { title: "Vision & Projection", text: "Compléter la phrase : J'aimerai que les autres sachent que..." },
      { title: "Lâcher-prise & Libération", text: "Réécris une croyance limitante puis sa version libératrice" },
    ],
    images: [
      { url: "/image_icone/image_Wheel-Spinner/Introspection.png", rotationCarte: -36 },
      { url: "/image_icone/image_Wheel-Spinner/Gratitude.png", rotationCarte: -72 },
      { url: "/image_icone/image_Wheel-Spinner/Pleine_conscience.png", rotationCarte: -108 },
      { url: "/image_icone/image_Wheel-Spinner/Intelligence_émotionnelle.png", rotationCarte: -144 },
      { url: "/image_icone/image_Wheel-Spinner/Action_&_Défis_de_confiance.png", rotationCarte: -180 },
      { url: "/image_icone/image_Wheel-Spinner/Maîtrise_de_soi.png", rotationCarte: 144 },
      { url: "/image_icone/image_Wheel-Spinner/Inspiration.png", rotationCarte: 108 },
      { url: "/image_icone/image_Wheel-Spinner/Reconnexion_à_soi.png", rotationCarte: 72 },
      { url: "/image_icone/image_Wheel-Spinner/Vision_&_Projection.png", rotationCarte: 36 },
      { url: "/image_icone/image_Wheel-Spinner/Lâcher-prise & Libération.png", rotationCarte: 0 },
    ]
  },
  "nutrition": {
    taches: [
      { title: "Nourrir mon corps", text: "Prends le temps de t'asseoir pour manger." },
      { title: "Équilibre & harmonie", text: "Manger un fruit de saison" },
      { title: "Hydratation consciente", text: "Teste une eau aromatisée maison" },
      { title: "Énergie & vitalité", text: "Remplacer un snack par des amandes" },
      { title: "Couleurs dans l'assiette", text: "Ajoute un aliment rouge à ton repas." },
      { title: "Savourer l'instant", text: "Observe les odeurs du repas." },
      { title: "Saveurs du monde", text: "Essaie un fromage inconnu, qu'il soit vegan ou non." },
      { title: "Digestion sereine", text: "Mange lentement." },
      { title: "Mon assiette intelligente", text: "Fais le bilan de tes habitudes alimentaires." },
      { title: "Relation alimentaire", text: "Choisis un repas par plaisir." },
    ],
    images: [
      { url: "/image_icone/image_Wheel-Spinner/Nourrir_mon_corps.png", rotationCarte: -36 },
      { url: "/image_icone/image_Wheel-Spinner/Équilibre_&_harmonie.png", rotationCarte: -72 },
      { url: "/image_icone/image_Wheel-Spinner/Hydratation_consciente.png", rotationCarte: -108 },
      { url: "/image_icone/image_Wheel-Spinner/Énergie_&_vitalité.png", rotationCarte: -144 },
      { url: "/image_icone/image_Wheel-Spinner/Couleurs_dans_l'assiette.png", rotationCarte: -180 },
      { url: "/image_icone/image_Wheel-Spinner/Savourer_l'instant.png", rotationCarte: 144 },
      { url: "/image_icone/image_Wheel-Spinner/Saveurs_du_monde.png", rotationCarte: 108 },
      { url: "/image_icone/image_Wheel-Spinner/Digestion_sereine.png", rotationCarte: 72 },
      { url: "/image_icone/image_Wheel-Spinner/Mon_assiette_intelligente.png", rotationCarte: 36 },
      { url: "/image_icone/image_Wheel-Spinner/Relation_alimentaire.png", rotationCarte: 0 },
    ]
  },
  "sport": {
    taches: [
      { title: "Ta force intérieure", text: "Monte un escalier au lieu de prendre l'ascenseur." },
      { title: "Équilibre corporel", text: "Tiens sur un pied pendant 30 secondes." },
      { title: "Fluidité du corps", text: "Essaie une séance de danse qui ne t'ai pas familié." },
      { title: "Énergie & Motivation", text: "Observe ton énergie avant et après un exercice physique." },
      { title: "Écoute corporelle", text: "Marche à ton rythme pendant 10 minutes." },
      { title: "Récupération active", text: "Étire-toi avant de dormir." },
      { title: "Le plaisir de bouger", text: "Redécouvre un ancien sport." },
      { title: "Oser se dépasser", text: "Tiens une planche plus longtemps." },
      { title: "Mouvement & Régularité", text: "Essaie un exercice dans un nouvel horaire." },
      { title: "Bien dans son corps", text: "Écris une affirmation positive sur ton corps." },
    ],
    images: [
      { url: "/image_icone/image_Wheel-Spinner/Force_intérieure.png", rotationCarte: -36 },
      { url: "/image_icone/image_Wheel-Spinner/Équilibre_corporel.png", rotationCarte: -72 },
      { url: "/image_icone/image_Wheel-Spinner/Fluidité_du_corps.png", rotationCarte: -108 },
      { url: "/image_icone/image_Wheel-Spinner/Énergie_&_Motivation.png", rotationCarte: -144 },
      { url: "/image_icone/image_Wheel-Spinner/Écoute_corporelle.png", rotationCarte: -180 },
      { url: "/image_icone/image_Wheel-Spinner/Récupération_active.png", rotationCarte: 144 },
      { url: "/image_icone/image_Wheel-Spinner/Le_plaisir_de_bouger.png", rotationCarte: 108 },
      { url: "/image_icone/image_Wheel-Spinner/Oser_se_dépasser.png", rotationCarte: 72 },
      { url: "/image_icone/image_Wheel-Spinner/Mouvement_&_Régularité.png", rotationCarte: 36 },
      { url: "/image_icone/image_Wheel-Spinner/Bien_dans_son_corps.png", rotationCarte: 0 },
    ]
  }
};

const getThemeForCategory = (category: string, themeType: string) => {
  if (category === "nutrition") {
    return themeType === "sorea_dark"
      ? { clair: "#FEF0F9", fonce: "#E91E63", bordure: "#FF80AB", pointeur: "#C2185B", particules: ["#E91E63", "#FF80AB", "#ffffff"] } 
      : { clair: "#FEF0F9", fonce: "#FFB2C8", bordure: "#FFD6E1", pointeur: "#FF8FAB", particules: ["#FFB2C8", "#FFD6E1", "#ffffff"] }; 
  }
  if (category === "sport") {
    return themeType === "sorea_dark"
      ? { clair: "#FEF0F9", fonce: "#00CED1", bordure: "#6CE1E0", pointeur: "#0097A7", particules: ["#00CED1", "#6CE1E0", "#ffffff"] } 
      : { clair: "#FEF0F9", fonce: "#8DE2E0", bordure: "#C4F0EE", pointeur: "#5CC2C0", particules: ["#8DE2E0", "#C4F0EE", "#ffffff"] }; 
  }
  return themeType === "sorea_dark"
    ? { clair: "#FEF0F9", fonce: "#5A37AC", bordure: "#BA98F4", pointeur: "#5A37AC", particules: ["#5A37AC", "#BA98F4", "#ffffff"] } 
    : { clair: "#FEF0F9", fonce: "#BA98F4", bordure: "#DBCEEF", pointeur: "#BA98F4", particules: ["#BA98F4", "#DBCEEF", "#ffffff"] }; 
};

const nombreDeCases = 10;
const centreX = 151.5;
const centreY = 151.5;
const rayonRoue = 140;

const raisonsIndisponibilite = [
  "J'ai du mal à me lancer aujourd'hui",
  "Ce défi ne correspond pas à mon énergie du moment",
];

function effetRalentissement(progression: number) {
  return 1 - Math.pow(1 - progression, 4);
}

function dessinerUneCase(index: number) {
  const angleParCase = (2 * Math.PI) / nombreDeCases;
  const angleDepart = index * angleParCase - Math.PI / 2;
  const angleFin = angleDepart + angleParCase;
  const pointX1 = centreX + rayonRoue * Math.cos(angleDepart);
  const pointY1 = centreY + rayonRoue * Math.sin(angleDepart);
  const pointX2 = centreX + rayonRoue * Math.cos(angleFin);
  const pointY2 = centreY + Math.sin(angleFin) * rayonRoue;
  return `M ${centreX} ${centreY} L ${pointX1} ${pointY1} A ${rayonRoue} ${rayonRoue} 0 0 1 ${pointX2} ${pointY2} Z`;
}

function getPositionIcone(index: number) {
  const angleParCase = (2 * Math.PI) / nombreDeCases;
  const angleMilieu = index * angleParCase - Math.PI / 2 + angleParCase / 2;
  const distanceCentre = rayonRoue * 0.65;
  return {
    x: Math.round(centreX + distanceCentre * Math.cos(angleMilieu)),
    y: Math.round(centreY + distanceCentre * Math.sin(angleMilieu)),
  };
}

function lancerConfettis(couleurs: string[]) {
  confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
  confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
  confetti({ particleCount: 60, spread: 90, origin: { x: 0.5, y: 0.5 }, colors: couleurs, scalar: 0.9, zIndex: 9999 });
}

interface WellbeingWheelProps {
  category?: string | null;
}

export default function RoueDuBienEtre(props: WellbeingWheelProps) {
  const categoryName = (props.category && props.category in categoriesData) 
    ? (props.category as keyof typeof categoriesData) 
    : "bien-etre";
    
  const currentData = categoriesData[categoryName];
  const listeDeTaches = currentData.taches;
  const listeImages = currentData.images;

  const referenceRoue = useRef<HTMLDivElement>(null);
  const referencePointeur = useRef<HTMLDivElement>(null);
  const animationAttenteRef = useRef<number | null>(null);
  const dernierIndexGagnant = useRef<number | null>(null);

  const [themeActif, setThemeActif] = useState<string>("original");
  const [menuThemeOuvert, setMenuThemeOuvert] = useState(false);
  const [isFavori, setIsFavori] = useState(false);
  
  const theme = getThemeForCategory(categoryName, themeActif);

  const [estEnTrainDeTourner, setEstEnTrainDeTourner] = useState(false);
  const [afficherFenetreResultat, setAfficherFenetreResultat] = useState(false);
  const [tacheGagnante, setTacheGagnante] = useState<{ title: string; text: string; icon: string; rotationCarte: number } | null>(null);
  const [indexGagnant, setIndexGagnant] = useState<number | null>(null);
  const [raisonSelectionnee, setRaisonSelectionnee] = useState("");
  const [raisonPersonnalisee, setRaisonPersonnalisee] = useState("");
  const [choixUtilisateur, setChoixUtilisateur] = useState<'attente' | 'oui' | 'non'>('attente');

  const angleActuel = useRef(0);
  const minuteurAnimationRebond = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsFavori(getFavoriWheel() === categoryName);
  }, [categoryName]);

  useEffect(() => {
    if (estEnTrainDeTourner || afficherFenetreResultat) {
      if (animationAttenteRef.current) cancelAnimationFrame(animationAttenteRef.current);
      return;
    }
    const faireTournerDoucement = () => {
      angleActuel.current += 0.15;
      if (referenceRoue.current) {
        referenceRoue.current.style.transform = `rotate(${angleActuel.current}deg)`;
      }
      animationAttenteRef.current = requestAnimationFrame(faireTournerDoucement);
    };
    animationAttenteRef.current = requestAnimationFrame(faireTournerDoucement);
    return () => {
      if (animationAttenteRef.current) cancelAnimationFrame(animationAttenteRef.current);
    };
  }, [estEnTrainDeTourner, afficherFenetreResultat]);

  const handleToggleFavori = () => {
    setFavoriWheel(categoryName as WheelCategory);
    setIsFavori(true);
  };

  const tournerLaRoue = () => {
    if (estEnTrainDeTourner) return;
    setEstEnTrainDeTourner(true);
    setAfficherFenetreResultat(false);
    setIndexGagnant(null);
    setRaisonSelectionnee("");
    setRaisonPersonnalisee("");
    setChoixUtilisateur('attente');
    setMenuThemeOuvert(false);

    let indexGagnantCible = Math.floor(Math.random() * nombreDeCases);

    if (dernierIndexGagnant.current !== null) {
      while (indexGagnantCible === dernierIndexGagnant.current) {
        indexGagnantCible = Math.floor(Math.random() * nombreDeCases);
      }
    }
    
    dernierIndexGagnant.current = indexGagnantCible;

    const angleCible = 342 - (indexGagnantCible * (360 / nombreDeCases));
    const degresDeDepart = angleActuel.current;
    const moduloDepart = ((degresDeDepart % 360) + 360) % 360;
    let difference = angleCible - moduloDepart;
    if (difference <= 0) difference += 360;
    const toursSupplementaires = Math.floor(5 + Math.random() * 5) * 360;
    const degresCibles = degresDeDepart + toursSupplementaires + difference;
    const dureeAnimationEnMs = 6000;
    let tempsDebut: number | null = null;
    let ancienPointDePassage = Math.floor(degresDeDepart / (360 / nombreDeCases));

    const animerLaRoue = (tempsActuel: number) => {
      if (!tempsDebut) tempsDebut = tempsActuel;
      const tempsEcoule = tempsActuel - tempsDebut;
      const pourcentageProgression = Math.min(tempsEcoule / dureeAnimationEnMs, 1);
      const progressionRalentie = effetRalentissement(pourcentageProgression);

      angleActuel.current = degresDeDepart + (degresCibles - degresDeDepart) * progressionRalentie;

      if (referenceRoue.current) {
        referenceRoue.current.style.transform = `rotate(${angleActuel.current}deg)`;
      }

      const nouveauPointDePassage = Math.floor(angleActuel.current / (360 / nombreDeCases));
      if (nouveauPointDePassage > ancienPointDePassage) {
        const pointeur = referencePointeur.current;
        if (pointeur) {
          pointeur.classList.remove("bump");
          void pointeur.offsetWidth;
          pointeur.classList.add("bump");
          if (minuteurAnimationRebond.current) clearTimeout(minuteurAnimationRebond.current);
          minuteurAnimationRebond.current = setTimeout(() => pointeur.classList.remove("bump"), 60);
        }
        ancienPointDePassage = nouveauPointDePassage;
      }

      if (pourcentageProgression < 1) {
        requestAnimationFrame(animerLaRoue);
      } else {
        setEstEnTrainDeTourner(false);
        setTimeout(() => {
          setIndexGagnant(indexGagnantCible);
          setTacheGagnante({ 
            title: listeDeTaches[indexGagnantCible].title,
            text: listeDeTaches[indexGagnantCible].text, 
            icon: listeImages[indexGagnantCible].url,
            rotationCarte: listeImages[indexGagnantCible].rotationCarte
          });
          setAfficherFenetreResultat(true);
          lancerConfettis(theme.particules);
        }, 400);
      }
    };

    requestAnimationFrame(animerLaRoue);
  };

  const reinitialiserJeu = () => {
    setAfficherFenetreResultat(false);
    setIndexGagnant(null);
    setChoixUtilisateur('attente');
  };

  const changerTheme = () => {
    setThemeActif(themeActif === "original" ? "sorea_dark" : "original");
    setMenuThemeOuvert(false);
  };

  return (
    <div className="w-full flex flex-col items-center py-12 mb-24 overflow-x-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        .pointer-wrap { position: absolute; top: -24px; left: 50%; margin-left: -12px; width: 24px; height: 54px; z-index: 20; transform-origin: 12px 8px; transition: transform 0.05s ease-out; }
        .pointer-wrap.bump { transform: rotate(-28deg); }
        .pointer-circle { width: 16px; height: 16px; border-radius: 50%; margin: 0 auto; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); position: relative; z-index: 2; transition: background-color 0.5s ease; }
        .pointer-tri { width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; margin: -4px auto 0; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15)); transition: border-top-color 0.5s ease; }
        @keyframes slideInRight { 0% { transform: translateX(50px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        .card-resultat { animation: slideInRight 0.5s cubic-bezier(0.17,0.67,0.1,1) forwards; }
      `}</style>

      {/* BOUTON FAVORIS */}
      <div className="absolute top-4 left-4 md:left-8 z-50">
        <button
          onClick={handleToggleFavori}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-purple-100 rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Star size={20} className={isFavori ? "fill-[#8B47FF] text-[#8B47FF]" : "text-purple-200"} />
          <span className="text-sm font-bold text-[#592592]">{isFavori ? "Roue Favorite" : "Mettre en favori"}</span>
        </button>
      </div>

      {/* BOUTON THÈME */}
      <div className="absolute top-4 right-8 md:right-12 z-50">
        <div className="relative">
          <button 
            onClick={() => setMenuThemeOuvert(!menuThemeOuvert)} 
            className="p-2 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer bg-transparent"
            aria-label="Options du thème"
          >
            <img src="/image_wheel/PointHorizontale.svg" alt="Options" className="w-6 h-6" />
          </button>

          {menuThemeOuvert && (
            <div className="absolute top-12 right-0 bg-white shadow-xl rounded-2xl p-2 flex flex-col gap-1 w-48 z-50">
              <button 
                onClick={changerTheme} 
                className="px-4 py-2 text-sm text-left rounded-xl transition-colors text-gray-700 font-medium hover:bg-gray-50"
              >
                Changer de thème
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-3 items-start pt-8">
        <div className="col-span-1" />
        <div className="col-span-1 flex flex-col items-center justify-center relative">
          <div style={{ position: "relative", zIndex: 10 }}>
            <div className="pointer-wrap" ref={referencePointeur}>
              <div className="pointer-circle" style={{ backgroundColor: theme.bordure }} />
              <div className="pointer-tri" style={{ borderTop: `26px solid ${theme.pointeur}` }} />
            </div>

            <div className="rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.32),0_2px_6px_rgba(0,0,0,0.18)]" style={{ position: "relative", width: "303px", height: "303px" }}>
              <div
                ref={referenceRoue}
                onClick={tournerLaRoue}
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "303px",
                  height: "303px",
                  cursor: estEnTrainDeTourner ? "default" : "pointer",
                  transformOrigin: "center center",
                  willChange: "transform",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#ffffff"
                }}
              >
                <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0 }}>
                  {Array.from({ length: nombreDeCases }).map((_, i) => (
                    <path key={i} d={dessinerUneCase(i)} fill={i % 2 === 0 ? theme.clair : theme.fonce} style={{ transition: "fill 0.5s ease" }} />
                  ))}
                </svg>

                <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
                  <defs>
                    <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
                      <stop offset="70%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(80,40,120,0.3)" />
                    </radialGradient>
                  </defs>
                  <circle cx="151.5" cy="151.5" r="133" fill="url(#innerShadow)" />
                </svg>

                {listeImages.map((imageObj, i) => {
                  const { x, y } = getPositionIcone(i);
                  return (
                    <img
                      key={i}
                      src={imageObj.url}
                      alt=""
                      style={{
                        position: "absolute",
                        width: "25.24px",
                        height: "25.24px",
                        left: `${x - 12.62}px`,
                        top: `${y - 12.62}px`,
                        zIndex: 2,
                        objectFit: "contain",
                      }}
                    />
                  );
                })}

                {afficherFenetreResultat && indexGagnant !== null && (
                  <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0, zIndex: 3, pointerEvents: "none" }}>
                    {Array.from({ length: nombreDeCases }).map((_, i) => {
                      if (i === indexGagnant) return null;
                      return <path key={i} d={dessinerUneCase(i)} fill="rgba(255,255,255,0.55)" />;
                    })}
                  </svg>
                )}
              </div>

              <div style={{ position: "absolute", top: 0, left: 0, width: "303px", height: "303px", pointerEvents: "none", zIndex: 5 }}>
                <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `18px solid ${theme.bordure}`, boxSizing: "border-box", zIndex: 3, boxShadow: "0 0 0 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.08)", transition: "border-color 0.5s ease" }} />

                {Array.from({ length: nombreDeCases }).map((_, i) => {
                  const angle = (i * 360) / nombreDeCases;
                  const radians = (angle * Math.PI) / 180;
                  const x = Math.round(centreX + 145 * Math.sin(radians) - 4);
                  const y = Math.round(centreY - 145 * Math.cos(radians) - 4);
                  return (
                    <div key={i} style={{ position: "absolute", width: "8px", height: "8px", borderRadius: "50%", border: `1px solid ${theme.pointeur}`, background: `radial-gradient(circle, #ffffff, ${theme.pointeur})`, boxSizing: "border-box", left: `${x}px`, top: `${y}px`, zIndex: 4, transition: "background 0.5s ease, border-color 0.5s ease" }} />
                  );
                })}

                <div style={{ position: "absolute", width: "20px", height: "20px", borderRadius: "50%", background: `radial-gradient(circle, #ffffff, ${theme.pointeur})`, border: "2px solid #fff", boxShadow: "0 0 6px rgba(0,0,0,0.2)", left: `${centreX - 10}px`, top: `${centreY - 10}px`, zIndex: 5, transition: "background 0.5s ease" }} />
              </div>
            </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-65px", zIndex: 1, position: "relative" }}>
            <div style={{ position: "relative", width: "162px", height: "150px" }}>
              <svg width="162" height="150" viewBox="0 0 162 150" style={{ position: "absolute", top: 0, left: 0 }}>
                <defs>
                  <linearGradient id="shadowLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
                    <stop offset="45%" stopColor="rgba(0,0,0,0)" />
                  </linearGradient>
                  <linearGradient id="shadowRight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="55%" stopColor="rgba(0,0,0,0)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
                  </linearGradient>
                </defs>
                <polygon points="55,0 107,0 162,150 0,150" fill={theme.bordure} style={{ transition: "fill 0.5s ease" }} />
                <polygon points="55,0 107,0 162,150 0,150" fill="url(#shadowLeft)" />
                <polygon points="55,0 107,0 162,150 0,150" fill="url(#shadowRight)" />
              </svg>
              <div style={{ position: "absolute", bottom: "12px", width: "100%", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 400, letterSpacing: "0.44em", color: "#FFFFFF", WebkitTextStroke: "1px #9b93a6", textShadow: "0px 2px 4px rgba(0,0,0,0.15)", paddingLeft: "0.44em" }}>
                SOREA
              </div>
            </div>
            <div style={{ width: "168px", height: "27px", backgroundColor: theme.bordure, boxShadow: "inset 0px 6px 10px rgba(0,0,0,0.18), inset 6px 0px 8px rgba(0,0,0,0.1), inset -6px 0px 8px rgba(0,0,0,0.1)", transition: "background-color 0.5s ease" }} />
           </div>
            </div>

         <div className="col-span-1 flex justify-start pl-8 relative z-20 pt-16">
          {afficherFenetreResultat && tacheGagnante && (
            <div className="card-resultat bg-white p-8 rounded-3xl text-center shadow-[0_12px_40px_rgba(186,152,244,0.3)] border-2 w-[340px]" style={{ borderColor: theme.bordure }}>
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm border" style={{ backgroundColor: theme.clair, borderColor: theme.bordure }}>
                  <img 
                    src={tacheGagnante.icon} 
                    alt="Thème" 
                    className="w-8 h-8 object-contain" 
                    style={{ transform: `rotate(${tacheGagnante.rotationCarte}deg)` }} 
                  />
                </div>
                <h2 style={{ color: theme.pointeur, fontSize: 20, fontWeight: 700, margin: 0, textAlign: "center" }}>
                  {tacheGagnante.title}
                </h2>
              </div>
              
              <p style={{ color: "#4b3b5c", fontSize: 16, fontWeight: 500, margin: "0 0 28px", lineHeight: 1.5, textAlign: "center" }}>
                {tacheGagnante.text}
              </p>

              {choixUtilisateur === 'attente' && (
                <div className="flex flex-col gap-4">
                  <button onClick={() => setChoixUtilisateur('oui')} style={{ background: `linear-gradient(135deg, ${theme.bordure}, ${theme.pointeur})`, color: "#fff", border: "none", borderRadius: 50, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${theme.bordure}` }}>{"C'est parti"}</button>
                  <button onClick={() => setChoixUtilisateur('non')} style={{ background: "transparent", color: theme.pointeur, border: `2px solid ${theme.bordure}`, borderRadius: 50, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }} onMouseOver={(e) => e.currentTarget.style.background = theme.clair} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>Je ne peux pas le faire</button>
                </div>
              )}

              {choixUtilisateur === 'non' && (
                <div className="flex flex-col gap-3 text-left">
                  <label className="text-[#4b3b5c] text-sm font-semibold ml-2">Tu peux choisir une raison ou écrire la tienne :</label>
                  <div className="flex flex-col gap-2">
                    {raisonsIndisponibilite.map((raison) => (
                      <button key={raison} type="button" onClick={() => setRaisonSelectionnee(raison)} className="rounded-xl px-3 py-2 text-left text-sm font-semibold" style={{ background: raisonSelectionnee === raison ? theme.clair : "#fff", color: "#4b3b5c", border: raisonSelectionnee === raison ? `2px solid ${theme.pointeur}` : `1px solid ${theme.bordure}` }}>{raison}</button>
                    ))}
                  </div>
                  <textarea value={raisonPersonnalisee} onChange={(e) => setRaisonPersonnalisee(e.target.value)} className="w-full border-2 rounded-xl p-3 text-sm focus:outline-none resize-none" style={{ borderColor: theme.bordure }} rows={4} placeholder="Écris ici pourquoi tu ne peux pas le faire..." />
                  <button onClick={() => { setRaisonSelectionnee(""); setRaisonPersonnalisee(""); reinitialiserJeu(); }} style={{ background: "#4b3b5c", color: "#fff", border: "none", borderRadius: 50, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: "8px" }}>Valider</button>
                </div>
              )}

              {choixUtilisateur === 'oui' && (
                <div className="flex flex-col gap-4">
                  <p style={{ color: theme.pointeur }} className="font-bold text-lg">Super ! Bon défi 🎉</p>
                  <button onClick={reinitialiserJeu} style={{ background: "transparent", color: "#4b3b5c", textDecoration: "underline", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Fermer</button>
                </div>
              )}
            </div>
          )}
          </div>
          </div>
          </div>
  );
}