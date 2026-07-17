"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Visualisation from "@/components/visualisation";
import { Play, Brain, Target, Heart, Sparkles } from "lucide-react";

// Interface pour les données sauvegardées
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

export default function VisualisationPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [galerie, setGalerie] = useState<VisualImage[]>([]);
  const [archives, setArchives] = useState<VisualImage[]>([]);
  const [trash, setTrash] = useState<VisualImage[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("galerie");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("play") === "true") {
        setIsStarted(true);
      }
    }
  }, []);

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

  // === VUE 1 : LA PRÉSENTATION ===
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

          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
            
            {/* Aperçu Pellicule Vide (À GAUCHE) */}
            <div className="bg-[#FAF5FF] rounded-[32px] p-8 md:p-12 shadow-inner border border-purple-100 flex flex-col items-center justify-between gap-8 relative overflow-hidden">
              <h3 className="text-xl font-bold text-[#592592] z-10 bg-white/90 px-8 py-3 rounded-full backdrop-blur-sm shadow-sm">
                Votre Pellicule SOREA
              </h3>
              
              <div 
                className="relative z-10 shadow-xl"
                style={{ width: '120px', height: '360px', backgroundImage: "url('/image_icone/image_visualisation/pellicule_visualisation.svg')", backgroundSize: "100% 100%" }} 
              />

              <button 
                onClick={() => setIsStarted(true)}
                className="z-10 bg-white text-[#8B47FF] border-2 border-[#8B47FF] font-bold px-8 py-4 rounded-full shadow-md transition-all hover:bg-[#8B47FF] hover:text-white flex items-center gap-2 group"
              >
                Lancer la projection <Play size={16} className="fill-current group-hover:text-white" />
              </button>
            </div>

            {/* Aperçu Galerie (À DROITE) */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-purple-100 flex flex-col gap-8">
              <div className="flex gap-8 border-b border-purple-100 pb-4">
                {["galerie", "archives", "trash"].map((tab) => (
                  <span 
                    key={tab}
                    onClick={() => setActiveTab(tab as TabType)}
                    className={`font-bold pb-4 -mb-[17px] cursor-pointer capitalize ${activeTab === tab ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600 transition-colors"}`}
                  >
                    {tab === "trash" ? "Corbeille" : tab}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                {currentImages.slice(0, 3).map((img, index) => (
                  <div key={img.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative bg-gray-100 group">
                    {img.imageUrl ? (
                      <img src={img.imageUrl} alt="img" className="w-full h-full object-cover" />
                    ) : <div className={`w-full h-full ${img.colorClass || "bg-gray-100"}`}></div>}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - currentImages.length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-100"></div>
                ))}
                <div 
                  onClick={() => setIsStarted(true)}
                  className="aspect-square bg-[#FAF5FF] border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <span className="text-5xl font-light">+</span>
                </div>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  );
}