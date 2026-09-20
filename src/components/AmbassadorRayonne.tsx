"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RayonneSection() {
  const router = useRouter();

  return (
    <section className="w-full py-[48px] px-4 md:px-[64px] flex flex-col items-center justify-center gap-10">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Bloc Texte & Puces (Gauche) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          <div className="flex flex-col items-center lg:items-start gap-1">
            <span className="text-xs md:text-sm font-medium tracking-wider text-[#2A2340]/70 uppercase">
              Rejoins la communauté SOREA
            </span>
            <h2 className="text-4xl md:text-5xl font-normal tracking-wide text-[#8B47FF] font-serif">
              Rayonne
            </h2>
          </div>

          {/* Liste des points avec icônes */}
          <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex items-center gap-4">
              <Image
                src="/image_LandingPage/LotusTiret.svg"
                alt="Lotus"
                width={24}
                height={24}
                className="w-6 h-6 shrink-0 object-contain"
              />
              <p className="text-sm md:text-base text-[#2A2340]/80">
                Transforme ta passion du bien-être en activité
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Image
                src="/image_LandingPage/LotusTiret.svg"
                alt="Lotus"
                width={24}
                height={24}
                className="w-6 h-6 shrink-0 object-contain"
              />
              <p className="text-sm md:text-base text-[#2A2340]/80">
                Fais découvrir les soins naturels SOREA à tes proches
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Image
                src="/image_LandingPage/LotusTiret.svg"
                alt="Lotus"
                width={24}
                height={24}
                className="w-6 h-6 shrink-0 object-contain"
              />
              <p className="text-sm md:text-base text-[#2A2340]/80">
                Organise tes séances selon ton rythme et tes envies
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Image
                src="/image_LandingPage/LotusTiret.svg"
                alt="Lotus"
                width={24}
                height={24}
                className="w-6 h-6 shrink-0 object-contain"
              />
              <p className="text-sm md:text-base text-[#2A2340]/80">
                Rejoins un réseau d&apos;ambassadrices inspirantes
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Image
                src="/image_LandingPage/LotusTiret.svg"
                alt="Lotus"
                width={24}
                height={24}
                className="w-6 h-6 shrink-0 object-contain"
              />
              <p className="text-sm md:text-base text-[#2A2340]/80">
                Profite d&apos;événements exclusifs de la communauté SOREA
              </p>
            </div>
          </div>
        </div>

        {/* Grille de 14 carrés gris */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="grid grid-cols-3 gap-4 w-full max-w-[606px] items-start max-h-[850px] overflow-hidden">
            
            {/* Colonne 1 */}
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
            </div>

            {/* Colonne 2 */}
            <div className="flex flex-col gap-4 pt-8">
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
            </div>

            {/* Colonne 3 */}
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
              <div className="w-full aspect-square bg-gray-300 rounded-[12px]" />
            </div>

          </div>
        </div>

      </div>

      {/* Bouton centré en bas de section */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.push("/ambassadrice-bientot")}
          className="px-8 py-3 bg-[#8B47FF] hover:bg-[#7833ee] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
        >
          Devenir ambassadrice
        </button>
      </div>
    </section>
  );
}