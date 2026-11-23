"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement";
import { getFavoriWheel, WheelCategory } from "@/lib/favorites-store";

export default function RouteDesDefis() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [survol, setSurvol] = useState<'nutrition' | 'bienetre' | 'sport' | null>(null);

  const isNutritionLocked = false; // Mets à false si tu souhaites déverrouiller la carte
  const isSportLocked = false; // Pareil, Mets à false si tu souhaites déverrouiller la carte

  const [themeBienEtre, setThemeBienEtre] = useState<'pastel' | 'pop'>('pastel');
  const [themeSport, setThemeSport] = useState<'pastel' | 'pop'>('pastel');
  const [themeNutrition, setThemeNutrition] = useState<'pastel' | 'pop'>('pastel');
  const [favoriWheel, setFavoriWheelState] = useState<WheelCategory | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Charger le favori au démarrage
      setFavoriWheelState(getFavoriWheel());

      const savedBienEtre = localStorage.getItem('soreaThemeActif_BienEtre') as 'pastel' | 'pop';
      if (savedBienEtre) setThemeBienEtre(savedBienEtre);

      const savedSport = localStorage.getItem('soreaThemeActif_Sport') as 'pastel' | 'pop';
      if (savedSport) setThemeSport(savedSport);

      const savedNutrition = localStorage.getItem('soreaThemeActif_Nutrition') as 'pastel' | 'pop';
      if (savedNutrition) setThemeNutrition(savedNutrition);

      // Fonctions de mise à jour par événement
      const handleThemeChangeBienEtre = () => {
        const updated = localStorage.getItem('soreaThemeActif_BienEtre') as 'pastel' | 'pop';
        if (updated) setThemeBienEtre(updated);
      };

      const handleThemeChangeSport = () => {
        const updated = localStorage.getItem('soreaThemeActif_Sport') as 'pastel' | 'pop';
        if (updated) setThemeSport(updated);
      };

      const handleThemeChangeNutrition = () => {
        const updated = localStorage.getItem('soreaThemeActif_Nutrition') as 'pastel' | 'pop';
        if (updated) setThemeNutrition(updated);
      };

      const handleFavoriChange = () => {
        setFavoriWheelState(getFavoriWheel());
      };

      window.addEventListener('themeChange_BienEtre', handleThemeChangeBienEtre);
      window.addEventListener('themeChange_Sport', handleThemeChangeSport);
      window.addEventListener('themeChange_Nutrition', handleThemeChangeNutrition);
      window.addEventListener('favoriChange', handleFavoriChange);
      window.addEventListener('storage', handleFavoriChange);
      
      return () => {
        window.removeEventListener('themeChange_BienEtre', handleThemeChangeBienEtre);
        window.removeEventListener('themeChange_Sport', handleThemeChangeSport);
        window.removeEventListener('themeChange_Nutrition', handleThemeChangeNutrition);
        window.removeEventListener('favoriChange', handleFavoriChange);
        window.removeEventListener('storage', handleFavoriChange);
      };
    }
  }, []);

  const hideInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-[96px] pb-[24px] gap-[50px]">
          <Navbar />
        </div>
      </div>

      {/* CONTENU */}
      <main className="flex-1 w-full flex flex-col items-center py-10 ">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center">

          <h1 className="text-4xl font-bold text-center mb-16 mt-5">
            Relève tes défis bien-être avec SOREA
          </h1>

          {showInstructions ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-in fade-in duration-300">
              <div className="w-full max-w-lg mx-4 p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 flex flex-col items-center relative animate-in zoom-in-95 duration-300">
                <p className="text-center text-[#4b3b5c] text-xl font-bold mb-2">
                  Bienvenue dans ton parcours d'équilibre !
                </p>
                <p className="text-center text-gray-600 text-base mb-8">
                  Choisis une catégorie pour commencer et Challenge toi.
                </p>
                
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={hideInstructions}
                    className="px-8 py-2.5 bg-[#8B47FF] text-white font-bold rounded-full hover:bg-[#7a3be6] transition-colors shadow-md text-sm cursor-pointer"
                  >
                    OK
                  </button>
                  <button 
                    onClick={hideInstructions}
                    className="px-4 py-2.5 bg-transparent text-gray-400 font-medium hover:text-[#8B47FF] transition-colors text-sm underline underline-offset-2 cursor-pointer"
                  >
                    Ne plus afficher
                  </button>
                </div>
              </div>
            </div>
          ): null}

          {/* MENU DE SÉLECTION OU AFFICHAGE DE LA ROUE */}
          <div className="relative z-10 w-full flex flex-col items-center">
              <div className="flex gap-15 w-full max-w-[1228px] justify-center">
          
          {/* NUTRITION */}
                <Link 
                  href={isNutritionLocked ? "#" : "/Wheel-Spinner/Nutrition"}
                  onClick={(e) => isNutritionLocked && e.preventDefault()}
                  onMouseEnter={() => setSurvol('nutrition')}
                  onMouseLeave={() => setSurvol(null)}
                  className={`relative flex flex-col items-center justify-center p-8 w-[300px] h-[260px] transition-all duration-300 overflow-hidden group ${
                    isNutritionLocked ? "cursor-default" : "cursor-pointer"
                  }`}
                  style={{ isolation: 'isolate' }}
                >
                  {/* Fond coloré visible uniquement au survol */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, #F4C4E4 0%, rgba(244, 196, 228, 0.1) 100%)",
                      clipPath: survol === 'nutrition' ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                      transition: 'clip-path 300ms ease-out',
                    }}
                  />
                  {isNutritionLocked && (
                    <div className="absolute inset-0 bg-black/10 backdrop-grayscale backdrop-blur-[1px] z-20 flex flex-col items-center justify-center">
                      <img src="/image_icone/ClosedPadlockWhite.svg" alt="Cadenas" className="w-10 h-10 drop-shadow-md" />
                      <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#212121]/80 text-white text-base px-3 py-1.5 shadow-lg pointer-events-none whitespace-nowrap">
                        Ce challenge sera bientôt disponible !
                      </div>
                    </div>
                  )}
                  {favoriWheel === "nutrition" && (
                    <img 
                      src="/image_icone/FavoritesYes.svg" 
                      alt="Favori" 
                      className="absolute top-4 right-4 w-6 h-6 object-contain" 
                    />
                  )}
                  <h2 className="relative z-10 text-3xl font-bold text-center text-[#5A37AC] pb-5">Nutrition</h2>
                  <img src={themeNutrition === 'pop' ? "/image_Design-SOREA/image_Wheel-Spinner/WS_Nutrition2.svg" : "/image_Design-SOREA/image_Wheel-Spinner/WS_Nutrition1.svg"} alt="Wheel-Spinner Nutrition" className="relative z-10 mb-4 transition-all duration-300" />
                  <span className="relative z-10 text-sm text-gray-500 text-center">Défis sains et gourmands</span>
                </Link>

         {/* BIEN-ÊTRE */}
                <Link 
                  href="/Wheel-Spinner/BienEtre"
                  onMouseEnter={() => setSurvol('bienetre')}
                  onMouseLeave={() => setSurvol(null)}
                  className="relative flex flex-col items-center justify-center p-8 w-[300px] h-[260px] cursor-pointer transition-all duration-300 overflow-hidden group"
                  style={{ isolation: 'isolate' }}
                >
                  {/* Fond coloré visible uniquement au survol */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, #C0ACFF 0%, rgba(192, 172, 255, 0.1) 100%)",
                      clipPath: survol === 'bienetre' ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                      transition: 'clip-path 300ms ease-out',
                    }}
                  />
                  {favoriWheel === "bien-etre" && (
                    <img 
                      src="/image_icone/FavoritesYes.svg" 
                      alt="Favori" 
                      className="absolute top-4 right-4 w-6 h-6 object-contain" 
                    />
                  )}
                  <h2 className="relative z-10 text-3xl font-bold text-center text-[#5A37AC] pb-5">Bien-être</h2>
                  <img src={themeBienEtre === 'pop' ? "/image_Design-SOREA/image_Wheel-Spinner/WS_Bien-être2.svg" : "/image_Design-SOREA/image_Wheel-Spinner/WS_Bien-être1.svg"} 
                    alt="Wheel-Spinner Bien-être" 
                    className="relative z-10 mb-4 transition-all duration-300" 
                  />
                  <span className="relative z-10 text-sm text-gray-500 text-center">Recentrage et positivité</span>
                </Link>

          {/* SPORT */}
               <Link 
                  href={isSportLocked ? "#" : "/Wheel-Spinner/Sport"}
                  onClick={(e) => isSportLocked && e.preventDefault()}
                  onMouseEnter={() => setSurvol('sport')}
                  onMouseLeave={() => setSurvol(null)}
                  className={`relative flex flex-col items-center justify-center p-8 w-[300px] h-[260px] transition-all duration-300 overflow-hidden group ${
                    isSportLocked ? "cursor-default" : "cursor-pointer"
                  }`}
                  style={{ isolation: 'isolate' }}
                >
                  {/* Fond coloré visible uniquement au survol */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, #B7F8F5 0%, rgba(183, 248, 245, 0.1) 100%)",
                      clipPath: survol === 'sport' ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                      transition: 'clip-path 300ms ease-out',
                    }}
                  />
                  {isSportLocked && (
                    <div className="absolute inset-0 bg-black/10 backdrop-grayscale backdrop-blur-[1px] z-20 flex flex-col items-center justify-center">
                      <img src="/image_icone/ClosedPadlockWhite.svg" alt="Cadenas" className="w-10 h-10 drop-shadow-md" />
                      <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#212121]/80 text-white text-base px-3 py-1.5 shadow-lg pointer-events-none whitespace-nowrap">
                        Ce challenge sera bientôt disponible !
                      </div>
                    </div>
                  )}
                  {favoriWheel === "sport" && (
                    <img 
                      src="/image_icone/FavoritesYes.svg" 
                      alt="Favori" 
                      className="absolute top-4 right-4 w-6 h-6 object-contain" 
                    />
                  )}
                  <h2 className="relative z-10 text-3xl font-bold text-center text-[#5A37AC] pb-5">Sport</h2>
                  <img src={themeSport === 'pop' ? "/image_Design-SOREA/image_Wheel-Spinner/WS_Sport2.svg" : "/image_Design-SOREA/image_Wheel-Spinner/WS_Sport1.svg"} alt="Wheel-Spinner Sport" className="relative z-10 mb-4 transition-all duration-300" />
                  <span className="relative z-10 text-sm text-gray-500 text-center">Bouge et dépense-toi</span>
                </Link>

              </div>
            
          </div>

        </div>
  
      </main>

<div 
  className="w-full py-20 relative z-10 flex justify-center"
  style={{background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%)"
  }}>
    <div className="w-full max-w-[1228px] px-4 justify-center">
      <DailyEncouragement />
    </div>
</div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}