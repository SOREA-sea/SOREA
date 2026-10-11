"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RayonneSection() {
  const router = useRouter();

  return (
    <section className="w-full overflow-x-hidden">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center gap-100">
        
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

        {/* Grille de 15 carrés avec les images SOREA */}
        {/* Grille de 15 carrés aux dimensions exactes Figma (186.23px x 186.23px) */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="grid grid-cols-3 gap-4 w-[606px] max-w-[606px] items-start max-h-[956px] overflow-hidden">
            
            {/* Colonne 1 (Photos 1 à 5) */}
            <div className="flex flex-col gap-4">
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo1.svg" alt="Photo 1" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo2.svg" alt="Photo 2" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo3.svg" alt="Photo 3" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo4.svg" alt="Photo 4" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo5.svg" alt="Photo 5" fill className="object-cover" />
              </div>
            </div>

            {/* Colonne 2 (Photos 6 à 10 - décalée vers le bas avec pt-8) */}
            <div className="flex flex-col gap-4 pt-8">
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo6.svg" alt="Photo 6" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo7.svg" alt="Photo 7" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo8.svg" alt="Photo 8" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo9.svg" alt="Photo 9" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo10.svg" alt="Photo 10" fill className="object-cover" />
              </div>
            </div>

            {/* Colonne 3 (Photos 11 à 15) */}
            <div className="flex flex-col gap-4">
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo11.svg" alt="Photo 11" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo12.svg" alt="Photo 12" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo13.svg" alt="Photo 13" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo14.svg" alt="Photo 14" fill className="object-cover" />
              </div>
              <div className="w-[186.23px] h-[186.23px] shrink-0 bg-gray-300 rounded-[11.82px] overflow-hidden relative shadow-sm">
                <Image src="/image_photo/Photo15.svg" alt="Photo 15" fill className="object-cover" />
              </div>
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