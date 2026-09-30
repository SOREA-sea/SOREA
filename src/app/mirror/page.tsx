"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement"; // Import du composant demandé
import AffirmationTable from "@/components/AffirmationTable";

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
          <div className="flex flex-col items-start max-w-[600px] gap-12">
            <h1 className="text-4xl lg:text-3xl font-extrabold text-[#212121] tracking-tight">
              Prête à t'affirmer avec bienveillance ?
            </h1>
            <Link href="mirror/miroir">
              <button className="bg-[#8B47FF] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                Activer mon miroir
              </button>
            </Link>
          </div>

          {/* Miroir de droite */}
          <div className="relative w-full max-w-[450px] h-[450px] flex items-center justify-center p-6">
            {/* Fond ovale lumineux avec dégradé et flou */}
            <div className="absolute inset-0 m-auto w-[500px] h-[600px] rounded-[50%] bg-[#C0BBFC] blur-3xl opacity-85 pointer-events-none"></div>
            <img
              src="/image_icone/miroir.png"
              alt="Miroir affirmation"
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </section>

        {/* SECTION ÉTAPES (01, 02, 03) */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] py-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Étape 1 */}
            <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#8B47FF]">01</span>
              <h3 className="text-xl font-bold text-gray-900">Inaugure ton miroir</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Active ton micro et ta caméra intelligente, observe ton jolie reflet.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#8B47FF]">02</span>
              <h3 className="text-xl font-bold text-gray-900">Accueille de belles valeurs</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Installe toi confortablement et répète des affirmations. Fais rayonner ton état d'esprit.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#8B47FF]">03</span>
              <h3 className="text-xl font-bold text-gray-900">Personnalise ton univers</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Personnalise tes propres affirmations, inspirées de qui tu es, de la personne que tu souhaites devenir et de tes convictions propres.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION APPEL À L'ACTION FINAL */}
        {/* SECTION : Crée ton Affirmation avec bouton et galerie sur la droite */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] py-[40px] flex flex-col lg:flex-row items-center justify-between gap-12 bg-purple-50/50 rounded-3xl my-12 border border-purple-100/60">
          
          {/* Colonne de gauche : Titre et Tableau d'affirmation */}
          <div className="flex flex-col items-center justify-center gap-6 flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-[#212121] text-center">
              ↓ Crée ton Affirmation de cette manière ↓
            </h2>
            <AffirmationTable />
             {/* Tableau des critères d'affirmation codé en dur */}
        
          </div>

          {/* Colonne de droite : Bouton d'action + Galerie des affirmations enregistrées */}
          <div className="flex flex-col items-center justify-center gap-6 w-full lg:w-auto">
            
            {/* Bouton pour accéder à la personnalisation */}
            <Link href="/mirror">
              <button className="bg-[#7F4DC5] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                Personnaliser mon affirmation
              </button>
            </Link>

            {/* Galerie interactive reliée aux réalisations (style page_6.tsx) */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-purple-100 w-full max-w-[400px] flex flex-col gap-6">
              
              {/* Onglets de la galerie */}
              <div className="flex gap-6 border-b border-purple-100 pb-3 text-sm">
                <span className="font-bold pb-2 -mb-[13px] text-[#8B47FF] border-b-2 border-[#8B47FF] cursor-pointer">
                  Galerie
                </span>
                <span className="font-bold pb-2 -mb-[13px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  Corbeille
                </span>
              </div>
              
              {/* Grille des vignettes (similaire à la capture) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-purple-50 flex items-center justify-center p-3 text-center text-xs font-medium text-purple-700">
                  "Je suis confiant(e)"
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-purple-50 flex items-center justify-center p-3 text-center text-xs font-medium text-purple-700">
                  "Je cultive la paix"
                </div>
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-100"></div>
                <Link href="/mirror/miroir" className="aspect-square bg-[#FAF5FF] border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
                  <span className="text-4xl font-light">+</span>
                </Link>
              </div>

            </div>

          </div>

        </section>

        {/* SECTION DAILY ENCOURAGEMENT (Remplace l'encadré violet de l'image) */}
       <div 
         className="w-full py-20 relative z-10 flex justify-center"
         style={{background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%)"
         }}>
           <div className="w-full max-w-[1228px] px-4 justify-center">
             <DailyEncouragement />
           </div>
       </div>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}