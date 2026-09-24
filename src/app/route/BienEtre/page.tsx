// Exemple pour : /app/route-des-defis/nutrition/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import de Link pour le retour
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement";
import WheelSpinnerBienEtre from "@/components/WheelSpinnerBienEtre";

export default function PageBienEtre() {
  const [showInstruction, setShowInstructionsWellness] = useState(true);
const hideInstructionsWellness = () => {
    setShowInstructionsWellness(false);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[96px] pb-[24px] pt-[24px]">
          <Navbar />
        </div>
      </div>

{showInstruction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-in fade-in duration-300">
              <div className="w-full max-w-lg mx-4 p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 flex flex-col items-center relative animate-in zoom-in-95 duration-300">
                <p className="text-center text-[#4b3b5c] text-xl font-bold mb-2">
                  Cultive ta paix intérieure
                </p>
                <p className="text-gray-600 text-base mb-8 mt-3">
                  Tourne ton Wheel-Spinner et développe un bien-être durable en apprenant à mieux te connaître, à renforcer ton équilibre émotionnel et à cultiver des habitudes positives qui te permettront de révéler ton plein potentiel.
                </p>
                
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={hideInstructionsWellness}
                    className="px-8 py-2.5 bg-[#8B47FF] text-white font-bold rounded-full hover:bg-[#7a3be6] transition-colors shadow-md text-sm cursor-pointer"
                  >
                    OK
                  </button>
                  <button 
                    onClick={hideInstructionsWellness}
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
          {/* 1. En-tête de la zone de jeu (Retour, Style, Favoris) */}
    <div className="w-full flex items-center justify-between gap-4">
      {/* Côté Gauche : Bouton Retour */}
      <div className="flex-shrink-0">
        <Link 
          href="/route" // Lien vers la page de sélection
              className="text-[#8B47FF] font-bold px-5 py-2 mt-12 rounded-2xl border-2 border-[#8B47FF] hover:bg-[#8B47FF] hover:text-white transition-all shadow-sm flex items-center gap-2"
            >
              ← Retour aux choix
            </Link>
          </div>
    </div>

          {/* La roue spécifique affichée ici directement */}
          {/* 2. Le jeu de la roue (maintenant dans la même div englobante) */}
       
        <div className="relative z-10 w-full flex flex-col items-center scale-65 origin-top">
            <WheelSpinnerBienEtre />
        </div>
    
  </div>
  
      </main>

     <div 
       className="w-full py-20 relative z-10 flex justify-center"
       style={{background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%)"
       }}>
         <div className="w-full max-w-[1228px] px-4 justify-center">
           <DailyEncouragement />
         </div>
     </div>
     
           {/* FOOTER */}
           <Footer />
         </div>
       );
     }