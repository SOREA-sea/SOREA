"use client";

import React from "react";

interface StreakTrackerProps {
  joursConsecutifs?: number;
}

export default function StreakTracker({ joursConsecutifs = 2 }: StreakTrackerProps) {
  const joursSemaineBase = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div className="w-full max-w-3xl flex flex-col items-center my-12 z-10 mx-auto">

      <div className="flex flex-col w-full max-w-[592px] mx-auto mb-10 gap-3">
        
        {/* SECTION : LETTRES DES JOURS */}
        <div className="flex justify-between px-2">
          {joursSemaineBase.map((jour, index) => {
            const estComplete = index < joursConsecutifs;
            
            return (
              <div 
                key={`text-${index}`} 
                className={`w-12 text-center font-bold text-2xl ${estComplete ? 'text-[#FF4F6E]' : 'text-[#5A37AC]'}`}
              >
                {jour}
              </div>
            );
          })}
        </div>
        
        {/* SECTION : LIGNE CONTINUE ET NŒUDS */}
        <div className="relative flex justify-between px-2 items-center h-12">
          
          
          <div className="absolute left-[24px] right-[24px] h-[20px] bg-[#5A37AC] rounded-full z-0"></div>
          
          {/* Nœuds (Fleurs ou Cercles gris) */}
          {joursSemaineBase.map((_, index) => {
            const estComplete = index < joursConsecutifs;
            return (
              <div key={`node-${index}`} className="w-12 h-12 flex items-center justify-center z-10">
                {estComplete ? (
                  <img 
                    src="/images/Sakura.svg" 
                    alt="Fleur de Sakura" 
                    className="w-10 h-10 object-contain drop-shadow-sm select-none" 
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#B9ADB4] rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>

      {/* SECTION : MESSAGE DE FÉLICITATIONS */}
      <div className="flex flex-col items-center gap-3">
        <h3 className="flex items-center justify-center gap-2 text-[#212121] font-medium text-lg">
          <img src="/images/Sakura.svg" alt="Fleur" className="w-6 h-6 object-contain" />
          {joursConsecutifs} jours consécutifs !
        </h3>
        <p className="text-[#4b3b5c] text-center font-medium text-lg">
          Quel bel engagement ! Continue ainsi, tu rayonnes<br/>de plus en plus.
        </p>
      </div>
      
    </div>
  );
}