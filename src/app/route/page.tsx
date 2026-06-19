"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import WellbeingWheel from "@/components/WellbeingWheel";
import StreakTracker from "@/components/StreakTracker";

export default function RouteDesDefis() {
  const [showInstructions, setShowInstructions] = useState(true);

  const hideInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-[96px] pb-[24px] gap-[50px]">
          <Navbar />
        </div>
      </div>

      {/* CONTENU */}
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-[1440px] mx-auto px-[96px] flex flex-col items-center pt-[100px] pb-[24px]">
          <div className="w-full mb-6">
            <Link href="/challenge">
              <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF] relative z-10">
                ← Retour
              </button>
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-black mb-10 underline">
            Relève tes défis bien-être avec SOREA
          </h1>

          {showInstructions && (
            <div className="w-full max-w-3xl flex flex-col items-center mb-12 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
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

          <div className="w-full flex justify-center mb-16 relative z-10">
            <StreakTracker />
          </div>

          <div className="relative z-10">
              <WellbeingWheel />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}