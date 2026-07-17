"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";
import { getFavoriWheel, setFavoriWheel, WheelCategory } from "../lib/favorites-store";

// --- DONNÉES DU THÈME BIEN-ÊTRE ---
const themesData = [
  {
      name: "Introspection",
      iconPath: "/image_icone/image_Wheel-Spinner/Introspection.png",
      desc: "Plongez au plus profond de vos pensées pour mieux vous comprendre.",
      objectifs: [
          "Évite de t'éparpiller, concentre-toi sur tes réponses.",
          "Prends le temps d'écrire sans aucun filtre.",
          "Accueille chaque pensée avec bienveillance."
      ],
      defis: [
          "Écris 3 qualités que tu apprécies le plus chez toi aujourd'hui.",
          "Identifie une peur récurrente et décris comment la surmonter.",
          "Note une leçon essentielle qu'une erreur passée t'a apprise.",
          "Décris en détails ta journée idéale en partant de zéro.",
          "Quel trait de ta personnalité aimerais-tu le plus cultiver ?",
          "Fais la liste de 3 choses qui te ressourcent instantanément.",
          "Écris une lettre bienveillante à ton toi d'il y a cinq ans.",
          "Quel est le plus grand changement que tu as vécu cette année ?",
          "Qu'est-ce qui te fait te sentir pleinement aligné avec tes valeurs ?",
          "Prends 5 minutes pour lister ce qui draine ton énergie."
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
          "Prends une minute pour contempler un paysage et dire merci."
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
          "Sens le souffle d'air frais entrer et sortir par tes narines."
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
          "Prends le temps de valider tes ressentis sans te juger."
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
          "Engage une conversation avec quelqu'un que tu connais peu."
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
          "Refuse une tentation impulsive aujourd'hui."
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
          "Fais une liste d'activités créatives que tu aimerais tester."
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
          "Note ce qui te fait te sentir le plus en sécurité émotionnellement."
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
          "Identifie une croyance limitante qui t'empêche d'avancer."
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
          "Confie une inquiétude à l'écrit puis ferme ton carnet."
      ]
  }
];

const raisonsIndisponibilite = [
  "J'ai du mal à me lancer aujourd'hui",
  "Ce défi ne correspond pas à mon énergie du moment",
];

function lancerConfettis() {
  const couleurs = ["#5A37AC", "#BA98F4", "#ffffff"];
  confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
  confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
  confetti({ particleCount: 60, spread: 90, origin: { x: 0.5, y: 0.5 }, colors: couleurs, scalar: 0.9, zIndex: 9999 });
}

export default function WheelSpinnerBienEtre() {
  const [isFavori, setIsFavori] = useState(false);
  
  
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

 
  useEffect(() => {
    setIsFavori(getFavoriWheel() === "bien-etre");
  }, []);

  const handleToggleFavori = () => {
    setFavoriWheel("bien-etre" as WheelCategory);
    setIsFavori(true);
  };

  // --- ROTATION AUTO (IDLE) ---
  useEffect(() => {
    if (estEnTrainDeTourner || afficherFenetreResultat) return;
    
    const rotationDeFond = () => {
      angleActuel.current += 0.15;
      if (wheelGroupRef.current) {
        wheelGroupRef.current.style.transform = `rotate(${angleActuel.current}deg)`;
      }
      idleRafRef.current = requestAnimationFrame(rotationDeFond);
    };
    idleRafRef.current = requestAnimationFrame(rotationDeFond);
    
    return () => {
      if (idleRafRef.current) cancelAnimationFrame(idleRafRef.current);
    };
  }, [estEnTrainDeTourner, afficherFenetreResultat]);

  // --- FONCTION POUR TOURNER LA ROUE ---
  const tournerLaRoue = () => {
    if (estEnTrainDeTourner) return;
    setEstEnTrainDeTourner(true);
    setAfficherFenetreResultat(false);
    setChoixUtilisateur('attente');
    setRaisonSelectionnee("");
    setRaisonPersonnalisee("");

    if (idleRafRef.current) cancelAnimationFrame(idleRafRef.current);

    
    const sectorIndex = Math.floor(Math.random() * 10);
    const angleSecteur = 360 - (sectorIndex * 36) - 18;
    const toursSuplementaires = (5 + Math.floor(Math.random() * 4)) * 360;
    const angleFinal = toursSuplementaires + angleSecteur;

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
    
    <div className="w-full flex justify-evenly items-center relative pt-24 pb-64 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- COLONNE GAUCHE : LA CARTE DÉFI + BOUTON FAVORIS --- */}
      <div className="relative w-[320px] flex flex-col">
        
        
        <div className="absolute -top-[70px] left-0 z-50">
          <button
            onClick={handleToggleFavori}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-purple-100 rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer"
          >
            <Star size={20} className={isFavori ? "fill-[#8B47FF] text-[#8B47FF]" : "text-purple-200"} />
            <span className="text-sm font-bold text-[#592592]">{isFavori ? "Roue Favorite" : "Mettre en favori"}</span>
          </button>
        </div>

        {/* LA CARTE (qui s'anime et s'affiche quand le jeu se termine) */}
        <div className={`w-full min-h-[480px] bg-[#E6DFFF] border-[2px] border-dashed border-[#7F4DC5] rounded-[24px] p-[30px_24px] shadow-[0px_10px_30px_rgba(0,0,0,0.05)] flex flex-col transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${afficherFenetreResultat ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-[40px] pointer-events-none'}`}>
          
          
          <div className="w-[72px] h-[72px] rounded-full bg-[#FEF0F9] border-[1.5px] border-[#E9D5FF] flex items-center justify-center mx-auto mb-[15px] shadow-[0px_4px_12px_rgba(127,77,197,0.08)]">
            {resultatGagnant && <img src={resultatGagnant.iconPath} alt={resultatGagnant.name} className="w-[40px] h-[40px] object-contain" />}
          </div>

          
          <div className="flex items-center justify-center gap-[6px] mb-[20px]">
            <span className="text-[#7F4DC5] text-[22px] font-[800] text-center">
              {resultatGagnant?.name}
            </span>
          </div>

          
          <div className="text-[15px] font-[700] text-[#1A1A1A] text-center mb-[20px] leading-[1.4] px-[10px]">
            <strong>Défi du jour :</strong> <br />
            <span className="font-medium mt-1 inline-block">{resultatGagnant?.defiDuJour}</span>
          </div>

          
          <div className="h-[1px] w-full my-[15px]" style={{ background: "radial-gradient(circle, #7F4DC5 0%, transparent 100%)" }}></div>
          
          
          <div className="text-[20px] font-[800] text-[#1A1A1A] text-center mb-[15px]">Objectif</div>
          <ul className="text-[14px] leading-[1.6] text-[#333333] pl-[20px] m-0 list-disc">
            {resultatGagnant?.objectifs.map((obj, i) => (
              <li key={i} className="mb-[12px]">{obj}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- COLONNE CENTRALE : LA ROUE --- */}
      <div className="flex items-center justify-center relative mt-[-55px] transform scale-[1.35] origin-top">
        
        
        <div className="absolute top-[34%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-0">
          <div className="relative w-[161.93px] h-[311px] bg-[#DBCEEF] flex justify-center items-end pb-[10px] drop-shadow-[0px_38px_26px_rgba(0,0,0,0.25)]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent pointer-events-none"></div>
            <span className="text-[#7A7385] text-[24px] font-[600] tracking-[10px] indent-[6px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]" style={{ WebkitTextStroke: '2px #FFFFFF', paintOrder: 'stroke fill' }}>SOREA</span>
          </div>
          <div className="w-[210px] h-[35px] bg-[#DBCEEF] shadow-[inset_0px_5px_15px_rgba(0,0,0,0.25)] relative" style={{ clipPath: 'polygon(7% 0%, 93% 0%, 100% 100%, 0% 100%)' }}></div>
        </div>

        
        <div className="relative w-[340px] h-[340px] flex justify-center items-center cursor-pointer" onClick={tournerLaRoue}>
          
          <div className="w-[330px] h-[330px] relative flex justify-center items-center" style={{ transformStyle: 'preserve-3d' }}>
            
            <div className="absolute inset-0 rounded-full drop-shadow-[0px_8px_15px_#000000] pointer-events-none z-[2]" style={{ background: 'radial-gradient(circle, transparent 65%, #DBCEEF 65%)', transform: 'translateZ(2px)' }}></div>
            
            
            <div ref={wheelGroupRef} className="absolute inset-0 flex justify-center items-center z-[3]" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              
              {/* Le fond coloré (Conic Gradient) */}
              <div className="absolute w-[330px] h-[330px] rounded-full flex justify-center items-center z-[1]" style={{ transform: 'translateZ(1px)', background: 'conic-gradient(#C0ACFF 0deg 36deg, #FEF0F9 36deg 72deg, #C0ACFF 72deg 108deg, #FEF0F9 108deg 144deg, #C0ACFF 144deg 180deg, #FEF0F9 180deg 216deg, #C0ACFF 216deg 252deg, #FEF0F9 252deg 288deg, #C0ACFF 288deg 324deg, #FEF0F9 324deg 360deg)' }}>
                
                
                {themesData.map((theme, i) => (
                  <div key={`icon-${i}`} className="absolute w-[25px] h-[25px] flex justify-center items-center" style={{ transform: `rotate(${i * 36 + 18}deg) translateY(-115px)` }}>
                    <img src={theme.iconPath} alt={theme.name} className="w-full h-full object-contain" />
                  </div>
                ))}

              </div>

              
              {Array.from({ length: 10 }).map((_, i) => {
                const isYellow = i % 2 === 0;
                return (
                  <div key={`dot-${i}`} className="absolute w-[8px] h-[8px] rounded-full z-[3]" style={{ 
                    background: isYellow ? 'radial-gradient(circle, #FFFFFF 0%, #FDCF5A 100%)' : 'radial-gradient(circle, #FFFFFF 0%, #7F4DC5 100%)',
                    transform: `rotate(${i * 36}deg) translateY(-159px) translateZ(3px)`,
                    transformOrigin: 'center center'
                  }}></div>
                );
              })}
            </div>
          </div>

          {/* Le duo : Pointeur + Point Central (Statique par dessus tout) */}
          <div className="absolute inset-0 z-[5] pointer-events-none">
            {/* Pointeur SVG */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[37px] h-[50px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] z-[5]">
              <svg className="w-full h-full block" viewBox="0 0 37 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sorea-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FEF0F9" />
                    <stop offset="100%" stopColor="#C0ACFF" />
                  </linearGradient>
                </defs>
                <path d="M18.5 0C8.28 0 0 8.28 0 18.5C0 29.5 18.5 50 18.5 50C18.5 50 37 29.5 37 18.5C37 8.28 28.72 0 18.5 0Z" fill="url(#sorea-grad)"/>
              </svg>
              <div className="absolute top-[14px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[16px] h-[16px]">
                <div className="w-[16px] h-[16px] rounded-full bg-[#B596FF] flex justify-center items-center shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
                  <div className="w-[8px] h-[8px] rounded-full" style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #8B47FF 100%)' }}></div>
                </div>
              </div>
            </div>
            {/* Centre de la roue */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[21.99px] h-[21.99px] bg-[#C0ACFF] rounded-full z-[10] shadow-[inset_0px_5px_4px_rgba(75,85,99,0.70),_0px_0px_20px_rgba(0,0,0,1)]"></div>
          </div>

        </div>
      </div>

      {/* --- COLONNE DROITE : BOUTONS D'ACTION --- */}
      <div className={`flex flex-col gap-[16px] w-[240px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${afficherFenetreResultat ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-[40px] pointer-events-none'}`}>
        
        {choixUtilisateur === 'attente' && (
          <>
            <button 
              onClick={() => { setChoixUtilisateur('oui'); lancerConfettis(); }} 
              className="p-[16px] bg-[#725D6E] text-white rounded-[8px] text-[15px] font-[600] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] hover:bg-[#5d4b5a] hover:-translate-y-[2px] transition-all border-none cursor-pointer"
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
          <div className="flex flex-col gap-4 text-center bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <p className="text-[#8B47FF] font-bold text-lg">Super ! Bon défi 🎉</p>
            <button onClick={reinitialiserJeu} className="text-[#4b3b5c] underline font-semibold mt-2 hover:text-[#8B47FF] cursor-pointer bg-transparent border-none">Fermer et recommencer</button>
          </div>
        )}

        {choixUtilisateur === 'non' && (
          <div className="flex flex-col gap-3 text-left bg-white p-5 rounded-2xl shadow-sm border border-purple-100">
            <label className="text-[#4b3b5c] text-[13px] font-semibold mb-1">Tu peux choisir une raison ou écrire la tienne :</label>
            <div className="flex flex-col gap-2">
              {raisonsIndisponibilite.map((raison) => (
                <button 
                  key={raison} 
                  type="button" 
                  onClick={() => setRaisonSelectionnee(raison)} 
                  className={`rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition-colors cursor-pointer ${raisonSelectionnee === raison ? 'bg-[#FEF0F9] border-2 border-[#7F4DC5] text-[#4b3b5c]' : 'bg-white border border-[#E9D5FF] text-[#4b3b5c] hover:bg-gray-50'}`}
                >
                  {raison}
                </button>
              ))}
            </div>
            <textarea 
              value={raisonPersonnalisee} 
              onChange={(e) => setRaisonPersonnalisee(e.target.value)} 
              className="w-full border border-[#E9D5FF] rounded-xl p-3 text-[13px] focus:outline-none focus:border-[#7F4DC5] resize-none mt-2" 
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