"use client";

import React, { useState, useEffect } from "react";

export default function VisualisationSlide() {
  const [images, setImages] = useState<string[]>([
    "/image_photo/PelliculeAmitié.svg",
    "/image_photo/PelliculeVoyage.svg",
    "/image_photo/PelliculeNourritureSaine.svg",
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Écoute et mise à jour de la pellicule active
  useEffect(() => {
    const loadActivePellicule = () => {
      const saved = localStorage.getItem("sorea_active_visualisation_pellicule");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.images && parsed.images.length > 0) {
            setImages(parsed.images);
            setCurrentIndex(0);
          }
        } catch (e) {
          console.error("Erreur de chargement de la pellicule", e);
        }
      }
    };

    loadActivePellicule();

    window.addEventListener("visualisationPelliculeChanged", loadActivePellicule);
    return () => {
      window.removeEventListener("visualisationPelliculeChanged", loadActivePellicule);
    };
  }, []);

  // Diaporama avec transition douce toutes les 1 minute (60 000 ms)
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      // Début de la transition en fondu sortant
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        // Fondu entrant de la nouvelle image
        setFade(true);
      }, 1000); // 1 seconde de transition fluide
    }, 60000); // 60 secondes = 1 minute

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center select-none">
      
      {/* 1. L'appareil photo de fond */}
      <img
        src="/image_Design-SOREA/DiapoVisualisation.svg"
        alt="Appareil photo visualisation"
        className="w-full h-full object-contain relative z-10 pointer-events-none drop-shadow-xl"
      />

      {/* 2. Écran / Frame positionnée au niveau du rectangle de l'écran */}
      <div className="absolute top-[40%] left-[14.5%] w-[263px] h-[168px] z-20 overflow-hidden rounded-[10px] bg-black/10 flex items-center justify-center">
        {images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt={`Diaporama ${currentIndex + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="text-white/60 text-xs text-center px-4">
            Aucune image dans cette pellicule
          </div>
        )}
      </div>

    </div>
  );
}