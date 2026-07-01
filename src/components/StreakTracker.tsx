"use client";

import React from "react";

interface StreakTrackerProps {
  joursConsecutifs?: number;
  floating?: boolean;
}

export default function StreakTracker({ joursConsecutifs = 2, floating = false }: StreakTrackerProps) {
  const joursSemaineBase = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div className={`${floating ? "w-full rounded-2xl border-2 border-[#8B47FF] bg-white/95 p-4 shadow-xl backdrop-blur" : "w-full max-w-3xl my-12 mx-auto"} flex flex-col items-center z-10`}>

      <div className={`${floating ? "mb-4 gap-2" : "max-w-[592px] mx-auto mb-10 gap-3"} flex flex-col w-full`}>
        
        {/* SECTION : LETTRES DES JOURS */}
        <div className="flex justify-between px-2">
          {joursSemaineBase.map((jour, index) => {
            const estComplete = index < joursConsecutifs;
            
            return (
              <div 
                key={`text-${index}`} 
                className={`${floating ? "w-8 text-base" : "w-12 text-2xl"} text-center font-bold ${estComplete ? 'text-[#FF4F6E]' : 'text-[#5A37AC]'}`}
              >
                {jour}
              </div>
            );
          })}
        </div>
        
        {/* SECTION : LIGNE CONTINUE ET NŒUDS */}
        <div className={`${floating ? "h-8" : "h-12"} relative flex justify-between px-2 items-center`}>
          
          
          <div className={`${floating ? "left-[16px] right-[16px] h-[12px]" : "left-[24px] right-[24px] h-[20px]"} absolute bg-[#5A37AC] rounded-full z-0`}></div>
          
          {/* Nœuds (Fleurs ou Cercles gris) */}
          {joursSemaineBase.map((_, index) => {
            const estComplete = index < joursConsecutifs;
            return (
              <div key={`node-${index}`} className={`${floating ? "w-8 h-8" : "w-12 h-12"} flex items-center justify-center z-10`}>
                {estComplete ? (
                  <img 
                    src="/images/Sakura.svg" 
                    alt="Fleur de Sakura" 
                    className={`${floating ? "w-7 h-7" : "w-10 h-10"} object-contain drop-shadow-sm select-none`}
                  />
                ) : (
                  <div className={`${floating ? "w-5 h-5" : "w-8 h-8"} bg-[#B9ADB4] rounded-full`}></div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>

      {/* SECTION : MESSAGE DE FÉLICITATIONS */}
      <div className={`${floating ? "gap-1" : "gap-3"} flex flex-col items-center`}>
        <h3 className={`${floating ? "text-sm" : "text-lg"} flex items-center justify-center gap-2 text-[#212121] font-medium`}>
          <img src="/images/Sakura.svg" alt="Fleur" className={`${floating ? "w-5 h-5" : "w-6 h-6"} object-contain`} />
          {joursConsecutifs} jours consécutifs !
        </h3>
        {!floating && (
          <p className="text-[#4b3b5c] text-center font-medium text-lg">
            Quel bel engagement ! Continue ainsi, tu rayonnes<br/>de plus en plus.
          </p>
        )}
      </div>
      
    </div>
  );
}
