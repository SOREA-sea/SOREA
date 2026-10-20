"use client";

import React, { useState, useEffect } from "react";

interface VisualisationCard {
  id: string;
  title: string;
  images: string[];
}

export default function VisualisationSlide() {
  const [activePellicule, setActivePellicule] = useState<VisualisationCard | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Charger la pellicule active depuis le localStorage
  const loadActivePellicule = () => {
    if (typeof window !== "undefined") {
      const savedActive = localStorage.getItem("sorea_active_visualisation_pellicule");
      if (savedActive) {
        try {
          const parsed = JSON.parse(savedActive);
          setActivePellicule(parsed);
          setCurrentIndex(0);
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
            setCurrentIndex(0);
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

  // Défilement image par image (1 seule image à la fois)
  const changeSlide = (direction: -1 | 1) => {
    if (!activePellicule || !activePellicule.images || activePellicule.images.length === 0) return;
    const total = activePellicule.images.length;
    setCurrentIndex((prev) => (prev + direction + total) % total);
  };

  const images = activePellicule?.images || [];

  return (
    <div className="w-full flex justify-center my-8">
      <div className="flex items-center gap-10 md:gap-16">
        
        {/* Conteneur de la Pellicule SVG */}
        <div className="w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] md:w-[520px] md:h-[520px] overflow-hidden relative rounded-2xl drop-shadow-xl flex items-center justify-center">
          
          {/* Image de fond SVG de la pellicule (z-10) */}
          <img
            src="/image_Design-SOREA/Pellicule.svg"
            alt="Cadre Pellicule"
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
          />

          {/* Affichage de l'image courante au centre de la pellicule (z-20) */}
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

        {/* Flèches de navigation verticale */}
        <div className="flex flex-col gap-6 z-20">
          <button
            onClick={() => changeSlide(-1)}
            disabled={images.length <= 1}
            className="hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Image précédente"
          >
            <img
              src="/image_icone/Flèche_carré_haute.svg"
              alt="Haut"
              className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md"
            />
          </button>

          <button
            onClick={() => changeSlide(1)}
            disabled={images.length <= 1}
            className="hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Image suivante"
          >
            <img
              src="/image_icone/Flèche_carré_basse.svg"
              alt="Bas"
              className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md"
            />
          </button>
        </div>

      </div>
    </div>
  );
}