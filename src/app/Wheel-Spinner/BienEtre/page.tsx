"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // Import de Link pour le retour
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement";
import WheelSpinnerBienEtre from "@/components/WheelSpinnerBienEtre";
import WheelSinnerBienEtrePayment from "@/components/WheelSpinnerBienEtrePayment";
// Ajout des imports pour la gestion de la phase
import { fetchCurrentPhase } from "@/lib/cyclePhase";
import { Phase } from "@/lib/affirmations";

export default function PageBienEtre() {
  const [showInstruction, setShowInstructionsWellness] = useState(true);
  // État pour le mode actif des défis
  const [activeMode, setActiveMode] = useState<"default" | "cycle">("default");
  // Ajout de l'état pour stocker la phase actuelle du cycle
  const [currentPhase, setCurrentPhase] = useState<Phase>("Printemps");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [wheelKey, setWheelKey] = useState(0);
  // État pour vérifier si le calendrier menstruel est actif (ON/OFF)
  const [isCalendarActive, setIsCalendarActive] = useState<boolean>(true);
  // État pour afficher l'infobulle au survol si désactivé
  const [showTooltip, setShowTooltip] = useState(false);

  // Récupération de la phase et du profil menstruel au chargement de la page
  useEffect(() => {
    fetchCurrentPhase().then(setCurrentPhase);
    fetch("/api/menstrual-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile) {
          setIsCalendarActive(data.profile.isActive);
        }
      })
      .catch((err) => console.error("Erreur chargement profil", err));
  }, []);
const hideInstructionsWellness = () => {
    setShowInstructionsWellness(false);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative">
      
      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[96px] pb-[24px] pt-[24px]">
          <Navbar />
        </div>
      </div>

{showInstruction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-in fade-in duration-300">
              <div className="w-full max-w-lg mx-4 p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 flex flex-col items-center relative animate-in zoom-in-95 duration-300">
                <p className="text-center text-[#4b3b5c] text-xl font-bold mb-2">
                  Cultive ta paix intérieure
                </p>
                <p className="text-gray-600 text-base mb-8 mt-3">
                  Tourne ton Wheel-Spinner et développe un bien-être durable en apprenant à mieux te connaître, à renforcer ton équilibre émotionnel et à cultiver des habitudes positives qui te permettront de révéler ton plein potentiel.
                </p>
                
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={hideInstructionsWellness}
                    className="px-8 py-2.5 bg-[#8B47FF] text-white font-bold rounded-full hover:bg-[#7a3be6] transition-colors shadow-md text-sm cursor-pointer"
                  >
                    OK
                  </button>
                  <button 
                    onClick={hideInstructionsWellness}
                    className="px-4 py-2.5 bg-transparent text-gray-400 font-medium hover:text-[#8B47FF] transition-colors text-sm underline underline-offset-2 cursor-pointer"
                  >
                    Ne plus afficher
                  </button>
                </div>
              </div>
            </div>
          )}

      {/* CONTENU PRINCIPAL - Juste la roue centrée */}
      <main className="flex-1 w-full flex flex-col items-center py-3">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center">
          
          {/* Bouton Retour stylé */}
          {/* 1. En-tête de la zone de jeu (Retour, Style, Favoris) */}
    
    {/* Bouton Retour stylé */}
          <div className="w-full max-w-[1440px] mx-auto px-[96px] sticky top-[85px] z-40 pointer-events-none mb-[-60px]">
          <div className="flex flex-col items-start gap-2 pointer-events-auto w-fit">
            <Link 
              href="/Wheel-Spinner" // Lien vers la page de sélection
              className="text-[#8B47FF] font-bold px-6 py-2 rounded-2xl border border-[#8B47FF] hover:bg-[#8B47FF] hover:text-white transition-all shadow-sm flex items-center gap-2 bg-white cursor-pointer"
            >
              ← Retour aux choix
            </Link>
          </div>
          </div>

          {/* La roue spécifique affichée ici directement */}
          {/* 2. Le jeu de la roue (maintenant dans la même div englobante) */}
       
       {/* Conteneur principal côte à côte (Flexbox) */}
          <div className="w-full max-w-[1200px] flex flex-row items-center justify-center gap-20 mt-12 z-10 pointer-events-auto">
            
            {/* Bloc de gauche : Titre et boutons de sélection */}
             <div className="relative flex flex-col items-center text-center gap-8 shrink-0">
              <div className="flex flex-col items-center text-center gap-3">
                <h1 className="text-3xl md:text-4xl font-serif font-light text-[#212121] tracking-wider whitespace-nowrap translate-x-[80px] -mt-[40px]">
                  Défis<br />Bien-être
                </h1>
                {/* Affichage dynamique de la phase si le mode "cycle" est actif */}
                {activeMode === "cycle" && (
                  <h2 className="text-3xl font-semibold text-[#7F4DC5] italic translate-x-[80px] -mt-[40px]">
                    {currentPhase}
                  </h2>
                )}
              </div>

              {/* Conteneur global avec le décalage d'origine pour garder l'infobulle libre */}
              <div className="relative translate-x-[80px] -mt-[40px]">
                {/* Les boutons de sélection de mode (forme pilule avec bordure/stroke intacte) */}
                <div className="flex w-[350px] h-[55px] bg-white border border-[#9b6fd9] rounded-xl overflow-hidden shadow-sm">
                  <button 
                    type="button"
                    onClick={() => setActiveMode("default")}
                    className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors border-r border-[#9b6fd9] cursor-pointer text-center px-1 ${
                      activeMode === "default" ? "bg-purple-100 text-[#7F4DC5] font-bold" : "text-gray-800 hover:bg-purple-50"
                    }`}
                  >
                    Par défaut
                  </button>

                  <div 
                    className="flex-1 h-full flex items-center justify-center"
                    onMouseEnter={() => !isCalendarActive && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <button 
                      type="button"
                      onClick={() => {
                        if (isCalendarActive) setActiveMode("cycle");
                      }}
                      className={`w-full h-full flex items-center justify-center text-xs font-medium transition-colors text-center px-1 ${
                        !isCalendarActive 
                          ? "bg-gray-100 text-gray-400 cursor-pointer" 
                          : activeMode === "cycle" 
                          ? "bg-purple-100 text-[#7F4DC5] font-bold cursor-pointer" 
                          : "text-gray-800 hover:bg-purple-50 cursor-pointer"
                      }`}
                    >
                      Cycles menstruels
                    </button>
                  </div>
                </div>

                {/* Infobulle placée EN BAS et PLUS LARGE (350px comme la pilule) */}
                {!isCalendarActive && showTooltip && (
                  <div className="absolute top-full mt-3 right-0 w-[300px] p-3.5 bg-gray-800 text-white text-xs rounded-xl shadow-2xl z-50 pointer-events-none text-center animate-in fade-in duration-200 leading-relaxed">
                    Veuillez activer le calendrier pour découvrir tes défis selon ton cycle.
                  </div>
                )}
              </div>
            </div>

            {/* Bloc de droite : La roue spécifique avec son échelle */}
            <div className="relative flex flex-col items-center scale-65 origin-top shrink-0">
              <div className="relative flex justify-center items-center">
                {/* Transmission du mode à la roue */}
                <WheelSpinnerBienEtre 
                  key={wheelKey} 
                  mode={activeMode} 
                  onOpenPayment={() => setShowPaymentModal(true)} 
                />
              </div>
            </div>

          </div>
    
  </div>
  
      </main>

      <WheelSinnerBienEtrePayment
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirmPayment={() => {
          setShowPaymentModal(false);
          setWheelKey(prev => prev + 1);
        }}
      />
     
           {/* FOOTER */}
           <Footer />
         </div>
       );
     }