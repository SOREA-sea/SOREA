"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import de Link pour le retour
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement";
import WheelSpinnerSport from "@/components/WheelSpinnerSport";
// 🌟 1. Ajout des imports pour la gestion de la phase
import { fetchCurrentPhase } from "@/lib/cyclePhase";
import { Phase } from "@/lib/affirmations";

export default function PageSport() {
 const [showInstruction, setShowInstructionsSport] = useState(true);
 // 1. Ajout de l'état pour le mode actif
 const [activeMode, setActiveMode] = useState<"default" | "cycle">("default");

 // 🌟 2. Ajout de l'état pour stocker la phase actuelle du cycle
 const [currentPhase, setCurrentPhase] = useState<Phase>("Printemps");

 // 🌟 3. Récupération de la phase au chargement de la page
 useEffect(() => {
   fetchCurrentPhase().then(setCurrentPhase);
 }, []);

const hideInstructionsSport = () => {
    setShowInstructionsSport(false);
  };


  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-[96px] pb-[24px] pt-[24px]">
          <Navbar />
        </div>
      </div>

{showInstruction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-in fade-in duration-300">
              <div className="w-full max-w-lg mx-4 p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 flex flex-col items-center relative animate-in zoom-in-95 duration-300">
                <p className="text-center text-[#4b3b5c] text-xl font-bold mb-2">
                  Active ton corps
                </p>
                <p className="text-gray-600 text-base mb-8 mt-3">
                  Tourne ton Wheel-Spinner pour faire du mouvement ton allié du bien-être. Bouge à ton rythme, renforce ton corps et booste ton énergie pour révéler pleinement ton potentiel.
                </p>
                
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={hideInstructionsSport}
                    className="px-8 py-2.5 bg-[#8B47FF] text-white font-bold rounded-full hover:bg-[#7a3be6] transition-colors shadow-md text-sm cursor-pointer"
                  >
                    OK
                  </button>
                  <button 
                    onClick={hideInstructionsSport}
                    className="px-4 py-2.5 bg-transparent text-gray-400 font-medium hover:text-[#8B47FF] transition-colors text-sm underline underline-offset-2 cursor-pointer"
                  >
                    Ne plus afficher
                  </button>
                </div>
              </div>
            </div>
          )}

      {/* CONTENU PRINCIPAL - Juste la roue centrée */}
      <main className="flex-1 w-full flex flex-col items-center py-20">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center">
          
          {/* Bouton Retour stylé */}
          <div className="w-full max-w-[1440px] mx-auto px-[96px] sticky top-[85px] z-40 pointer-events-none mb-[-60px]">
          <div className="flex flex-col items-start gap-2 pointer-events-auto w-fit">
            <Link 
              href="/Wheel-Spinner" // Lien vers la page de sélection
              className="text-[#8B47FF] font-bold px-6 py-2 rounded-2xl border border-[#8B47FF] hover:bg-[#8B47FF] hover:text-white transition-all shadow-sm flex items-center gap-2 bg-white cursor-pointer"
            >
              ← Retour aux choix
            </Link>
          </div>
          </div>
          
          {/* La roue spécifique affichée ici directement */}
          <div className="relative z-10 w-full flex flex-col items-center scale-65 origin-top">
            <div className="relative flex justify-center items-center translate-x-[300px]">
                        
                        {/* Groupe "Défis Sport" et les 2 boutons placés strictement à gauche (dimensions et positionnement identiques au miroir) */}
            <div className="absolute left-[-600px] top-[450px] -translate-y-1/2 z-30 flex flex-col items-center gap-28">
                          <div className="flex flex-col items-center text-center gap-10">
                            <h1 className="text-3xl md:text-5xl font-serif font-light text-[#212121] tracking-wider whitespace-nowrap leading-tight">
                              Défis<br />Sport
                            </h1>
                            {/* 🌟 4. Affichage dynamique de la phase si le mode "cycle" est actif */}
                            {activeMode === "cycle" && (
                              <h2 className="text-4xl font-semibold text-[#7F4DC5] italic">
                                {currentPhase}
                              </h2>
                            )}
                          </div>
            
                          {/* Les 2 boutons (Par défaut et Cycles menstruels) */}
                          <div className="flex w-[350px] h-[55px] bg-white border border-[#9b6fd9] rounded-[10px] overflow-hidden shadow-sm pointer-events-auto">
                            <button 
                              type="button"
                              onClick={() => setActiveMode("default")}
                              className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors border-r border-[#9b6fd9] cursor-pointer text-center px-1 ${
                                activeMode === "default" ? "bg-purple-100 text-[#7F4DC5] font-bold" : "text-gray-800 hover:bg-purple-50"
                              }`}
                            >
                              Par défaut
                            </button>
            
                            <button 
                              type="button"
                              onClick={() => setActiveMode("cycle")}
                              className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer text-center px-1 ${
                                activeMode === "cycle" ? "bg-purple-100 text-[#7F4DC5] font-bold" : "text-gray-800 hover:bg-purple-50"
                              }`}
                            >
                              Cycles menstruels
                            </button>
                          </div>
                        </div>
            
                        {/* 🌟 Transmission du mode au composant */}
                        <WheelSpinnerSport mode={activeMode} />
                      </div>
          </div>

        </div>
  
      </main>

      {/* FOOTER (Optionnel sur les pages internes, mais conservé ici) */}
      
      <Footer />
    </div>
  );
}