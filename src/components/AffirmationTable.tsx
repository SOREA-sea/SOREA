import React from "react";

export default function AffirmationTable() {
  return (
    <div className="w-full max-w-[650px] overflow-hidden rounded-2xl shadow-sm border border-purple-100 flex flex-col gap-2 p-2 bg-white">
      
      {/* Ligne d'en-tête */}
      <div className="grid grid-cols-4 gap-2 text-center font-bold text-sm lg:text-base">
        <div className="bg-[#7F6674] text-white py-3 px-2 rounded-xl flex items-center justify-center">
          Critère
        </div>
        <div className="bg-[#B9ADB4] text-white py-3 px-2 rounded-xl flex items-center justify-center">
          Description
        </div>
        <div className="bg-[#B9ADB4] text-white py-3 px-2 rounded-xl flex items-center justify-center">
          Erreur à éviter
        </div>
        <div className="bg-[#B9ADB4] text-white py-3 px-2 rounded-xl flex items-center justify-center">
          Exemple à adopter
        </div>
      </div>

      {/* Ligne 1 : Présent */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs lg:text-sm">
        <div className="bg-[#7F4DC5] text-white font-bold py-4 px-2 rounded-xl flex items-center justify-center">
          Présent
        </div>
        <div className="bg-[#C0BBFC] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center">
          <span>Parlez comme si c'était&nbsp;<span className="font-bold">déjà là</span>&nbsp;</span>
        </div>
        <div className="bg-[#C0BBFC] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center italic">
          “Je serai confiant•e”
        </div>
        <div className="bg-[#C0BBFC] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center">
          “Je&nbsp;<span className="font-bold">suis</span>&nbsp;confiant•e”
        </div>
      </div>

      {/* Ligne 2 : Positif */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs lg:text-sm">
        <div className="bg-[#E256B3] text-white font-bold py-4 px-2 rounded-xl flex items-center justify-center">
          Positif
        </div>
        <div className="bg-[#F4C4E4] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center">
          <span>&nbsp;<span className="font-bold">Évitez</span>&nbsp;les&nbsp;<span className="font-bold">négations</span>&nbsp;</span>
        </div>
        <div className="bg-[#F4C4E4] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center italic">
          “Je ne veux plus stresser”
        </div>
        <div className="bg-[#F4C4E4] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center">
          “Je suis serein et calme”
        </div>
      </div>

      {/* Ligne 3 : Personnel */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs lg:text-sm">
        <div className="bg-[#00CEC9] text-white font-bold py-4 px-2 rounded-xl flex items-center justify-center">
          Personnel
        </div>
        <div className="bg-[#B7F8F5] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center">
          <span>Commencez par “&nbsp;<span className="font-bold">Je</span>&nbsp;” </span>
        </div>
        <div className="bg-[#B7F8F5] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center italic">
          “Les gens m'aiment”
        </div>
        <div className="bg-[#B7F8F5] text-purple-900 py-4 px-2 rounded-xl flex items-center justify-center">
          <span>“<span className="font-bold">Je</span>&nbsp;cultive des relations saines”</span>
        </div>
      </div>

    </div>
  );
}