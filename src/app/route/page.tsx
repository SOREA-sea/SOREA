"use client";

import React from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Wheeltestcopy from "@/components/Wheeltestcopy";

export default function RouteDesDefis() {
  
  const joursSemaineBase = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const joursConsecutifs = 3; 

  const jourDeDepartIndex = 2; 
  const joursAffiches = [
    ...joursSemaineBase.slice(jourDeDepartIndex), 
    ...joursSemaineBase.slice(0, jourDeDepartIndex)
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative items-center">
      
      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px] gap-[50px]">
        <Navbar />
      </div>

      <main className="flex flex-col flex-grow items-center mx-auto w-[1440px] pt-[100px] pr-[96px] pb-[24px] pl-[96px]">
        
        <div className="w-full mb-6">
          <Link href="/challenge">
            <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]">
              ← Retour
            </button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-black mb-10 underline">
          Relève tes défis bien-être avec SOREA
        </h1>

        <div className="w-full max-w-3xl flex flex-col items-center mb-16 z-10">
          <p className="text-center text-[#4b3b5c] text-xl mb-1">
            Bienvenue dans ton parcours d'équilibre ! Challenge toi et débloque d'incroyables défis bien-être.
          </p>
          <p className="text-center text-[#4b3b5c] text-xl mb-12">
            Chaque instant est une occasion de te reconnecter à toi-même.
          </p>

          <div className="relative w-full max-w-2xl flex justify-between items-start mb-10 px-6">
            {/* Ligne grise de fond (fixe) */}
            <div className="absolute top-[40px] left-[8%] right-[8%] h-[4px] bg-[#E5E7EB] z-0 -translate-y-1/2 rounded-full"></div>
            
            
            <div 
              className="absolute top-[40px] left-[8%] h-[4px] bg-[#BA98F4] z-0 -translate-y-1/2 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min((Math.max(joursConsecutifs - 1, 0)) * (84 / 6), 84)}%` }} 
            ></div>

            
            {joursAffiches.map((jour, index) => {
              const estComplete = index < joursConsecutifs;
              return (
                <div key={index} className="flex flex-col items-center gap-4 z-10 w-12">
                  <span className={`font-bold text-xl ${estComplete ? 'text-[#8B47FF]' : 'text-gray-400'}`}>
                    {jour}
                  </span>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors duration-300 ${estComplete ? 'bg-[#FEF0F9] border-[#DBCEEF]' : 'bg-[#E5E7EB] border-transparent'}`}>
                    {estComplete && (
                      <img src="/image_wheel/lotus 1.svg" alt="Fleur" className="w-6 h-6 object-contain" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <h3 className="text-[#8B47FF] font-bold text-2xl">🌸 {joursConsecutifs} jours consécutifs !</h3>
            <p className="text-[#4b3b5c] text-center font-medium text-lg">
              Quel bel engagement ! Continue ainsi, tu rayonnes<br/>de plus en plus.
            </p>
          </div>
        </div>
        

      </main>

      
      <Wheeltestcopy />

      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}