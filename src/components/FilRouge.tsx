"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

interface FilRougeProps {
  profile?: ProfileData | null;
}

const allFeatures = [
  { id: "wim-hof", src: "/image_Fil-rouge/Lotus.svg", alt: "Lotus", width: 80, height: 80, href: "/wim-hof", key: "fleure" },
  { id: "miroir", src: "/image_Fil-rouge/miroir_affirmation_manche.svg", alt: "Miroir", width: 75, height: 110, href: "/miroir", key: "miroire" },
  { id: "route", src: "/image_Fil-rouge/Wheel-Spinner.svg", alt: "Roulette", width: 80, height: 150, href: "/route", key: "roue" },
  { id: "visualisation", src: "/image_Fil-rouge/Appareil_photo.svg", alt: "Appareil photo", width: 90, height: 70, href: "/visualisation", key: "appareil" },
  { id: "mot-a-moi", src: "/image_Fil-rouge/Courrier.svg", alt: "Courrier", width: 80, height: 65, href: "/mot-a-moi", key: "enveloppe" },
];

export default function FilRouge({ profile }: FilRougeProps) {
  const router = useRouter();
  const [routineSteps, setRoutineSteps] = useState(allFeatures);
  const [giftBoxSteps, setGiftBoxSteps] = useState<typeof allFeatures>([]);
  const dragItem = useRef<{ item: any; source: "routine" | "giftbox"; index: number } | null>(null);

  // --- MAPPING DE TES IMAGES FIGMA ---
  const getBoxImage = () => {
    if (giftBoxSteps.length === 0) return "/image_fil_rouge/Cadeaux_fermé.png";
    if (giftBoxSteps.length === 5) return "/image_fil_rouge/Group 79-1.png"; // La boîte pleine

    // On récupère les éléments présents, on les trie par ordre alphabétique pour faire la clé
    const presentKeys = giftBoxSteps.map(step => step.key).sort().join("_");

    // Ton dictionnaire avec tes vrais noms de fichiers (avec les orthographes exactes de ton VSCode)
    const imageMap: Record<string, string> = {
      // 4 ÉLÉMENTS (Manque 1)
      "appareil_enveloppe_fleure_miroire": "/image_fil_rouge/sans roue.png",
      "appareil_enveloppe_miroire_roue": "/image_fil_rouge/sans-fleure_2.png",
      "appareil_enveloppe_fleure_roue": "/image_fil_rouge/sans miroire.png",
      "enveloppe_fleure_miroire_roue": "/image_fil_rouge/sans appareil photo.png",
      
      // 3 ÉLÉMENTS (Manquent 2)
      "appareil_enveloppe_miroire": "/image_fil_rouge/sans roue et fleure.png",
      "appareil_enveloppe_fleure": "/image_fil_rouge/sans roue et miroire.png",
      "appareil_fleure_miroire": "/image_fil_rouge/sans roue et eneveloppe.png",
      "enveloppe_fleure_miroire": "/image_fil_rouge/sans appreil et roue.png",
      "fleure_miroire_roue": "/image_fil_rouge/sans-appareil-envellope.png",
      "enveloppe_miroire_roue": "/image_fil_rouge/sans appareil et fleure.png",
      "enveloppe_fleure_roue": "/image_fil_rouge/sans appareil et miroire.png",

      // 2 ÉLÉMENTS (Manquent 3)
      "fleure_miroire": "/image_fil_rouge/miroire-fleure_2.png",
      "appareil_miroire": "/image_fil_rouge/juste miroire et appareil.png",

      // 1 ÉLÉMENT (Manquent 4)
      "miroire": "/image_fil_rouge/miroire_2.png",
    };

    // Retourne l'image associée, ou l'image de la boîte vide en attendant que tu crées l'image manquante
    return imageMap[presentKeys] || "/image_fil_rouge/cadeau_ouvert.png";
  };

  // --- FONCTIONS DU DRAG & DROP ---
  const handleDragStart = (e: React.DragEvent, item: any, source: "routine" | "giftbox", index: number) => {
    dragItem.current = { item, source, index };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSource: "routine" | "giftbox", targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();

    const dragged = dragItem.current;
    if (!dragged) return;

    let newRoutine = [...routineSteps];
    let newGiftBox = [...giftBoxSteps];
    let itemToMove;

    if (dragged.source === "routine") itemToMove = newRoutine.splice(dragged.index, 1)[0];
    else itemToMove = newGiftBox.splice(dragged.index, 1)[0];

    if (targetSource === "routine") {
      if (targetIndex !== undefined) newRoutine.splice(targetIndex, 0, itemToMove);
      else newRoutine.push(itemToMove);
    } else {
      newGiftBox.push(itemToMove);
    }

    setRoutineSteps(newRoutine);
    setGiftBoxSteps(newGiftBox);
    dragItem.current = null;
  };

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : "Utilisateur";
  const avatarSrc = profile?.avatarUrl || "/image_Fil-rouge/SOREA_little.png";

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <div className="bg-white rounded-[32px] border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-14 w-full flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-wide text-[#592592]">Mon Fil Rouge</h1>
          <p className="text-lg font-medium text-[#7d53b2] mt-2">Combinaison pour tous les matins</p>
        </div>

        <div 
          className="flex flex-col lg:flex-row items-center justify-center w-full min-h-[180px] relative px-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "routine")}
        >
          <div className="flex flex-col items-center text-center z-10 shrink-0">
            <span className="text-sm font-bold text-[#592592] mb-3 block truncate max-w-[140px]">
              {displayName}
            </span>
            <div className="relative w-20 h-20 rounded-full bg-white shadow-sm ring-4 ring-[#e1d5f5] flex items-center justify-center overflow-hidden">
              <Image src={avatarSrc} alt={`Avatar`} fill className="object-cover p-1 rounded-full" priority />
            </div>
          </div>

          {routineSteps.length === 0 && (
            <div className="flex-1 mx-8 text-center text-purple-300 font-medium italic border-2 border-dashed border-purple-100 rounded-2xl p-6">
              Glisse des éléments depuis ta boîte pour créer ta routine.
            </div>
          )}

          {routineSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="hidden lg:block flex-1 relative h-6 min-w-[40px] mx-2">
                <div className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url('/image_Fil-rouge/Fil-rouge.svg')" }} />
              </div>
              <div 
                className="relative flex flex-col items-center justify-center z-10 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-300"
                draggable
                onDragStart={(e) => handleDragStart(e, step, "routine", index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "routine", index)}
                onClick={(e) => handleClick(e, step.href)}
              >
                <div className="relative pointer-events-none" style={{ width: step.width, height: step.height }}>
                  <Image src={step.src} alt={step.alt} fill className="object-contain drop-shadow-md" draggable={false} />
                </div>
              </div>
            </React.Fragment>
          ))}

          {routineSteps.length > 0 && (
            <div className="hidden lg:block flex-1 relative h-6 min-w-[40px] mx-2">
              <div className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat opacity-70" style={{ backgroundImage: "url('/image_Fil-rouge/Fil-rouge.svg')" }} />
            </div>
          )}

          {routineSteps.length > 0 && (
            <div className="flex flex-col items-center text-center z-10 shrink-0 min-w-[130px]">
              <div className="relative w-16 h-16 mb-2">
                <Image src="/image_Fil-rouge/Flag.png" alt="Drapeau" fill className="object-contain" draggable={false} />
              </div>
              <div className="text-[#592592] font-black text-sm leading-tight max-w-[120px]">
                Défis introspectifs atteints
              </div>
            </div>
          )}
        </div>

        <div className="mt-16">
          <button 
            disabled={routineSteps.length === 0}
            onClick={(e) => routineSteps.length > 0 && handleClick(e, routineSteps[0].href)}
            className="bg-[#8B47FF] text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg shadow-purple-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Lancer ma routine
          </button>
        </div>
      </div>

      {/* --- LA BOÎTE À DÉFIS MAGIQUE --- */}
      <div className="mt-16 w-full flex flex-col items-center">
        <h3 className="text-xl font-bold text-[#592592] mb-2">Ta boîte à défis 🎁</h3>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Maintiens et glisse les icônes ici pour les retirer de ta routine. Tu pourras les reprendre plus tard !
        </p>
        
        <div 
          className="relative flex flex-col items-center justify-start w-full max-w-[450px] min-h-[350px] transition-all duration-300 mx-auto"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "giftbox")}
        >
          {/* L'image de la boîte générée dynamiquement */}
          <div className="relative w-72 h-72 z-0">
            <Image 
              src={getBoxImage()} 
              alt="Boîte à défis SOREA" 
              fill 
              className="object-contain drop-shadow-xl transition-all duration-500" 
              draggable={false}
            />
          </div>

          {/* Boutons invisibles par-dessus la boîte pour pouvoir "reprendre" un objet ! */}
          {giftBoxSteps.length > 0 && (
            <div className="relative z-10 flex gap-4 mt-2 px-6 py-3 bg-white/50 backdrop-blur-md rounded-2xl border border-purple-100/50 shadow-sm">
              {giftBoxSteps.map((step, index) => (
                <div
                  key={step.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, step, "giftbox", index)}
                  className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-300 bg-white p-2 rounded-xl shadow-sm border border-purple-50"
                  title={`Remettre dans la routine`}
                >
                  <div className="relative pointer-events-none" style={{ width: step.width * 0.4, height: step.height * 0.4 }}>
                    <Image src={step.src} alt={step.alt} fill className="object-contain" draggable={false} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}