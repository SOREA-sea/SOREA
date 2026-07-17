"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";
import { getFavoriWheel, setFavoriWheel, WheelCategory } from "../lib/favorites-store";

// --- DONNÉES DU THÈME SPORT ---
const themesData = [
  {
      name: "Force intérieure",
      iconPath: "/image_icone/image_Wheel-Spinner/Force_intérieure.png",
      desc: "Connecte-toi à ta force physique et repousse tes limites.",
      objectifs: [
          "Ressens la contraction de tes muscles.",
          "Garde une posture solide et ancrée.",
          "Respire profondément pendant l'effort."
      ],
      defis: [
          "Monte un escalier au lieu de prendre l'ascenseur.",
          "Fais 15 squats dès que tu te lèves de ta chaise.",
          "Porte tes courses à bout de bras pour te muscler.",
          "Tiens la position de la chaise contre un mur pendant 30 secondes.",
          "Fais une série de pompes (même sur les genoux) jusqu'à l'échec."
      ]
  },
  {
      name: "Équilibre corporel",
      iconPath: "/image_icone/image_Wheel-Spinner/Équilibre_corporel.png",
      desc: "Améliore ta stabilité et ta conscience corporelle.",
      objectifs: [
          "Fixe un point au loin pour te stabiliser.",
          "Engage ta ceinture abdominale.",
          "Reste concentré sur tes appuis."
      ],
      defis: [
          "Tiens sur un pied pendant 30 secondes les yeux ouverts.",
          "Essaie de te brosser les dents en équilibre sur une jambe.",
          "Fais la posture de l'arbre (yoga) pendant 1 minute.",
          "Marche sur une ligne imaginaire au sol en mettant un pied devant l'autre.",
          "Tiens sur un pied les yeux fermés pendant 10 secondes."
      ]
  },
  {
      name: "Fluidité du corps",
      iconPath: "/image_icone/image_Wheel-Spinner/Fluidité_du_corps.png",
      desc: "Libère tes mouvements et gagne en souplesse.",
      objectifs: [
          "Ne force pas, accompagne le mouvement.",
          "Cherche l'amplitude plutôt que la vitesse.",
          "Relâche les tensions accumulées."
      ],
      defis: [
          "Essaie une séance de danse qui ne t'est pas familière.",
          "Fais 5 minutes d'étirements dynamiques au réveil.",
          "Fais des cercles lents avec tes bras, tes poignets et tes chevilles.",
          "Mets ta chanson préférée et danse librement pendant 3 minutes.",
          "Enchaîne 3 postures de yoga (ex: chien tête en bas, cobra, enfant)."
      ]
  },
  {
      name: "Énergie & Motivation",
      iconPath: "/image_icone/image_Wheel-Spinner/Énergie_&_Motivation.png",
      desc: "Fais le plein de vitalité pour attaquer ta journée.",
      objectifs: [
          "Sens ton rythme cardiaque s'accélérer.",
          "Visualise l'énergie qui circule en toi.",
          "Garde un état d'esprit positif."
      ],
      defis: [
          "Observe ton énergie avant et après un exercice physique.",
          "Fais 20 jumping jacks le plus vite possible.",
          "Va marcher d'un pas très rapide pendant 5 minutes.",
          "Mets une musique motivante et sautille sur place.",
          "Fixe-toi un objectif sportif ambitieux pour la semaine prochaine."
      ]
  },
  {
      name: "Écoute corporelle",
      iconPath: "/image_icone/image_Wheel-Spinner/Écoute_corporelle.png",
      desc: "Sois attentif aux signaux que t'envoie ton corps.",
      objectifs: [
          "Identifie les zones de tension.",
          "Adapte l'effort à ton état de fatigue.",
          "Sois bienveillant avec toi-même."
      ],
      defis: [
          "Marche à ton rythme pendant 10 minutes en pleine conscience.",
          "Ferme les yeux et scanne ton corps pour trouver où tu es crispé.",
          "Ajuste ta posture sur ta chaise de bureau immédiatement.",
          "Si tu te sens fatigué, remplace un effort intense par des étirements.",
          "Masse-toi la nuque et les épaules pendant 2 minutes."
      ]
  },
  {
      name: "Récupération active",
      iconPath: "/image_icone/image_Wheel-Spinner/Récupération_active.png",
      desc: "Prends soin de ton corps après l'effort.",
      objectifs: [
          "Ralentis progressivement ton rythme.",
          "Hydrate-toi abondamment.",
          "Favorise la régénération musculaire."
      ],
      defis: [
          "Étire-toi longuement avant de dormir.",
          "Marche lentement pendant 5 minutes après ta séance de sport.",
          "Bois un grand verre d'eau en visualisant qu'il nettoie tes muscles.",
          "Fais 5 minutes de respiration profonde pour calmer ton système nerveux.",
          "Prends une douche en alternant eau chaude et eau fraîche sur tes jambes."
      ]
  },
  {
      name: "Le plaisir de bouger",
      iconPath: "/image_icone/image_Wheel-Spinner/Le_plaisir_de_bouger.png",
      desc: "Retrouve la joie simple de l'activité physique.",
      objectifs: [
          "Oublie la performance, cherche le fun.",
          "Souris pendant que tu t'actives.",
          "Partage ce moment si possible."
      ],
      defis: [
          "Redécouvre un ancien sport que tu aimais enfant.",
          "Fais une activité physique en plein air aujourd'hui.",
          "Propose à un ami d'aller marcher ou courir avec toi.",
          "Essaie un nouveau sport que tu n'as jamais pratiqué.",
          "Joue avec un ballon, un frisbee ou saute à la corde pendant 10 minutes."
      ]
  },
  {
      name: "Oser se dépasser",
      iconPath: "/image_icone/image_Wheel-Spinner/Oser_se_dépasser.png",
      desc: "Sors de ta zone de confort sportive.",
      objectifs: [
          "Accepte l'inconfort temporaire.",
          "Sois fier de ton audace.",
          "Célèbre ton courage."
      ],
      defis: [
          "Tiens une planche 10 secondes de plus que ton record.",
          "Cours ou marche un kilomètre de plus que d'habitude.",
          "Fais une série d'exercices que tu as tendance à éviter.",
          "Inscris-toi à un cours de sport collectif pour la semaine prochaine.",
          "Augmente légèrement la difficulté de ton entraînement du jour."
      ]
  },
  {
      name: "Mouvement & Régularité",
      iconPath: "/image_icone/image_Wheel-Spinner/Mouvement_&_Régularité.png",
      desc: "Ancre le sport dans ton quotidien de façon durable.",
      objectifs: [
          "Mise sur la constance plutôt que l'intensité.",
          "Planifie tes séances à l'avance.",
          "Crée-toi une routine agréable."
      ],
      defis: [
          "Essaie un exercice dans un nouvel horaire (ex: matin au lieu du soir).",
          "Prépare tes affaires de sport la veille pour te motiver.",
          "Fais 10 minutes de sport tous les jours cette semaine.",
          "Note tes 3 prochaines séances de sport dans ton agenda.",
          "Trouve un 'déclencheur' (ex: après le café = étirements)."
      ]
  },
  {
      name: "Bien dans son corps",
      iconPath: "/image_icone/image_Wheel-Spinner/Bien_dans_son_corps.png",
      desc: "Cultive l'amour et le respect de ton enveloppe physique.",
      objectifs: [
          "Remercie ton corps pour ce qu'il te permet de faire.",
          "Ne te compare pas aux autres.",
          "Concentre-toi sur tes sensations, pas sur ton apparence."
      ],
      defis: [
          "Écris une affirmation positive sur ton corps et lis-la à haute voix.",
          "Regarde-toi dans le miroir et fais-toi un compliment sincère.",
          "Porte une tenue de sport dans laquelle tu te sens vraiment bien.",
          "Après l'effort, remercie ton cœur et tes poumons pour leur travail.",
          "Fais une liste de 3 exploits physiques que ton corps a accomplis."
      ]
  }
];

const raisonsIndisponibilite = [
  "J'ai des douleurs musculaires aujourd'hui",
  "Je n'ai pas le temps ou l'espace nécessaire",
];

function lancerConfettis() {
  // Couleurs du thème Sport (Cyan/Teal et Blanc)
  const couleurs = ["#00CEC9", "#C0E3E1", "#ffffff"];
  confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
  confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
  confetti({ particleCount: 60, spread: 90, origin: { x: 0.5, y: 0.5 }, colors: couleurs, scalar: 0.9, zIndex: 9999 });
}

export default function WheelSpinnerSport() {
  const [isFavori, setIsFavori] = useState(false);
  
  // États de la roue et des interactions
  const [estEnTrainDeTourner, setEstEnTrainDeTourner] = useState(false);
  const [afficherFenetreResultat, setAfficherFenetreResultat] = useState(false);
  
  // On stocke le résultat complet tiré au sort
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

  // Charger les favoris au démarrage
  useEffect(() => {
    setIsFavori(getFavoriWheel() === "sport");
  }, []);

  const handleToggleFavori = () => {
    setFavoriWheel("sport" as WheelCategory);
    setIsFavori(true);
  };

  // --- ROTATION AUTO (IDLE) ---
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
    <div className="w-full flex justify-evenly items-center relative pt-32 pb-64 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- COLONNE GAUCHE : LA CARTE DÉFI + BOUTON FAVORIS --- */}
      <div className="relative w-[320px] flex flex-col">
        
        {/* BOUTON FAVORIS */}
        <div className="absolute -top-[100px] left-0 z-50">
          <button
            onClick={handleToggleFavori}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-teal-100 rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer"
          >
            <Star size={20} className={isFavori ? "fill-[#00CEC9] text-[#00CEC9]" : "text-teal-200"} />
            <span className="text-sm font-bold text-[#008F8C]">{isFavori ? "Roue Favorite" : "Mettre en favori"}</span>
          </button>
        </div>

        {/* LA CARTE - Couleurs du thème Sport */}
        <div className={`w-full min-h-[480px] bg-[#E0F7F6] border-[2px] border-dashed border-[#00CEC9] rounded-[24px] p-[30px_24px] shadow-[0px_10px_30px_rgba(0,0,0,0.05)] flex flex-col transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${afficherFenetreResultat ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-[40px] pointer-events-none'}`}>
          
          {/* Bulle d'icône */}
          <div className="w-[72px] h-[72px] rounded-full bg-[#F0FDFD] border-[1.5px] border-[#8DE2E0] flex items-center justify-center mx-auto mb-[15px] shadow-[0px_4px_12px_rgba(0,206,201,0.15)]">
            {resultatGagnant && <img src={resultatGagnant.iconPath} alt={resultatGagnant.name} className="w-[40px] h-[40px] object-contain" />}
          </div>

          {/* Header (Titre du thème) */}
          <div className="flex items-center justify-center gap-[6px] mb-[20px]">
            <span className="text-[#00CEC9] text-[22px] font-[800] text-center">
              {resultatGagnant?.name}
            </span>
          </div>

          {/* Boîte principale du Défi */}
          <div className="text-[15px] font-[700] text-[#1A1A1A] text-center mb-[20px] leading-[1.4] px-[10px]">
            <strong>Défi du jour :</strong> <br />
            <span className="font-medium mt-1 inline-block">{resultatGagnant?.defiDuJour}</span>
          </div>

          {/* Diviseur Radial */}
          <div className="h-[1px] w-full my-[15px]" style={{ background: "radial-gradient(circle, #00CEC9 0%, transparent 100%)" }}></div>
          
          {/* Section Objectifs */}
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
        
        {/* Le socle SOREA - Thème clair Sport (#C0E3E1) */}
        <div className="absolute top-[34%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-0">
          <div className="relative w-[161.93px] h-[311px] bg-[#C0E3E1] flex justify-center items-end pb-[10px] drop-shadow-[0px_38px_26px_rgba(0,0,0,0.25)]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent pointer-events-none"></div>
            <span className="text-[#6EA8A6] text-[24px] font-[600] tracking-[10px] indent-[6px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]" style={{ WebkitTextStroke: '2px #FFFFFF', paintOrder: 'stroke fill' }}>SOREA</span>
          </div>
          <div className="w-[210px] h-[35px] bg-[#C0E3E1] shadow-[inset_0px_5px_15px_rgba(0,0,0,0.25)] relative" style={{ clipPath: 'polygon(7% 0%, 93% 0%, 100% 100%, 0% 100%)' }}></div>
        </div>

        {/* Conteneur principal de la roue */}
        <div className="relative w-[340px] h-[340px] flex justify-center items-center cursor-pointer" onClick={tournerLaRoue}>
          
          <div className="w-[330px] h-[330px] relative flex justify-center items-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Ombre du tore (#C0E3E1) */}
            <div className="absolute inset-0 rounded-full drop-shadow-[0px_8px_15px_#000000] pointer-events-none z-[2]" style={{ background: 'radial-gradient(circle, transparent 65%, #C0E3E1 65%)', transform: 'translateZ(2px)' }}></div>
            
            {/* GROUPE EN ROTATION - Conic Gradient Sport (#00CEC9 & #FBFAFF) */}
            <div ref={wheelGroupRef} className="absolute inset-0 flex justify-center items-center z-[3]" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              
              <div className="absolute w-[330px] h-[330px] rounded-full flex justify-center items-center z-[1]" style={{ transform: 'translateZ(1px)', background: 'conic-gradient(#00CEC9 0deg 36deg, #FBFAFF 36deg 72deg, #00CEC9 72deg 108deg, #FBFAFF 108deg 144deg, #00CEC9 144deg 180deg, #FBFAFF 180deg 216deg, #00CEC9 216deg 252deg, #FBFAFF 252deg 288deg, #00CEC9 288deg 324deg, #FBFAFF 324deg 360deg)' }}>
                
                {/* Les 10 Icônes */}
                {themesData.map((theme, i) => (
                  <div key={`icon-${i}`} className="absolute w-[25px] h-[25px] flex justify-center items-center" style={{ transform: `rotate(${i * 36 + 18}deg) translateY(-115px)` }}>
                    <img src={theme.iconPath} alt={theme.name} className="w-full h-full object-contain" />
                  </div>
                ))}

              </div>

              {/* Les 10 Pastilles de bordure (Jaune et Cyan) */}
              {Array.from({ length: 10 }).map((_, i) => {
                const isYellow = i % 2 === 0;
                return (
                  <div key={`dot-${i}`} className="absolute w-[8px] h-[8px] rounded-full z-[3]" style={{ 
                    background: isYellow ? 'radial-gradient(circle, #FFFFFF 0%, #FDCF5A 100%)' : 'radial-gradient(circle, #FFFFFF 0%, #00CEC9 100%)',
                    transform: `rotate(${i * 36}deg) translateY(-159px) translateZ(3px)`,
                    transformOrigin: 'center center'
                  }}></div>
                );
              })}
            </div>
          </div>

          {/* Le duo : Pointeur + Point Central */}
          <div className="absolute inset-0 z-[5] pointer-events-none">
            {/* Pointeur SVG (Gradient Blanc vers Cyan) */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[37px] h-[50px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] z-[5]">
              <svg className="w-full h-full block" viewBox="0 0 37 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sorea-grad-sport" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FBFAFF" />
                    <stop offset="100%" stopColor="#00CEC9" />
                  </linearGradient>
                </defs>
                <path d="M18.5 0C8.28 0 0 8.28 0 18.5C0 29.5 18.5 50 18.5 50C18.5 50 37 29.5 37 18.5C37 8.28 28.72 0 18.5 0Z" fill="url(#sorea-grad-sport)"/>
              </svg>
              <div className="absolute top-[14px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[16px] h-[16px]">
                <div className="w-[16px] h-[16px] rounded-full bg-[#6CE1E0] flex justify-center items-center shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
                  <div className="w-[8px] h-[8px] rounded-full" style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #00CEC9 100%)' }}></div>
                </div>
              </div>
            </div>
            {/* Centre de la roue (#00CEC9) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[21.99px] h-[21.99px] bg-[#00CEC9] rounded-full z-[10] shadow-[inset_0px_5px_4px_rgba(75,85,99,0.70),_0px_0px_20px_rgba(0,0,0,1)]"></div>
          </div>

        </div>
      </div>

      {/* --- COLONNE DROITE : BOUTONS D'ACTION --- */}
      <div className={`flex flex-col gap-[16px] w-[240px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${afficherFenetreResultat ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-[40px] pointer-events-none'}`}>
        
        {choixUtilisateur === 'attente' && (
          <>
            <button 
              onClick={() => { setChoixUtilisateur('oui'); lancerConfettis(); }} 
              className="p-[16px] bg-[#00CEC9] text-white rounded-[8px] text-[15px] font-[600] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] hover:bg-[#00B3B0] hover:-translate-y-[2px] transition-all border-none cursor-pointer"
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
          <div className="flex flex-col gap-4 text-center bg-white p-6 rounded-2xl shadow-sm border border-teal-100">
            <p className="text-[#00CEC9] font-bold text-lg">Super ! Bon défi 🎉</p>
            <button onClick={reinitialiserJeu} className="text-[#4b3b5c] underline font-semibold mt-2 hover:text-[#00CEC9] cursor-pointer bg-transparent border-none">Fermer et recommencer</button>
          </div>
        )}

        {choixUtilisateur === 'non' && (
          <div className="flex flex-col gap-3 text-left bg-white p-5 rounded-2xl shadow-sm border border-teal-100">
            <label className="text-[#4b3b5c] text-[13px] font-semibold mb-1">Tu peux choisir une raison ou écrire la tienne :</label>
            <div className="flex flex-col gap-2">
              {raisonsIndisponibilite.map((raison) => (
                <button 
                  key={raison} 
                  type="button" 
                  onClick={() => setRaisonSelectionnee(raison)} 
                  className={`rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition-colors cursor-pointer ${raisonSelectionnee === raison ? 'bg-[#E0F7F6] border-2 border-[#00CEC9] text-[#1A1A1A]' : 'bg-white border border-[#C0E3E1] text-[#4b3b5c] hover:bg-gray-50'}`}
                >
                  {raison}
                </button>
              ))}
            </div>
            <textarea 
              value={raisonPersonnalisee} 
              onChange={(e) => setRaisonPersonnalisee(e.target.value)} 
              className="w-full border border-[#C0E3E1] rounded-xl p-3 text-[13px] focus:outline-none focus:border-[#00CEC9] resize-none mt-2" 
              rows={3} 
              placeholder="Écris ici pourquoi tu ne peux pas le faire..." 
            />
            <button 
              onClick={() => { setRaisonSelectionnee(""); setRaisonPersonnalisee(""); reinitialiserJeu(); }} 
              className="bg-[#1A1A1A] text-white border-none rounded-full p-2 text-[14px] font-bold cursor-pointer mt-2 hover:bg-[#333333] transition-colors"
            >
              Valider
            </button>
          </div>
        )}

      </div>
    </div>
  );
}