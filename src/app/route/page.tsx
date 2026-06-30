"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import WellbeingWheel from "@/components/WellbeingWheel";
import StreakTracker from "@/components/StreakTracker";

export default function RouteDesDefis() {
  const [showInstructions, setShowInstructions] = useState(true);
  
  
  const [selectedCategory, setSelectedCategory] = useState<"bien-etre" | "nutrition" | "sport" | null>(null);

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

          <h1 className="text-4xl font-bold text-black mb-10 underline text-center">
            Relève tes défis bien-être avec SOREA
          </h1>

          {showInstructions && selectedCategory === null && (
            <div className="w-full max-w-3xl flex flex-col items-center mb-12 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <p className="text-center text-[#4b3b5c] text-xl mb-1">
                Bienvenue dans ton parcours d'équilibre ! Challenge toi et débloque d'incroyables défis.
              </p>
              <p className="text-center text-[#4b3b5c] text-xl mb-6">
                Choisis une catégorie pour commencer.
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

          {/* MENU DE SÉLECTION OU AFFICHAGE DE LA ROUE */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {selectedCategory === null ? (
              // VUE 1 : Les 3 choix
              <div className="flex gap-6 mt-4">
                <button 
                  onClick={() => setSelectedCategory("bien-etre")}
                  className="flex flex-col items-center justify-center p-8 bg-white border-2 border-[#DBCEEF] rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-[240px] h-[240px]"
                >
                  <span className="text-4xl mb-4">🧘‍♀️</span>
                  <span className="text-xl font-bold text-[#5A37AC]">Bien-être</span>
                  <span className="text-sm text-gray-500 mt-2 text-center">Recentrage et positivité</span>
                </button>

                <button 
                  onClick={() => setSelectedCategory("nutrition")}
                  className="flex flex-col items-center justify-center p-8 bg-white border-2 border-[#DBCEEF] rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-[240px] h-[240px]"
                >
                  <span className="text-4xl mb-4">🍎</span>
                  <span className="text-xl font-bold text-[#5A37AC]">Nutrition</span>
                  <span className="text-sm text-gray-500 mt-2 text-center">Défis sains et gourmands</span>
                </button>

                <button 
                  onClick={() => setSelectedCategory("sport")}
                  className="flex flex-col items-center justify-center p-8 bg-white border-2 border-[#DBCEEF] rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-[240px] h-[240px]"
                >
                  <span className="text-4xl mb-4">🏃‍♂️</span>
                  <span className="text-xl font-bold text-[#5A37AC]">Sport</span>
                  <span className="text-sm text-gray-500 mt-2 text-center">Bouge et dépense-toi</span>
                </button>
              </div>
            ) : (
              // VUE 2 : La roue choisie
              <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mb-8 text-[#8B47FF] font-medium underline hover:text-[#5A37AC] transition-colors"
                >
                  Changer de catégorie
                </button>
                <WellbeingWheel category={selectedCategory} />
              </div>
            )}
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}