"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement"; // Import du composant demandé

export default function MiroirLandingPage() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[#fcfbfe] font-sans text-gray-800">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-[96px] pt-[24px]">
          <Navbar />
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* SECTION HÉRO (Haut de page) */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] pt-[80px] pb-[60px] flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Texte de gauche */}
          <div className="flex flex-col items-start max-w-[600px] gap-6">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Headline/title
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Please add your content here. Keep it short and simple. And smile :)
            </p>
            <Link href="mirror/miroir">
              <button className="bg-[#8B47FF] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                Activer mon miroir
              </button>
            </Link>
          </div>

          {/* Miroir de droite */}
          <div className="relative w-full max-w-[450px] h-[450px] flex items-center justify-center bg-[#dcd2f7]/40 rounded-3xl p-6">
            <img
              src="/image_icone/miroir.png"
              alt="Miroir affirmation"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </section>

        {/* SECTION ÉTAPES (01, 02, 03) */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] py-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Étape 1 */}
            <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#8B47FF]">01</span>
              <h3 className="text-xl font-bold text-gray-900">Écris ton mot</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Please add your content here. Keep it short and simple. And smile :)
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#8B47FF]">02</span>
              <h3 className="text-xl font-bold text-gray-900">Répète ton affirmation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Please add your content here. Keep it short and simple. And smile :)
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#8B47FF]">03</span>
              <h3 className="text-xl font-bold text-gray-900">Construis ta chaine</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Please add your content here. Keep it short and simple. And smile :)
              </p>
            </div>

          </div>
        </section>

        {/* SECTION APPEL À L'ACTION FINAL */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] py-[80px] flex flex-col sm:flex-row items-center justify-between bg-purple-50/50 rounded-3xl my-12 border border-purple-100/60">
          <div className="flex flex-col items-start gap-2 mb-6 sm:mb-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Prête à t'affirmer avec bienveillance ?
            </h2>
            <p className="text-sm text-gray-500">
              Quelques minutes suffisent pour commencer.
            </p>
          </div>
          <Link href="/mirror/miroir">
            <button className="bg-[#8B47FF] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              Activer mon miroir
            </button>
          </Link>
        </section>

        {/* SECTION DAILY ENCOURAGEMENT (Remplace l'encadré violet de l'image) */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] py-[40px] flex justify-center">
          <div className="w-full max-w-[1000px]">
            <DailyEncouragement />
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}