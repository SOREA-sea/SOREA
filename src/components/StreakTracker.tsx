"use client";

import React from "react";

interface StreakTrackerProps {
  // Au lieu d'index de 0 à 6 saisis à la main, on passe les vraies dates de validation 
  // sous forme de chaînes de caractères (ex: ["2026-07-18", "2026-07-19"])
  datesValides?: string[];
  floating?: boolean;
}

export default function StreakTracker({ datesValides = [], floating = false }: StreakTrackerProps) {
  const joursSemaineBase = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sa', 'Di'];
  
  // 1. Obtenir la date du jour actuel
  const aujourdhui = new Date();
  const jourActuelIndex = aujourdhui.getDay() === 0 ? 6 : aujourdhui.getDay() - 1; // Ajustement (0 = Lundi, 6 = Dimanche)

  // 2. Récupérer les dates des jours de la semaine en cours (du Lundi au Dimanche)
  const debutSemaine = new Date(aujourdhui);
  debutSemaine.setDate(aujourdhui.getDate() - jourActuelIndex);

  return (
    <div className={`${floating ? "w-full rounded-2xl border-2 border-[#8B47FF] bg-white/95 p-4 shadow-xl backdrop-blur" : "w-full max-w-3xl my-6 mx-auto"} flex flex-col items-center z-10`}>

      <div className={`${floating ? "mb-4 gap-3" : "max-w-[592px] mx-auto mb-6 gap-3"} flex flex-col w-full`}>
        
        {/* SECTION : LETTRES DES JOURS */}
        <div className="flex justify-between px-2">
          {joursSemaineBase.map((jour, index) => {
            // On calcule la vraie date correspondant à ce jour de la semaine
            const dateJour = new Date(debutSemaine);
            dateJour.setDate(debutSemaine.getDate() + index);
            const dateString = dateJour.toISOString().split('T')[0]; // Format YYYY-MM-DD

            // Automatique : Le jour est complété si sa date est présente dans le tableau du Fil Rouge
            const estComplete = datesValides.includes(dateString);
            
            return (
              <div 
                key={`text-${index}`} 
                className={`w-12 text-center font-bold text-xl ${estComplete ? 'text-[#FF4F6E]' : 'text-[#5A37AC]'}`}
              >
                {jour}
              </div>
            );
          })}
        </div>
        
        {/* SECTION : LIGNE CONTINUE ET NŒUDS */}
        <div className="relative flex justify-between px-2 items-center h-12">
          <div className="absolute left-[24px] right-[24px] h-[10px] bg-[#5A37AC] rounded-full z-0"></div>
          
          {joursSemaineBase.map((_, index) => {
            const dateJour = new Date(debutSemaine);
            dateJour.setDate(debutSemaine.getDate() + index);
            const dateString = dateJour.toISOString().split('T')[0];

            const estComplete = datesValides.includes(dateString);

            return (
              <div key={`node-${index}`} className="w-12 h-12 flex items-center justify-center z-10">
                {estComplete ? (
                  <img 
                    src="/image_icone/Sakura.svg" 
                    alt="Fleur de Sakura" 
                    className="w-9 h-9 object-contain drop-shadow-sm select-none"
                  />
                ) : (
                  <div className="w-6 h-6 bg-[#B9ADB4] rounded-full border-2 border-white"></div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>

      <div className={`${floating ? "gap-1" : "gap-2"} flex flex-col items-center`}>
        <h3 className="flex items-center justify-center gap-2 text-[#212121] font-semibold text-sm">
          <img src="/image_icone/Sakura.svg" alt="Fleur" className="w-5 h-5 object-contain" />
          {datesValides.length} {datesValides.length > 1 ? "jours validés" : "jour validé"} au total !
        </h3>
      </div>
      
    </div>
  );
}