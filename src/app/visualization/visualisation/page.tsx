"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisualisationGallery from "@/components/VisualisationGallery";


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
          setCurrentIndex(0);
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

  const images = activeMode === "galerie" ? (activePellicule?.images || []) : randomImages;

return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[96px] pb-[24px]">
          <Navbar />
        </div>
      </div>

      {/* CONTENU PRINCIPAL DU JEU */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto flex items-center my-9.5 pl-[90px]">
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

            {/* Les 2 boutons de sélection avec le même design que le miroir */}
            <div className="flex w-[260px] h-[50px] bg-white border border-[#9b6fd9] rounded-[10px] overflow-hidden shadow-sm">
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
          <div className="w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] md:w-[520px] md:h-[520px] overflow-hidden relative rounded-2xl drop-shadow-xl flex items-center justify-center">
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
      </main>

      {/* FOOTER */}
      <Footer />

      {/* Modale de la Galerie */}
      <VisualisationGallery
        externalIsOpen={isGalleryModalOpen}
        setExternalIsOpen={setIsGalleryModalOpen}
      />
    </div>
  );
}