"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Wheeltestcopy from "@/components/Wheeltestcopy";
import StreakTracker from "@/components/StreakTracker";

export default function RouteDesDefis() {
  // Les consignes sont visibles par défaut à chaque chargement de la page
  const [showInstructions, setShowInstructions] = useState(true);

  // Fonction unique pour masquer les consignes (sans sauvegarde)
  const hideInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative items-center">
      
      {/* NAVBAR */}
      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px] gap-[50px]">
        <Navbar />
      </div>

      <main className="flex flex-col flex-grow items-center mx-auto w-[1440px] pt-[100px] pr-[96px] pb-[24px] pl-[96px]">
        
        {/* BOUTON RETOUR */}
        <div className="w-full mb-6">
          <Link href="/challenge">
            <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]">
              ← Retour
            </button>
          </Link>
        </div>

        {/* TITRE */}
        <h1 className="text-4xl font-bold text-black mb-10 underline">
          Relève tes défis bien-être avec SOREA
        </h1>

        {/* CONSIGNES AVEC BOUTONS (Masquées au clic) */}
        {showInstructions && (
          <div className="w-full max-w-3xl flex flex-col items-center mb-12 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-center text-[#4b3b5c] text-xl mb-1">
              Bienvenue dans ton parcours d'équilibre ! Challenge toi et débloque d'incroyables défis bien-être.
            </p>
            <p className="text-center text-[#4b3b5c] text-xl mb-6">
              Chaque instant est une occasion de te reconnecter à toi-même.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={hideInstructions}
                className="px-8 py-2 bg-white text-[#8B47FF] font-bold rounded-full border border-[#8B47FF] hover:bg-purple-50 transition-colors shadow-sm text-sm"
              >
                OK
              </button>
              <button 
                onClick={hideInstructions}
                className="px-4 py-2 bg-transparent text-gray-400 font-medium hover:text-[#8B47FF] transition-colors text-sm underline underline-offset-2"
              >
                Ne plus afficher
              </button>
            </div>
          </div>
        )}

        {/* STREAK TRACKER */}
        <div className="w-full flex justify-center mb-16">
          <StreakTracker />
        </div>

        {/* ROUE */}
        <Wheeltestcopy />

      </main>

      {/* FOOTER */}
      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}