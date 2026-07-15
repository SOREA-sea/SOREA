// app/page.tsx
"use client"; // Nécessaire si vous êtes sur Next.js App Router

import React from 'react';
import WheelSpinner from '@/components/WheelSpinner'; // Ajustez le chemin d'accès selon votre structure

export default function MaPageRoue() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f5f5f7]">
      <h1 className="text-3xl font-bold text-[#7A7385] mb-8">
        Mon application SOREA
      </h1>
      
      {/* Conteneur pour limiter la taille ou centrer si besoin */}
      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-white shadow-sm">
        <WheelSpinner />
      </div>
    </main>
  );
}