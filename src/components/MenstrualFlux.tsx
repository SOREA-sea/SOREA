"use client";

import React from "react";

interface MenstrualFluxProps {
  fluxValue: number;
  setFluxValue: (val: number) => void;
  fluxCustom: string;
  setFluxCustom: (val: string) => void;
  isSnowflakeMode: boolean;
}

export default function MenstrualFlux({
  fluxValue,
  setFluxValue,
  fluxCustom,
  setFluxCustom,
  isSnowflakeMode,
}: MenstrualFluxProps) {
  return (
    <div className="space-y-6 py-4 flex flex-col items-center">
      {/* Conteneur de la jauge avec bordure élégante */}
      <div className="w-full max-w-md p-6 rounded-3xl border border-gray-300 bg-white shadow-sm flex flex-col items-center">
        <div className="w-full px-4 py-2 relative flex items-center justify-between">
          
          {/* Ligne de progression violette de fond */}
          <div className="absolute left-6 right-6 h-1.5 bg-purple-200 rounded-full z-0">
            <div 
              className="h-full bg-[#8B47FF] rounded-full transition-all duration-300"
              style={{ width: `${((fluxValue - 1) / 3) * 100}%` }}
            />
          </div>

          {/* 4 points cliquables de la jauge */}
          {[1, 2, 3, 4].map((val) => {
            const isReached = fluxValue >= val;
            const isCurrent = fluxValue === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setFluxValue(val)}
                className={`relative z-10 w-6 h-6 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                  isReached ? 'bg-[#8B47FF]' : 'bg-purple-300'
                }`}
              >
                {/* Icône dynamique (Goutte de sang ou Flocon selon le mode Discret / Menstru) */}
                {isCurrent && (
                  <div className="absolute -top-7 w-7 h-7 flex items-center justify-center animate-bounce">
                    <img
                      src={isSnowflakeMode ? "/image_icone/Flocon.svg" : "/image_Design-SOREA/Hiver.svg"}
                      alt="Icône flux"
                      className="w-6 h-6 object-contain drop-shadow-md"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Étiquette du niveau sélectionné */}
      <div className="px-6 py-2 bg-[#EADBC8]/40 border border-purple-200 text-[#7F4DC5] rounded-full font-bold text-sm shadow-sm">
        {fluxValue === 1 ? "Très léger" : fluxValue === 2 ? "Modéré" : fluxValue === 3 ? "Abondant" : "Très abondant"}
      </div>

      {/* Champ de précision "Plus de précisions..." */}
      <div className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Plus de précisions..."
          value={fluxCustom}
          onChange={(e) => setFluxCustom(e.target.value)}
          className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
        />
      </div>
    </div>
  );
}