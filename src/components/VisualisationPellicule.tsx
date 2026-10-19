"use client";

import React from "react";
import Image from "next/image";

// Animation CSS keyframes inspirée de AmbassadorRayonne.tsx
const marqueeStyles = `
  @keyframes pelliculeScrollUp {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  .animate-pellicule-scroll {
    animation: pelliculeScrollUp 20s linear infinite;
  }
`;

// Liste des images de démonstration à faire défiler dans la pellicule
const filmPhotos = [
  "/image_photo/PelliculeNourritureSaine.svg",
  "/image_photo/PelliculeBusiness1.svg",
  "/image_photo/PelliculeDiplome.svg",
  "/image_photo/PelliculeVoyage.svg",
  "/image_photo/PelliculeLiberté.svg",
  "/image_photo/PelliculeAmitié.svg",
];

export default function VisualisationPellicule() {
  return (
    <div className="relative w-[360px] h-[1392px] overflow-hidden flex justify-center items-center pointer-events-none select-none">
      <style>{marqueeStyles}</style>

      {/* 1. ZONE DE DÉFILEMENT DE L'IMAGE (En arrière-plan, sous la pellicule) */}
      <div className="absolute inset-0 w-full h-full z-10 flex justify-center items-center overflow-hidden">
        <div className="w-[240px] h-[1200px] overflow-hidden relative">
          <div className="flex flex-col gap-6 animate-pellicule-scroll w-full absolute top-0">
            
            {/* Bloc 1 : Liste originale */}
            {filmPhotos.map((photo, index) => (
              <div
                key={`photo-1-${index}`}
                className="w-[240px] h-[240px] shrink-0 overflow-hidden relative shadow-inner bg-purple-50/20"
              >
                <Image
                  src={photo}
                  alt={`Pellicule inspiration ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}

            {/* Bloc 2 : Duplication exacte pour créer une boucle fluide et infinie */}
            {filmPhotos.map((photo, index) => (
              <div
                key={`photo-2-${index}`}
                className="w-[240px] h-[240px] shrink-0 overflow-hidden relative shadow-inner bg-purple-50/20"
              >
                <Image
                  src={photo}
                  alt={`Pellicule inspiration dup ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* 2. SVG DU SUPPORT PELLICULE (Placé par-dessus avec z-20) */}
      <img
        src="/image_Design-SOREA/PelliculeSupport.svg"
        alt="Pellicule Support"
        className="absolute inset-0 w-full h-full object-contain z-5 pointer-events-none"
      />

    </div>
  );
}