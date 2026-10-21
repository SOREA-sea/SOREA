"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisualisationGallery from "@/components/VisualisationGallery";
import { createPortal } from "react-dom";
import { X } from "lucide-react";


interface VisualisationCard {
  id: string;
  title: string;
  images: string[];
}

export default function Page() {
  const [activePellicule, setActivePellicule] = useState<VisualisationCard | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<"aleatoire" | "galerie">("galerie");
  const [randomImages, setRandomImages] = useState<string[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // État pour le plein écran
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fonction pour récupérer toutes les images de la galerie et les mélanger
  const loadRandomImages = () => {
    if (typeof window !== "undefined") {
      const savedGallery = localStorage.getItem("sorea_visualisation_pellicules");
      if (savedGallery) {
        try {
          const gallery: VisualisationCard[] = JSON.parse(savedGallery);
          // Récupère toutes les images de toutes les pellicules
          const allImages = gallery.flatMap((p) => p.images || []);
          // Mélange aléatoire (Fisher-Yates)
          const shuffled = [...allImages].sort(() => Math.random() - 0.5);
          setRandomImages(shuffled);
          setCurrentIndex(shuffled.length); // Commence au milieu de la liste répétée
        } catch (e) {
          console.error("Erreur de mélange aléatoire", e);
        }
      }
    }
  };

  // Charger la pellicule active depuis le localStorage
  const loadActivePellicule = () => {
    if (typeof window !== "undefined") {
      const savedActive = localStorage.getItem("sorea_active_visualisation_pellicule");
      if (savedActive) {
        try {
          const parsed = JSON.parse(savedActive);
          setActivePellicule(parsed);
          setCurrentIndex(parsed.images?.length || 0);
          return;
        } catch (e) {
          console.error("Erreur de lecture de la pellicule active", e);
        }
      }

      // Si aucune pellicule active n'est sélectionnée, prendre la première de la galerie
      const savedGallery = localStorage.getItem("sorea_visualisation_pellicules");
      if (savedGallery) {
        try {
          const gallery = JSON.parse(savedGallery);
          if (gallery.length > 0) {
            setActivePellicule(gallery[0]);
            setCurrentIndex(gallery[0].images?.length || 0);
          }
        } catch (e) {
          console.error("Erreur de lecture de la galerie", e);
        }
      }
    }
  };

  useEffect(() => {
    loadActivePellicule();

    // Réagir immédiatement quand l'utilisateur clique sur "🎬 Projeter" dans VisualisationGallery
    const handlePelliculeChange = () => {
      loadActivePellicule();
    };

    window.addEventListener("visualisationPelliculeChanged", handlePelliculeChange);
    return () => {
      window.removeEventListener("visualisationPelliculeChanged", handlePelliculeChange);
    };
  }, []);

// Gestion de la fermeture du plein écran avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

const [noTransition, setNoTransition] = useState(false);

  const rawImages = activeMode === "galerie" ? (activePellicule?.images || []) : randomImages;
  const totalReal = rawImages.length;
  // On répète la liste 3 fois pour permettre une boucle infinie et fluide indéfiniment à chaque clic
  const images = totalReal > 0 ? [...rawImages, ...rawImages, ...rawImages] : [];

 const changeSlide = (direction: -1 | 1) => {
    if (totalReal <= 1) return;

    // Si on atteint les extrémités de la liste triplée, on glisse d'abord normalement, puis on réinitialise l'index en arrière-plan sans transition une fois l'animation finie (500ms)
    setCurrentIndex((prev) => {
      const nextIndex = prev + direction;
      return nextIndex;
    });

    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalReal * 2) {
          setNoTransition(true);
          const resetVal = totalReal + (prev % totalReal);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setNoTransition(false));
          });
          return resetVal;
        }
        if (prev < totalReal) {
          setNoTransition(true);
          const resetVal = totalReal * 2 - (totalReal - (prev % totalReal));
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setNoTransition(false));
          });
          return resetVal;
        }
        return prev;
      });
    }, 500);
  };

return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[96px] pb-[24px]">
          <Navbar />
        </div>
      </div>

      {/* CONTENU PRINCIPAL DU JEU */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto flex items-center mt-18 mb-9.5 pl-[90px]">
        <div className="flex items-center gap-10 md:gap-16 relative">
          
          {/* GROUPE "VISUALISATION" ET LES 2 BOUTONS STYLISÉS À GAUCHE */}
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center text-center gap-4">
              <h1 className="text-3xl md:text-4xl font-serif font-light text-[#212121] tracking-wider whitespace-nowrap">
                Visualisation
              </h1>
              {activeMode === "galerie" && activePellicule && (
                <h2 className="text-2xl font-semibold text-[#7F4DC5] italic">
                  {activePellicule.title}
                </h2>
              )}
            </div>

            {/* Les 2 boutons de sélection */}
            <div className="flex w-[260px] h-[50px] bg-white border border-[#9b6fd9] overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("aleatoire");
                  loadRandomImages();
                }}
                className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors border-r border-[#9b6fd9] cursor-pointer text-center px-2 ${
                  activeMode === "aleatoire"
                    ? "bg-purple-100 text-[#7F4DC5] font-bold"
                    : "text-gray-800 hover:bg-purple-50"
                }`}
              >
                Aléatoire
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode("galerie");
                  loadActivePellicule();
                  setIsGalleryModalOpen(true);
                }}
                className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer text-center px-2 ${
                  activeMode === "galerie"
                    ? "bg-purple-100 text-[#7F4DC5] font-bold"
                    : "text-gray-800 hover:bg-purple-50"
                }`}
              >
                Galerie
              </button>
            </div>
          </div>
          
          {/* Conteneur de la Pellicule SVG */}
          <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] overflow-hidden relative drop-shadow-xl flex items-center justify-center">
            <img
              src="/image_Design-SOREA/Pellicule.svg"
              alt="Cadre Pellicule"
              className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
            />

            <div className="relative z-20 w-[58%] h-[65%] overflow-hidden flex items-center justify-center">
              {images.length > 0 ? (
                <img
                  src={images[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-300 select-none"
                />
              ) : (
                <div className="w-full h-full bg-purple-50/90 flex items-center justify-center p-6 text-center">
                  <span className="text-purple-900 font-medium text-sm md:text-base leading-snug">
                    Intègre des images dans ta galerie pour visualiser
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bouton Play unique sans state (changement au survol CSS) */}
          <div className="flex items-center justify-center z-20">
            <button
              onClick={() => setIsFullscreen(true)}
              className="group hover:scale-105 active:scale-95 transition-transform cursor-pointer relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
              title="Lancer la projection en plein écran"
            >
              <img
                src="/image_icone/play0.svg"
                alt="Play"
                className="w-full h-full drop-shadow-md group-hover:hidden"
              />
              <img
                src="/image_icone/play1.svg"
                alt="Play Hover"
                className="w-full h-full drop-shadow-md hidden group-hover:block"
              />
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* OVERLAY PLEIN ÉCRAN (Fond gris semi-transparent et flouté) */}
      {isFullscreen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#212121] backdrop-blur-md flex items-center justify-center animate-fade-in">
          
          {/* Bouton Croix pour fermer adaptatif au zoom (taille et marge en vh/vw) */}
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-[3vh] right-[3vw] text-white hover:text-purple-300 p-[1.2vh] rounded-full bg-black/20 hover:bg-black/40 transition-all cursor-pointer z-[100000] flex items-center justify-center"
                    title="Quitter le plein écran (Échap)"
                >
                    <X className="w-[4vh] h-[4vh]" />
                </button>

          <div className="flex items-center justify-center gap-8 md:gap-14 w-full h-full px-6 pl-[120px]">
            
            {/* Conteneur Géant de la Pellicule en mode Glissement Vertical (Duplication) */}
<div className="w-[115vw] h-[105vh] max-w-[125vh] max-h-[110vw] overflow-hidden relative drop-shadow-2xl flex items-center justify-center">  
  {images.length > 0 ? (
    <div
      className={`absolute top-0 left-0 w-full h-full flex flex-col z-20 ${
        noTransition ? "" : "transition-transform duration-500 ease-in-out"
      }`}
      style={{ transform: `translateY(calc(-${currentIndex} * 100%))` }}
    >
      {images.map((imgSrc, idx) => (
        <div key={idx} className="w-full h-full flex-shrink-0 relative flex items-center justify-center">
          {/* Fond de la pellicule pour chaque slide dupliqué */}
          <img
            src="/image_Design-SOREA/Pellicule.svg"
            alt="Cadre Pellicule Plein Écran"
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
          />
          {/* Image interne dupliquée */}
          <div className="relative z-20 w-[62%] h-[75%] overflow-hidden flex items-center justify-center">
            <img
              src={imgSrc}
              alt={`Image ${idx + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="w-full h-full relative flex items-center justify-center z-20">
      <img
        src="/image_Design-SOREA/Pellicule.svg"
        alt="Cadre Pellicule Vide"
        className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
      />
      <div className="relative z-20 w-[72%] h-[72%] bg-white/90 flex items-center justify-center p-6 text-center rounded-lg">
        <span className="text-purple-900 font-medium text-base md:text-lg leading-snug">
          Intègre des images dans ta galerie pour visualiser
        </span>
      </div>
    </div>
  )}
</div>

            {/* Flèches de navigation adaptatives au zoom */}
<div className="flex flex-col gap-[3vh] z-20">
  <button
    onClick={() => changeSlide(-1)}
    disabled={images.length <= 1}
    className="hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white/90 p-[1.5vh] rounded-[2vh] shadow-lg border border-purple-100 flex items-center justify-center"
    title="Image précédente"
  >
    <img
  src="/image_icone/Flèche_carré_haute.svg"
  alt="Haut"
  className="w-[8vh] h-[8vh]"
/>
  </button>

  <button
    onClick={() => changeSlide(1)}
    disabled={images.length <= 1}
    className="hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white/90 p-[1.5vh] rounded-[2vh] shadow-lg border border-purple-100 flex items-center justify-center"
    title="Image suivante"
  >
    <img
      src="/image_icone/Flèche_carré_basse.svg"
      alt="Bas"
      className="w-[8vh] h-[8vh]"
    />
  </button>
</div>

          </div>
        </div>,
        document.body
      )}

      {/* Modale de la Galerie */}
      <VisualisationGallery
        externalIsOpen={isGalleryModalOpen}
        setExternalIsOpen={setIsGalleryModalOpen}
      />
    </div>
  );
}