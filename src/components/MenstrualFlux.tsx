"use client";

import React from "react";

interface MenstrualFluxProps {
  isSnowflakeMode: boolean;
  value?: number;
  onChange?: (val: number) => void;
  customValue?: string;
  onCustomChange?: (val: string) => void;
}

export default function MenstrualFlux({
  isSnowflakeMode,
  value,
  onChange,
  customValue,
  onCustomChange,
  onValidate,
}: MenstrualFluxProps & { onValidate?: (flux: string, time: string) => void }) {
  const [internalFlux, setInternalFlux] = React.useState<number>(1);
  const [internalCustom, setInternalCustom] = React.useState<string>("");
  const [isValidated, setIsValidated] = React.useState<boolean>(false);

  // Heure réelle actuelle (ex: "14:32")
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentFlux = value !== undefined ? value : internalFlux;
  const currentCustom = customValue !== undefined ? customValue : internalCustom;

  const handleFluxChange = (val: number) => {
    if (onChange) onChange(val);
    if (value === undefined) setInternalFlux(val);
  };

  const handleCustomChange = (val: string) => {
    if (onCustomChange) onCustomChange(val);
    if (customValue === undefined) setInternalCustom(val);
  };

  return (
    <div className="space-y-6 py-4 flex flex-col items-center">
      {/* Conteneur de la jauge avec bordure élégante */}
      <div className="w-full max-w-md p-6 rounded-3xl border border-gray-300 bg-white shadow-sm flex flex-col items-center">
        <div className="w-full px-4 py-2 relative flex items-center justify-between">
          
          {/* Ligne de fond horizontale de couleur #C0ACFF */}
          <div className="absolute left-6 right-6 h-1.5 bg-[#C0ACFF] rounded-full z-0">
            <div 
              className="h-full bg-[#F95C5C] rounded-full transition-all duration-300"
              style={{ width: `${((currentFlux - 1) / 4) * 100}%` }}
            />
          </div>

          {/* 5 points cliquables de la jauge */}
          {[1, 2, 3, 4, 5].map((val) => {
            const isReached = currentFlux >= val;
            const isCurrent = currentFlux === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleFluxChange(val)}
                className={`relative z-10 w-6 h-6 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                  isReached ? 'bg-[#F48B8B]' : 'bg-[#7F4DC5]'
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
        {currentFlux === 1 ? "Très léger" : currentFlux === 2 ? "Léger" : currentFlux === 3 ? "Modéré" : currentFlux === 4 ? "Abondant" : "Très abondant"}
      </div>

      {/* Champ de précision "Plus de précisions..." avec bouton Valider intégré */}
      <div className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm mb-2 flex items-center gap-3">
        <input
          type="text"
          placeholder="Plus de précisions..."
          value={currentCustom}
          onChange={(e) => {
            handleCustomChange(e.target.value);
            setIsValidated(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setIsValidated(true);
              const fluxText = currentFlux === 1 ? "Très léger" : currentFlux === 2 ? "Léger" : currentFlux === 3 ? "Modéré" : currentFlux === 4 ? "Abondant" : "Très abondant";
              if (onValidate) {
                onValidate(fluxText, getCurrentTime());
              }
            }
          }}
          className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
        />
        <button
          type="button"
          onClick={() => {
            setIsValidated(true);
            const fluxText = currentFlux === 1 ? "Très léger" : currentFlux === 2 ? "Léger" : currentFlux === 3 ? "Modéré" : currentFlux === 4 ? "Abondant" : "Très abondant";
            if (onValidate) {
              onValidate(fluxText, getCurrentTime());
            }
          }}
          className="px-4 py-2 bg-[#8B47FF] text-white text-xs font-bold rounded-xl hover:bg-[#7535e6] transition-all cursor-pointer"
        >
          {isValidated ? "Validé ✓" : "Valider"}
        </button>
      </div>
    </div>
  );
}