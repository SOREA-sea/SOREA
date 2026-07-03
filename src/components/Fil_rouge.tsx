"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; // <-- AJOUTER CETTE LIGNE

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: string; // admin, user, coach, etc.
  createdAt: string;
}

interface FilRougeMatinProps {
  profile: ProfileData | null;
}

export default function FilRougeMatin({ profile }: FilRougeMatinProps) {
  // Construction dynamique du nom d'affichage à partir du profil
  const displayName = profile 
    ? `${profile.firstName} ${profile.lastName}`
    : "Utilisateur";

  // Détermination de l'image de profil (Avatar personnalisé ou Logo SOREA par défaut)
  const avatarSrc = profile?.avatarUrl || "/image_Fil-rouge/SOREA_little.png";

  // Style de badge selon le rôle pour donner une touche visuelle sympa sous le nom
  const getRoleBadgeColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-red-100 text-red-700 border-red-200";
      case "coach": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-purple-100 text-purple-700 border-purple-200";
    }
  };

  // Liste ordonnée par défaut pour commencer la matinée.
  const steps = [
    {
      id: "lotus",
      src: "/image_Fil-rouge/Lotus.svg",
      alt: "Lotus",
      width: 80,
      height: 80,
      href: "/wim-hof", // <-- Ajout du lien vers la page Wim Hof
    },
    {
      id: "miroir",
      src: "/image_Fil-rouge/miroir_affirmation_manche.svg",
      alt: "Miroir d'affirmation",
      width: 75,
      height: 110,
      href: "/miroir",
    },
    {
      id: "appareil",
      src: "/image_Fil-rouge/Appareil_photo.svg",
      alt: "Appareil photo",
      width: 90,
      height: 70,
      href: "/visualisation", // <-- Ajout du lien vers la page Visualisation
    },
    {
      id: "courrier",
      src: "/image_Fil-rouge/Courrier.svg",
      alt: "Courrier",
      width: 80,
      height: 65,
      href: "/mot-a-moi", // <-- Ajout du lien vers la page Mot à moi
    },
    {
      id: "wheel-spinner",
      src: "/image_Fil-rouge/Wheel-Spinner.svg",
      alt: "Roulette",
      width: 80,
      height: 150,
      href: "/route", // <-- Ajout du lien vers la page Route
    },
  ];

  return (
    <div>
      
      {/* En-tête de la frise */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wide text-[#592592] uppercase">
          Mon Fil Rouge
        </h1>
        <p className="text-lg md:text-xl font-medium text-[#7d53b2] mt-2">
          Combinaison pour tous les matins
        </p>
      </div>

      {/* Conteneur principal de la Frise Responsive */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative px-4 py-6">
        
        {/* ÉTAPE 1 : Profil Utilisateur connecté */}
        <div className="flex flex-col items-center text-center z-10 shrink-0 min-w-[120px]">
          <span className="text-sm font-bold text-[#592592] mb-3 block truncate max-w-[140px]" title={displayName}>
            {displayName}
          </span>
          <div className="relative w-20 h-20 rounded-full bg-white shadow-md ring-4 ring-[#e1d5f5] flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-300">
            <Image
              src={avatarSrc}
              alt={`Avatar de ${displayName}`}
              fill
              className="object-cover p-1 rounded-full"
              priority
            />
          </div>
          {profile?.role && (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border mt-2 ${getRoleBadgeColor(profile.role)}`}>
              {profile.role}
            </span>
          )}
        </div>

        {/* Boucle à travers les étapes de l'icône (Lotus, Miroir, Appareil photo, Courrier) */}
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            
            {/* Ligne pointillée/ondulée de connexion (Fil Rouge SVG) */}
            <div className="hidden lg:block flex-1 relative h-6 min-w-[40px] mx-2">
              <div 
                className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat opacity-70 animate-pulse"
                style={{ backgroundImage: "url('/image_Fil-rouge/Fil-rouge.svg')" }}
              />
            </div>

            {/* Ligne verticale pour la version mobile */}
            <div className="block lg:hidden w-0.5 h-12 bg-gradient-to-b from-purple-300 to-red-300 opacity-60" />

            {/* L'icône de l'étape */}
            {/* L'icône de l'étape (Rendue cliquable si 'href' existe) */}
{/* L'icône de l'étape : mène directement à la page correspondante */}
<div className="flex items-center justify-center z-10 transition-transform hover:scale-110 duration-300 cursor-pointer">
  <Link href={step.href}>
    <div className="relative" style={{ width: step.width, height: step.height }}>
      <Image src={step.src} alt={step.alt} fill className="object-contain" />
    </div>
  </Link>
</div>

          </React.Fragment>
        ))}
        {/* Ligne de liaison finale vers l'objectif */}
        <div className="hidden lg:block flex-1 relative h-6 min-w-[40px] mx-2">
          <div 
            className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat opacity-70"
            style={{ backgroundImage: "url('/image_Fil-rouge/Fil-rouge.svg')" }}
          />
        </div>
        <div className="block lg:hidden w-0.5 h-12 bg-gradient-to-b from-purple-300 to-red-300 opacity-60" />

        {/* ÉTAPE FINALE : Objectif / Défis atteints */}
        <div className="flex flex-col items-center text-center z-10 shrink-0 min-w-[130px]">
          <div className="relative w-16 h-16 mb-2 transition-transform hover:rotate-12 duration-300">
            <Image
              src="/image_Fil-rouge/Flag.png"
              alt="Drapeau d'accomplissement"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-[#592592] font-black text-sm leading-tight max-w-[120px]">
            Défis introspectif atteint
          </div>
        </div>

      </div>
    </div>
  );
  
}