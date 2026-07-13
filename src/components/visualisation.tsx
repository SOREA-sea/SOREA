"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Visualisation from "@/components/visualisation";
import { Play, Brain, Target, Heart, Sparkles } from "lucide-react";

// On recrée l'interface ici pour pouvoir lire correctement les données sauvegardées
interface VisualImage {
  id: string;
  colorClass?: string;
  imageUrl?: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  dateAdded?: string;
}

type TabType = "galerie" | "archives" | "trash";

// Coordonnées des 3 "fenêtres" du SVG pellicule_vide.svg, exprimées en % du conteneur (120x360)
// ⚠️ A AJUSTER selon le viewBox réel de ton SVG si besoin
const FILM_SLOTS = [
  { top: "5.5%", height: "25%" },
  { top: "37.5%", height: "25%" },
  { top: "69.5%", height: "25%" },
];

export default function VisualisationPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [galerie, setGalerie] = useState<VisualImage[]>([]);
  const [archives, setArchives] = useState<VisualImage[]>([]);
  const [trash, setTrash] = useState<VisualImage[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("galerie");

  // On vérifie l'URL au chargement de la page (pour le bouton "Jouer directement" du fil rouge)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("play") === "true") {
        setIsStarted(true);
      }
    }
  }, []);

  // On récupère toutes les listes locales à chaque fois qu'on revient sur la présentation
  useEffect(() => {
    if (!isStarted && typeof window !== "undefined") {
      const savedGalerie = localStorage.getItem("sorea_visualisation_galerie");
      if (savedGalerie) setGalerie(JSON.parse(savedGalerie));

      const savedArchives = localStorage.getItem("sorea_visualisation_archives");
      if (savedArchives) setArchives(JSON.parse(savedArchives));

      const savedTrash = localStorage.getItem("sorea_visualisation_trash");
      if (savedTrash) setTrash(JSON.parse(savedTrash));
    }
  }, [isStarted]);

  // Récupère la liste actuellement sélectionnée par l'onglet
  const currentImages = activeTab === "galerie" ? galerie : activeTab === "archives" ? archives : trash;

  // === VUE 2 : L'ACTIVITÉ (Le jeu) ===
  if (isStarted) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">
        <div className="w-full">
          <div className="max-w-[1440px] mx-auto px-[96px] pb-[24px]">
            <Navbar />
          </div>
        </div>

        <main className="flex-1 w-full flex flex-col items-center">
          <div className="w-full max-w-[1440px] mx-auto px-[96px] flex flex-col items-center pt-[50px] pb-[24px]">
            <div className="w-full mb-10 flex flex-col items-start gap-2">
              <button 
                onClick={() => setIsStarted(false)}
                className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF] relative z-10"
              >
                ← Retour à la présentation
              </button>
            </div>
            
            <div className="w-full flex-grow flex flex-col items-center relative z-10">
              <Visualisation />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // === VUE 1 : LA PRÉSENTATION (Wireframe) ===
  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">
      
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-[96px] pb-[24px]">
          <Navbar />
        </div>
      </div>

      <main className="flex-1 w-full flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-[96px] flex flex-col pt-12 pb-24 gap-24">
          
          <div className="w-full flex flex-col items-start gap-2">
            <Link href="/challenge">
              <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF] relative z-10">
                ← Retour
              </button>
            </Link>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative -mt-10">
            <div className="flex flex-col gap-6 z-10">
              <h1 className="text-5xl lg:text-7xl font-black text-black tracking-wide">
                Visualise ton <span className="text-[#8B47FF]">Idéal</span>
              </h1>
              <p className="text-xl text-[#4b3b5c] leading-relaxed max-w-lg mt-4">
                Ajoute tes images inspirantes et projette-toi dans tes rêves : voyage, carrière, projets, instants de gratitude... 
                Nourris ta pellicule du bien-être et ancre-toi dans le positif.
              </p>
              <button 
                onClick={() => setIsStarted(true)}
                className="w-fit bg-[#8B47FF] text-white font-bold px-10 py-5 rounded-full shadow-[0_10px_30px_rgba(139,71,255,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(139,71,255,0.4)] mt-6 flex items-center gap-3 text-lg"
              >
                <Play size={20} fill="currentColor" />
                Lancer la projection
              </button>
            </div>
            
            <div className="relative h-[400px] lg:h-[600px] flex justify-end items-center pointer-events-none">
              <img 
                src="/image_icone/image_visualisation/pellicule_penché.svg" 
                alt="Pellicule décorative" 
                className="absolute right-[-100px] h-[130%] object-contain drop-shadow-2xl"
              />
            </div>
          </section>

          {/* Pellicule à gauche, Galerie à droite */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
            
            {/* Aperçu Pellicule Dynamique (À GAUCHE) */}
            <div className="bg-[#FAF5FF] rounded-[32px] p-8 md:p-12 shadow-inner border border-purple-100 flex flex-col items-center justify-between gap-8 relative overflow-hidden">
              <h3 className="text-xl font-bold text-[#592592] z-10 bg-white/90 px-8 py-3 rounded-full backdrop-blur-sm shadow-sm">
                Votre Pellicule SOREA
              </h3>
              
              {/* Conteneur de la pellicule : Taille exacte 1/3 (120x360) et sans fond blanc ! */}
              <div 
                className="relative z-10 rounded-sm overflow-hidden shadow-xl"
                style={{ width: '120px', height: '360px' }} 
              >
                {/* 1. Le SVG en <img> par-dessus (z-20), sert uniquement de cadre visuel */}
                <img
                  src="/image_icone/image_visualisation/pellicule_vide.svg"
                  alt="Cadre pellicule"
                  className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                />

                {/* 2. Les 3 photos positionnées en absolu, calées sur les coordonnées réelles des trous */}
                {FILM_SLOTS.map((slot, i) => {
                  const img = galerie[i];
                  return (
                    <div
                      key={i}
                      className="absolute z-10 overflow-hidden rounded-[2px] bg-gray-100"
                      style={{
                        left: "12.5%",
                        width: "75%",
                        top: slot.top,
                        height: slot.height,
                      }}
                    >
                      {img?.imageUrl ? (
                        <img
                          src={img.imageUrl}
                          alt={`Film ${i}`}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: `calc(50% + ${img.offsetX || 0}px) calc(50% + ${img.offsetY || 0}px)`,
                            transform: `scale(${img.scale || 1})`,
                          }}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setIsStarted(true)}
                className="z-10 bg-white text-[#8B47FF] border-2 border-[#8B47FF] font-bold px-8 py-4 rounded-full shadow-md transition-all hover:bg-[#8B47FF] hover:text-white flex items-center gap-2 group"
              >
                Lancer la projection <Play size={16} className="fill-current group-hover:text-white" />
              </button>
            </div>

            {/* Aperçu Galerie Dynamique (À DROITE) */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-purple-100 flex flex-col gap-8">
              {/* Onglets dynamiques */}
              <div className="flex gap-8 border-b border-purple-100 pb-4">
                <span 
                  onClick={() => setActiveTab("galerie")}
                  className={`font-bold pb-4 -mb-[17px] cursor-pointer ${activeTab === "galerie" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600 transition-colors"}`}
                >
                  Votre galerie
                </span>
                <span 
                  onClick={() => setActiveTab("archives")}
                  className={`font-bold pb-4 -mb-[17px] cursor-pointer ${activeTab === "archives" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600 transition-colors"}`}
                >
                  Archives
                </span>
                <span 
                  onClick={() => setActiveTab("trash")}
                  className={`font-bold pb-4 -mb-[17px] cursor-pointer ${activeTab === "trash" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600 transition-colors"}`}
                >
                  Corbeille
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* On affiche les 3 premières images de la liste sélectionnée */}
                {currentImages.slice(0, 3).map((img, index) => (
                  <div key={img.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative bg-gray-100 group">
                    {img.imageUrl ? (
                      <img
                        src={img.imageUrl}
                        alt={`${activeTab} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{
                          objectPosition: `calc(50% + ${img.offsetX || 0}px) calc(50% + ${img.offsetY || 0}px)`,
                          transform: `scale(${img.scale || 1})`,
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full ${img.colorClass || "bg-gray-100"}`}></div>
                    )}
                  </div>
                ))}
                
                {/* Cases vides de remplissage (s'il y a moins de 3 images) */}
                {Array.from({ length: Math.max(0, 3 - currentImages.length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-100"></div>
                ))}

                {/* Bouton "Ajouter" qui lance le jeu */}
                <div 
                  onClick={() => setIsStarted(true)}
                  className="aspect-square bg-[#FAF5FF] border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <span className="text-5xl font-light">+</span>
                </div>
              </div>
            </div>

          </section>

          {/* 3. BIENFAITS SECTION */}
          <section className="flex flex-col items-center gap-16 mt-16 w-full">
            <h2 className="text-3xl lg:text-4xl font-black text-[#592592] text-center">
              Les bienfaits de se visualiser
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="flex flex-col items-center text-center gap-5 p-10 bg-white rounded-[32px] shadow-sm border border-purple-50 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-purple-50 text-[#8B47FF] rounded-2xl flex items-center justify-center mb-2">
                  <Target size={36} />
                </div>
                <h4 className="text-xl font-bold text-black">Clarté Mentale</h4>
                <p className="text-[#4b3b5c] leading-relaxed">Aide à définir tes objectifs avec précision et à voir clairement le chemin pour y parvenir.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-5 p-10 bg-white rounded-[32px] shadow-sm border border-purple-50 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-purple-50 text-[#8B47FF] rounded-2xl flex items-center justify-center mb-2">
                  <Brain size={36} />
                </div>
                <h4 className="text-xl font-bold text-black">Motivation Accrue</h4>
                <p className="text-[#4b3b5c] leading-relaxed">Maintient l'enthousiasme et l'engagement en gardant tes rêves à portée de vue chaque jour.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-5 p-10 bg-white rounded-[32px] shadow-sm border border-purple-50 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-purple-50 text-[#8B47FF] rounded-2xl flex items-center justify-center mb-2">
                  <Heart size={36} />
                </div>
                <h4 className="text-xl font-bold text-black">Baisse du Stress</h4>
                <p className="text-[#4b3b5c] leading-relaxed">Apaise l'esprit en se concentrant sur le positif et l'abondance plutôt que sur les manques.</p>
              </div>
            </div>
          </section>

          {/* 4. CITATION */}
          <section className="w-full bg-[#592592] rounded-[32px] p-16 text-center relative overflow-hidden mt-10 shadow-xl">
            <Sparkles className="absolute top-8 left-12 text-yellow-300 opacity-60 animate-pulse" size={48} />
            <Sparkles className="absolute bottom-8 right-12 text-purple-300 opacity-60 animate-pulse" size={36} />
            <h3 className="text-2xl md:text-4xl font-bold text-white italic leading-relaxed relative z-10 max-w-4xl mx-auto">
              "La visualisation est le rêve éveillé qui façonne la réalité."
            </h3>
          </section>

        </div>
      </main>

      <Footer />
      
    </div>
  );
}