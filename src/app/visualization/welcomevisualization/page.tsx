"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement";
import AffirmationGallery from "@/components/AffirmationGallery";
import VisualisationGallery from "@/components/VisualisationGallery";
import VisualisationPellicule from "@/components/VisualisationPellicule";
import VisualisationSlide from "@/components/VisualisationSlide";

export default function VisualisationPage() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[#fcfbfe] font-sans text-gray-800 overflow-x-hidden">
      
      {/* NAVBAR */}
      <div className="w-full relative z-20">
        <div className="max-w-[1440px] mx-auto px-[96px] pt-[24px]">
          <Navbar />
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 w-full flex flex-col items-center relative">
        
        {/* SECTION HÉRO (Titre + Description + Bouton + Pellicule emprisonnée) */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] pt-[60px] pb-[60px] relative flex flex-col lg:flex-row items-center justify-between min-h-[480px] overflow-hidden rounded-3xl">
          {/* Dégradés haut et bas (blanc vers transparent) */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FBF9FE] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FBF9FE] to-transparent z-10 pointer-events-none" />
          
          {/* Texte de gauche */}
          <div className="flex flex-col items-start max-w-[540px] z-10 gap-6 py-25">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#212121] tracking-tight leading-tight">
              Visualise et <br /> projette-toi
            </h1>
            
            <p className="text-base text-gray-600 leading-relaxed font-normal">
              Ajoute tes images inspirantes et projette-toi dans tes rêves : voyage, carrière, projets, instants de gratitude... Nourris ta pellicule du bien-être et ancre-toi dans le positif.
            </p>

            <Link href="/visualization/visualisation">
              <button className="bg-[#8B47FF] hover:bg-[#7a3be0] text-white font-medium px-7 py-3.5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                Lancer la projection
              </button>
            </Link>
          </div>

          {/* Pellicule penchée ajustée et emprisonnée à droite */}
          {/*<div className="absolute right-[-20px] top-[100px] w-[450px] lg:w-[520px] h-[120%] pointer-events-none z-0 flex justify-end items-center">
            <img
            src="/image_Design-SOREA/PelliculeSupport.svg"
            alt="Pellicule support"
            className="w-[360px] h-auto transform rotate-[35deg] translate-x-[-20px] translate-y-[30px] drop-shadow-md origin-top-right"
          />
        </div>*/}
        {/* Container de la pellicule animée et penchée */}
<div className="absolute right-[-30px] top-[100px] w-[450px] lg:w-[520px] h-[120%] pointer-events-none z-0 flex justify-end items-center">
  <div className="w-[360px] h-auto transform rotate-[25deg] translate-x-[80px] translate-y-[-20px] origin-top-right">
    <VisualisationPellicule />
  </div>
</div>
        </section>

        {/* SECTION APPAREIL PHOTO AVEC DIAPORAMA & GALERIE */}
        <section id="projection" className="w-full max-w-[1440px] mx-auto px-[96px] py-[60px] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
          
          {/* Appareil photo interactif avec écran Diaporama */}
          <div className="flex-1 flex justify-center items-center max-w-[500px]">
            <VisualisationSlide />
          </div>

          {/* Galerie de Visualisation */}
          <div className="flex-1 w-full max-w-[550px] flex justify-center">
            <VisualisationGallery />
          </div>

        </section>

        {/* SECTION "Les bienfaits de se visualiser" */}
        <section className="w-full max-w-[1440px] mx-auto px-[96px] py-[80px] flex flex-col items-center">
          
          {/* Titre avec soulignement */}
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#7030A0] text-center">
              Les bienfait de se visualiser
            </h2>
            <div className="w-16 h-1 bg-[#C0BBFC] rounded-full mt-3"></div>
          </div>

          {/* 3 colonnes de bienfaits avec Wheel-Spinner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-[1100px]">
            
            {/* Bienfait 1 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/image_Design-SOREA/image_Wheel-Spinner/Introspection1.svg"
                  alt="Introspection"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                Clarifier ses objectifs
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[280px]">
                Visualiser ce qui compte vraiment permet de mieux <b>définir ses priorités</b> et de les <b>garder à l'esprit</b>. Ainsi, nous pourrons <b>mieux détecter des opportunités qui passaient autrefois inaperçu</b>.

              </p>
            </div>

            {/* Bienfait 2 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/image_Design-SOREA/image_Wheel-Spinner/Écoute_corporelle.svg"
                  alt="Écoute corporelle"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                Nourrir sa motivation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[280px]">
                Se représenter régulièrement ses aspirations peut <b>renforcer sa motivation</b> et rendre ses objectifs plus présents au quotidien. Les images qui <b>suscitent des émotions positives</b> deviennent alors des rappels personnels inspirants.
              </p>
            </div>

            {/* Bienfait 3 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/image_Design-SOREA/image_Wheel-Spinner/Action_&_Défis_de_confiance.svg"
                  alt="Action et défis"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                Passage à l'action
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[280px]">
                Le cerveau est <b>premier degré</b>. Ne distinguant pas la réalité d’un scénario imaginé avec intensité, vivre virtuellement votre succès crée un <b>cercle vertueux</b> qui stimule naturellement <b>votre passage à l’action</b>. Oui. Naturellement…
              </p>
            </div>

          </div>
        </section>

        {/* SECTION DAILY ENCOURAGEMENT */}
        <div className="w-full py-12 relative z-10 flex justify-center">
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