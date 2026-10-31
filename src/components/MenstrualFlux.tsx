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
  onGlobalValidate,
}: MenstrualFluxProps & { onValidate?: (flux: string, time: string) => void; onGlobalValidate?: (fluxText: string, timeText: string) => void }) {
  const [internalFlux, setInternalFlux] = React.useState<number>(1);
  const [internalCustom, setInternalCustom] = React.useState<string>("");
  const [tempCustom, setTempCustom] = React.useState<string>(customValue !== undefined ? customValue : "");
  const [isValidated, setIsValidated] = React.useState<boolean>(false);
  const [isGlobalValidated, setIsGlobalValidated] = React.useState<boolean>(false);

  // Heure réelle actuelle (ex: "14:32")
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentFlux = value !== undefined ? value : internalFlux;
  const currentCustom = customValue !== undefined ? customValue : internalCustom;

  // Synchroniser le texte temporaire si la prop change
  React.useEffect(() => {
    if (customValue !== undefined) {
      setTempCustom(customValue);
    }
  }, [customValue]);

  const handleFluxChange = (val: number) => {
    if (onChange) onChange(val);
    if (value === undefined) setInternalFlux(val);
    setIsGlobalValidated(false);
  };

  const handleCustomChange = (val: string) => {
    setTempCustom(val);
    setIsGlobalValidated(false);
  };

  return (
    <div className="space-y-6 py-4 flex flex-col items-center">
      {/* Conteneur de la jauge avec bordure élégante */}
      <div className="w-full max-w-md p-6 rounded-3xl border border-gray-300 bg-white shadow-sm flex flex-col items-center">
        <div className="w-full px-4 py-2 relative flex items-center justify-between">
          
          {/* Ligne de fond horizontale de couleur #C0ACFF */}
          <div className="absolute left-6 right-6 h-1.5 bg-[#C0ACFF] rounded-full z-0">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isSnowflakeMode ? 'bg-[#00CEC9]' : 'bg-[#F95C5C]'}`}
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
                className={`relative z-10 w-6 h-6 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-125 ${
                  isCurrent 
                    ? 'bg-transparent shadow-none' 
                    : isReached 
                    ? (isSnowflakeMode ? 'bg-[#B7F8F5]' : 'bg-[#F48B8B]') 
                    : 'bg-[#7F4DC5]'
                }`}
              >
                {/* L'icône remplace le point sélectionné */}
                {isCurrent ? (
                  <img
                    src={isSnowflakeMode ? "/image_icone/Flocon.svg" : "/image_Design-SOREA/Hiver.svg"}
                    alt="Icône flux"
                    className="w-7 h-7 object-contain drop-shadow-md transition-transform"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Étiquette du niveau sélectionné */}
      <div className="px-6 py-2 bg-[#EADBC8]/40 border border-purple-200 text-[#7F4DC5] rounded-full font-bold text-sm shadow-sm">
        {currentFlux === 1 ? "Très léger" : currentFlux === 2 ? "Léger" : currentFlux === 3 ? "Modéré" : currentFlux === 4 ? "Abondant" : "Très abondant"}
      </div>

      {/* Champ de précision "Plus de précisions..." */}
      <div className={`w-full p-4 rounded-2xl border ${isGlobalValidated ? 'border-[#E256B3]' : 'border-gray-300'} bg-white shadow-sm mb-2 flex items-center gap-3`}>
        <input
          type="text"
          placeholder="Plus de précisions..."
          value={tempCustom}
          onChange={(e) => {
            handleCustomChange(e.target.value);
            setIsGlobalValidated(false);
          }}
          className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* Bouton Valider global tout en bas pour envoyer vers le Résultat */}
      <div className="flex justify-center pt-4 w-full">
        <button
          type="button"
          onClick={() => {
            if (onCustomChange) onCustomChange(tempCustom);
            if (customValue === undefined) setInternalCustom(tempCustom);
            setIsGlobalValidated(true);

            const fluxText = currentFlux === 1 ? "Très léger" : currentFlux === 2 ? "Léger" : currentFlux === 3 ? "Modéré" : currentFlux === 4 ? "Abondant" : "Très abondant";
            if (onGlobalValidate) {
              onGlobalValidate(fluxText, getCurrentTime());
            }
          }}
          className={`w-full py-3 text-sm font-bold rounded-2xl shadow-lg transition-all cursor-pointer ${
            isGlobalValidated ? 'bg-[#C4B5FD] text-white' : 'bg-[#8B47FF] text-white hover:bg-[#7535e6]'
          }`}
        >
          Valider
        </button>
      </div>
    </div>
  );
}