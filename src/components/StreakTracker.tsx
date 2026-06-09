"use client";

import React from "react";


interface StreakTrackerProps {
  joursConsecutifs?: number;
}

export default function StreakTracker({ joursConsecutifs = 2 }: StreakTrackerProps) {
  
  const joursSemaineBase = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div className="w-full max-w-3xl flex flex-col items-center my-12 z-10 mx-auto">
      <p className="text-center text-[#4b3b5c] text-xl mb-1 font-medium">
        Bienvenue dans ton parcours d'équilibre ! Challenge toi et débloque d'incroyables défis bien-être.
      </p>
      <p className="text-center text-[#4b3b5c] text-xl mb-12 font-medium">
        Chaque instant est une occasion de te reconnecter à toi-même.
      </p>

      
      <div className="flex flex-col w-full max-w-lg mx-auto mb-10 gap-3">
        
        
        <div className="flex justify-between px-2">
          {joursSemaineBase.map((jour, index) => {
            const estComplete = index < joursConsecutifs;
            return (
              <div 
                key={`text-${index}`} 
                className={`w-12 text-center font-bold text-2xl ${estComplete ? 'text-[#FF9B9B]' : 'text-[#5A37AC]'}`}
              >
                {jour}
              </div>
            );
          })}
        </div>
        
        
        <div className="relative flex justify-between px-2 items-center h-12">
          
          
          <div className="absolute left-[24px] right-[24px] h-[10px] bg-[#B3B3B3] rounded-full z-0"></div>
          
          
          <div 
            className="absolute left-[24px] h-[10px] bg-[#5A37AC] rounded-full z-0 transition-all duration-700 ease-out" 
            style={{ width: `calc(${(Math.max(joursConsecutifs - 1, 0)) / 6} * (100% - 48px))` }}
          ></div>
          
          
          {joursSemaineBase.map((_, index) => {
            const estComplete = index < joursConsecutifs;
            return (
              <div key={`node-${index}`} className="w-12 h-12 flex items-center justify-center z-10">
                {estComplete ? (
                  
                  <span className="text-[40px] leading-none drop-shadow-sm select-none">🌸</span>
                ) : (
                  
                  <div className="w-8 h-8 bg-[#B3B3B3] rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>

      
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-[#4b3b5c] font-bold text-2xl">🔥 {joursConsecutifs} jours consécutifs !</h3>
        <p className="text-[#4b3b5c] text-center font-medium text-lg">
          Quel bel engagement ! Continue ainsi, tu rayonnes<br/>de plus en plus.
        </p>
      </div>
    </div>
  );
}