"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Trash2, Pencil, RotateCcw } from "lucide-react";

// La combinaison par défaut de SOREA
const defaultRoutine = [
  {
    id: "wim-hof",
    title: "Séance de Respiration",
    img: "/image_ambassadrice_svg/lotus.png",
    href: "/wim-hof",
  },
  {
    id: "miroir",
    title: "Miroir des affirmations",
    img: "/image_mirror/miroire.png",
    href: "/miroir",
  },
  {
    id: "visualisation",
    title: "Visualisation & Projection",
    img: "/image_ambassadrice_svg/appareilphoto.png",
    href: "/visualisation",
  },
  {
    id: "mot-a-moi",
    title: "Journaling",
    img: "/image_ambassadrice_svg/envelope.png",
    href: "/mot-a-moi",
  },
  {
    id: "route",
    title: "Défis introspectifs",
    img: "/images/wheelspinner.png",
    href: "/route",
  },
];

export default function FilRouge() {
  const [routineSteps, setRoutineSteps] = useState(defaultRoutine);
  const [removedSteps, setRemovedSteps] = useState<typeof defaultRoutine>([]);

  // État pour savoir quel menu (les 3 points) est ouvert
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sous-titre éditable
  const [subtitle, setSubtitle] = useState("Combinaison pour tous les matins");
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  // Drag & drop pour réorganiser
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Boîte cadeau (les activités retirées)
  const [showGiftBox, setShowGiftBox] = useState(false);

  // Fonction pour supprimer une étape de la routine -> elle va dans le cadeau
  const removeStep = (idToRemove: string) => {
    const stepToRemove = routineSteps.find((step) => step.id === idToRemove);
    if (stepToRemove) {
      setRemovedSteps((prev) => [...prev, stepToRemove]);
    }
    setRoutineSteps(routineSteps.filter((step) => step.id !== idToRemove));
    setActiveMenu(null);
  };

  // Remettre une étape depuis le cadeau vers la routine
  const restoreStep = (idToRestore: string) => {
    const stepToRestore = removedSteps.find((step) => step.id === idToRestore);
    if (stepToRestore) {
      setRoutineSteps((prev) => [...prev, stepToRestore]);
    }
    setRemovedSteps(removedSteps.filter((step) => step.id !== idToRestore));
  };

  // Fermer le menu si on clique ailleurs sur la page
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus automatique sur l'input du sous-titre quand on passe en édition
  useEffect(() => {
    if (isEditingSubtitle && subtitleInputRef.current) {
      subtitleInputRef.current.focus();
      subtitleInputRef.current.select();
    }
  }, [isEditingSubtitle]);

  // --- Drag & drop handlers ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragOverId) setDragOverId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const oldIndex = routineSteps.findIndex((step) => step.id === draggedId);
    const newIndex = routineSteps.findIndex((step) => step.id === targetId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSteps = [...routineSteps];
      const [movedItem] = newSteps.splice(oldIndex, 1);
      newSteps.splice(newIndex, 0, movedItem);
      setRoutineSteps(newSteps);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const giftBoxBackground =
    removedSteps.length > 0
      ? "/image_fil_rouge/cadeau_ouvert.png"
      : "/image_fil_rouge/Cadeaux_fermé.png";

  return (
    <div className="flex flex-col items-center mx-auto w-full max-w-[1440px] px-4 md:px-[96px] py-16">
      <h1 className="text-4xl font-bold text-[#8B47FF] mb-2 text-center">Mon Fil Rouge</h1>

      {/* Sous-titre éditable */}
      <div className="flex items-center gap-2 mb-2 group">
        {isEditingSubtitle ? (
          <input
            ref={subtitleInputRef}
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onBlur={() => setIsEditingSubtitle(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingSubtitle(false);
            }}
            className="text-gray-600 text-lg text-center bg-transparent border-b-2 border-[#8B47FF] outline-none px-1"
          />
        ) : (
          <>
            <p className="text-gray-600 text-lg text-center">{subtitle}</p>
            <button
              onClick={() => setIsEditingSubtitle(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#8B47FF]"
              aria-label="Modifier le sous-titre"
            >
              <Pencil size={14} />
            </button>
          </>
        )}
      </div>

      {/* Message d'aide pour le drag & drop */}
      {routineSteps.length > 1 && (
        <p className="text-xs text-gray-400 italic mb-12">
          Glisse-dépose les bulles pour changer leur emplacement
        </p>
      )}

      {routineSteps.length > 0 ? (
        <div className="flex items-center justify-center w-full max-w-5xl relative flex-wrap gap-y-12">
          {routineSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center relative z-10 transition-opacity ${
                draggedId === step.id ? "opacity-40" : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, step.id)}
              onDragOver={(e) => handleDragOver(e, step.id)}
              onDrop={(e) => handleDrop(e, step.id)}
              onDragEnd={handleDragEnd}
            >
              {/* Conteneur de l'icône et du titre */}
              <div className="flex flex-col items-center relative group cursor-grab active:cursor-grabbing">
                {/* Anneau indicateur de zone de drop */}
                {dragOverId === step.id && draggedId !== step.id && (
                  <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#8B47FF] pointer-events-none" />
                )}

                {/* Bouton 3 points */}
                <div
                  className="absolute -top-3 -right-3 z-20"
                  ref={activeMenu === step.id ? menuRef : null}
                >
                  <button
                    onClick={() => setActiveMenu(activeMenu === step.id ? null : step.id)}
                    className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-[#8B47FF] transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Menu déroulant */}
                  {activeMenu === step.id && (
                    <div className="absolute top-8 right-0 bg-white rounded-xl shadow-lg border border-purple-100 p-2 w-40 flex flex-col gap-1 animate-in fade-in zoom-in duration-200">
                      <button
                        onClick={() => removeStep(step.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>

                <Link href={step.href}>
                  <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#8B47FF] hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-14 h-14 md:w-16 md:h-16 object-contain"
                    />
                  </div>
                </Link>
                <span className="text-sm font-bold text-[#4b3b5c] mt-4 text-center max-w-[120px] leading-tight">
                  {step.title}
                </span>
              </div>

              {/* Ligne de connexion pointillée (cachée sur le dernier élément) */}
              {index < routineSteps.length - 1 && (
                <div className="w-8 md:w-16 h-[2px] mx-2 self-start mt-14 md:mt-16 border-t-2 border-dashed border-[#8B47FF]/40 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border-2 border-dashed border-purple-200 w-full max-w-2xl">
          <p className="text-[#4b3b5c] font-medium text-lg">Ton fil rouge est vide pour le moment.</p>
          <p className="text-gray-400 text-sm mt-2">Ajoute de nouveaux défis pour créer ta routine parfaite.</p>
        </div>
      )}

      {/* Boîte cadeau — alignée à gauche, plus grande, montre directement les icônes dedans */}
      <div className="w-full max-w-5xl mt-16">
        <button
          onClick={() => setShowGiftBox(!showGiftBox)}
          className="flex items-center gap-4 group"
        >
          <div className="relative w-32 h-32 flex items-center justify-center">
            <img
              src={giftBoxBackground}
              alt="Boîte des défis retirés"
              className="w-full h-full object-contain transition-transform group-hover:scale-105"
            />

            {/* Icônes des activités retirées, affichées par-dessus le carton ouvert */}
            {removedSteps.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center gap-0.5 pb-3">
                {removedSteps.slice(0, 3).map((step, i) => (
                  <div
                    key={step.id}
                    className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center"
                    style={{
                      marginLeft: i === 0 ? 0 : -6,
                      zIndex: 10 - i,
                    }}
                  >
                    <img src={step.img} alt={step.title} className="w-5 h-5 object-contain" />
                  </div>
                ))}
                {removedSteps.length > 3 && (
                  <div className="w-8 h-8 bg-[#8B47FF] rounded-full shadow-sm flex items-center justify-center text-white text-[10px] font-bold" style={{ marginLeft: -6, zIndex: 6 }}>
                    +{removedSteps.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-[#4b3b5c]">
              {removedSteps.length > 0 ? "Défis mis de côté" : "Boîte vide"}
            </span>
            <span className="text-xs text-gray-400">
              {removedSteps.length > 0
                ? `${removedSteps.length} défi${removedSteps.length > 1 ? "s" : ""} en attente`
                : "Aucun défi retiré"}
            </span>
          </div>
        </button>

        {/* Contenu déplié de la boîte */}
        {showGiftBox && removedSteps.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-md border-2 border-purple-100 p-6 flex flex-wrap gap-6 max-w-2xl animate-in fade-in zoom-in duration-200">
            {removedSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-[#FEF0F9] rounded-full flex items-center justify-center opacity-70">
                    <img src={step.img} alt={step.title} className="w-8 h-8 object-contain" />
                  </div>
                  <button
                    onClick={() => restoreStep(step.id)}
                    className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow border border-gray-100 text-[#8B47FF] hover:bg-[#FEF0F9] transition-colors"
                    aria-label="Remettre dans le fil rouge"
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>
                <span className="text-xs text-gray-500 mt-2 text-center max-w-[80px] leading-tight">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton pour lancer la routine */}
      {routineSteps.length > 0 && (
        <div className="mt-12">
          <button className="bg-gradient-to-r from-[#8B47FF] to-[#6D3AE0] text-white font-black px-10 py-4 rounded-full shadow-lg shadow-purple-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
            Lancer ma routine
          </button>
        </div>
      )}
    </div>
  );
}