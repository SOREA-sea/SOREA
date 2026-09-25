// Exemple pour : /app/route-des-defis/nutrition/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link"; // Import de Link pour le retour
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement";
import WheelSpinnerNutrition from "@/components/WheelSpinnerNutrition";

export default function PageNutrition() {
 const [showInstruction, setShowInstructionsNutrition] = useState(true);
const hideInstructionsNutrition = () => {
    setShowInstructionsNutrition(false);
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
                  Nourri ton équilibre
                </p>
                <p className="text-gray-600 text-base mb-8 mt-3">
                  Tourne ton Wheel-Spinner pour écouter ton corps et adopter une alimentation bienveillante. Découvre ce qui te fait du bien et repère tes besoins sans pression ni culpabilité.
                </p>
                
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={hideInstructionsNutrition}
                    className="px-8 py-2.5 bg-[#8B47FF] text-white font-bold rounded-full hover:bg-[#7a3be6] transition-colors shadow-md text-sm cursor-pointer"
                  >
                    OK
                  </button>
                  <button 
                    onClick={hideInstructionsNutrition}
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
          <div className="w-full max-w-[1228px] px-4 mb-10 self-center flex">
            <Link 
              href="/route" // Lien vers la page de sélection
              className="text-[#8B47FF] font-bold px-6 py-2 rounded-2xl border-2 border-[#8B47FF] hover:bg-[#8B47FF] hover:text-white transition-all shadow-sm flex items-center gap-2"
            >
              ← Retour aux choix
            </Link>
          </div>
          {/* La roue spécifique affichée ici directement */}
          <div className="relative z-10 w-full flex flex-col items-center scale-65 origin-top">
            <WheelSpinnerNutrition />
          </div>

        </div>
  
      </main>

      {/* FOOTER (Optionnel sur les pages internes, mais conservé ici) */}
     
      <Footer />
    </div>
  );
}