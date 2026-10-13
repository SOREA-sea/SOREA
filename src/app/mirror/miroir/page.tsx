"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import AffirmationGallery from "@/components/AffirmationGallery";
import { pickAffirmation, Phase } from "@/lib/affirmations";
import { pickDefaultAffirmation } from "@/lib/defaultAffirmations";
import { fetchCurrentPhase } from "@/lib/cyclePhase";

export default function NouvellePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(true);
  
  // État pour contrôler l'ouverture de la modale "Personnalisées"
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const [microActive, setMicroActive] = useState(true);
  // État du mode d'affirmation sélectionné ('default' par défaut)
  const [activeMode, setActiveMode] = useState<"default" | "cycle" | "custom">("default");

  const [activeCustomCard, setActiveCustomCard] = useState<any>(null);

  // --- États pour les affirmations (100% local, plus d'IA) ---
  const [affirmation, setAffirmation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [affirmationCount, setAffirmationCount] = useState<number>(0);
  const [usedAffirmationIds, setUsedAffirmationIds] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<Phase>("Printemps");

  // Simulation de l'utilisateur (à remplacer par mes vrais states ou props globaux)
  const [loggedUser, setLoggedUser] = useState<any>({ name: "Test" }); // Mettre null pour tester le cas "non-inscrit"
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  // --- RECONNAISSANCE VOCALE ---
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // --- Simulation du blocage multi-appareils (maquette, sans backend) ---
  const [blockedByOtherDevice, setBlockedByOtherDevice] = useState<boolean>(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Erreur d'accès à la caméra :", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (blockedByOtherDevice) return;
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const startMicro = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      setMicroActive(true);
    } catch (err) {
      console.error("Erreur d'accès au micro :", err);
    }
  };

  const stopMicro = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    setMicroActive(false);
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const toggleMicro = () => {
    if (blockedByOtherDevice) return;
    if (microActive) {
      stopMicro();
    } else {
      startMicro();
    }
  };

  // Charger le compteur du jour + la liste des affirmations déjà vues aujourd'hui
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const storedCount = localStorage.getItem(`sorea_affirmations_${today}`);
    if (storedCount) {
      setAffirmationCount(parseInt(storedCount, 10));
    }
    const storedUsed = localStorage.getItem(`sorea_affirmations_used_${today}`);
    if (storedUsed) {
      setUsedAffirmationIds(JSON.parse(storedUsed));
    }
    // Détermine la phase réelle du cycle (remplace la phase codée en dur)
    fetchCurrentPhase().then(setCurrentPhase);
  }, []);

  useEffect(() => {
    const loadCustom = () => {
      const savedCard = localStorage.getItem("sorea_active_custom_affirmation");
      if (savedCard) {
        setActiveCustomCard(JSON.parse(savedCard));
      }
      const savedMode = localStorage.getItem("sorea_active_mode");
      if (savedMode === "custom") {
        setActiveMode("custom");
      }
    };
    loadCustom();
    window.addEventListener("customAffirmationChanged", loadCustom);
    return () => window.removeEventListener("customAffirmationChanged", loadCustom);
  }, []);

  // --- Génère la prochaine affirmation localement (plus d'appel API/Gemini) ---
  const genererAffirmationMiroir = () => {
    const today = new Date().toISOString().split("T")[0];

    // Limites quotidiennes
    if (!loggedUser) {
  alert("Vous devez être inscrit pour utiliser le miroir !✨");
  return;
}
let maxLimit = hasSubscription ? 999 : 5;

    if (affirmationCount >= maxLimit) {
      alert(`Limite quotidienne atteinte ! Tu as utilisé tes ${maxLimit} reflets du jour. Reviens demain ! ✨`);
      return;
    }

    setLoading(true);

    // Petit délai de 3,5s avant que la phrase suivante n'apparaisse
    setTimeout(() => {
      let chosenText = "";
      let chosenId = "";

      if (activeMode === "default") {
        const chosen = pickDefaultAffirmation(usedAffirmationIds);
        chosenText = chosen.text;
        chosenId = chosen.id;
      } else if (activeMode === "custom" && activeCustomCard) {
        chosenText = activeCustomCard.text;
        chosenId = activeCustomCard.id;
      } else {
        const chosen = pickAffirmation(currentPhase, usedAffirmationIds);
        chosenText = chosen.text;
        chosenId = chosen.id;
      }

      setAffirmation(chosenText);

      const nextUsed = [...usedAffirmationIds, chosenId];
      setUsedAffirmationIds(nextUsed);
      localStorage.setItem(`sorea_affirmations_used_${today}`, JSON.stringify(nextUsed));

      const nextCount = affirmationCount + 1;
      setAffirmationCount(nextCount);
      localStorage.setItem(`sorea_affirmations_${today}`, nextCount.toString());

      setLoading(false);
    }, 3500);
};
  // --- Reconnaissance vocale automatique (mode "perroquet") ---
  const startSpeechRecognition = (textToMatch: string) => {
    if (!microActive || !textToMatch) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }

      const clean = (str: string) => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim();
      const spokenText = clean(currentTranscript);
      const targetText = clean(textToMatch);

      if (spokenText.length > 5 && (targetText.includes(spokenText) || spokenText.includes(targetText))) {
        recognition.onend = null;
        recognition.stop();
        genererAffirmationMiroir();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Relance l'écoute dès qu'une nouvelle affirmation arrive
  useEffect(() => {
    if (affirmation && microActive) {
      const timer = setTimeout(() => {
        startSpeechRecognition(affirmation);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [affirmation, microActive]);

  // Démarre caméra/micro à l'arrivée sur la page, coupe tout au départ
  useEffect(() => {
    startCamera();
    startMicro();
    return () => {
      stopCamera();
      stopMicro();
    };
  }, []);

  // Coupe caméra/micro si l'utilisatrice change d'onglet ou minimise la fenêtre
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
        stopMicro();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">

      {/* NAVBAR */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-[96px] pb-[24px]">
          <Navbar />
        </div>
      </div>

      {/* CONTENU */}
      <main className="flex-1 w-full flex flex-col items-center relative">
        
        {/* Bouton "Retour" et test positionnés en mode flottant sous la Navbar avec les mêmes marges (px-[96px]) */}
        <div className="w-full max-w-[1440px] mx-auto px-[96px] sticky top-[85px] z-40 pointer-events-none mb-[-60px]">
          <div className="flex flex-col items-start gap-2 pointer-events-auto w-fit">
            <Link href="welcomemirror">
              <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border border-[#8B47FF]">
                ← Retour
              </button>
            </Link>

            {/* Bouton de test temporaire */}
            <button
              onClick={() => setBlockedByOtherDevice((prev) => !prev)}
              className="text-xs text-gray-400 underline bg-white/80 px-2 py-0.5 rounded"
            >
              [Test] Simuler blocage multi-appareils
            </button>
          </div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-[96px] flex flex-col items-center pt-[100px] pb-[24px]">
          <div className="w-full mb-6 flex flex-col items-start gap-2">
            {/* Le bouton a été remonté en mode flottant */}
          </div>

          <div className="flex-grow flex flex-col items-center justify-center w-full min-h-[300px] gap-8 relative z-10">

            <div
              className={`relative flex justify-center items-center rounded-3xl transition-all duration-300 ${
                blockedByOtherDevice ? "ring-4 ring-red-500" : ""
              }`}
              style={{ width: "400px", height: "550px" }}
            >

 {/* Groupe "Affirmation" et les 3 boutons placés strictement à gauche du miroir */}
<div className="absolute left-[-380px] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-12">
  <div className="flex flex-col items-center text-center gap-2">
    <h1 className="text-3xl md:text-4xl font-serif text-[#7F4DC5] tracking-tight whitespace-nowrap">
      Affirmation
    </h1>
    {activeMode === "custom" && activeCustomCard && (
      <h2 className="text-lg font-semibold text-[#212121] italic">
        {activeCustomCard.title}
      </h2>
    )}
  </div>

  {/* Les 3 boutons avec gestion de la couleur active et bascule immédiate de l'affirmation */}
  <div className="flex w-[350px] h-[55px] bg-white border border-[#9b6fd9] rounded-[10px] overflow-hidden shadow-sm">
    <button 
      onClick={() => {
        setActiveMode("default");
        // Optionnel : si tu veux générer immédiatement une affirmation de ce mode au clic
      }}
      className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors border-r border-[#9b6fd9] cursor-pointer text-center px-1 ${
        activeMode === "default" ? "bg-purple-100 text-[#7F4DC5] font-bold" : "text-gray-800 hover:bg-purple-50"
      }`}
    >
      Par défaut
    </button>

    <button 
      onClick={() => {
        setActiveMode("cycle");
      }}
      className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors border-r border-[#9b6fd9] cursor-pointer text-center px-1 ${
        activeMode === "cycle" ? "bg-purple-100 text-[#7F4DC5] font-bold" : "text-gray-800 hover:bg-purple-50"
      }`}
    >
      Cycles menstruels
    </button>

    <button 
      onClick={() => {
        setActiveMode("custom");
        setIsCustomModalOpen(true);
      }}
      className={`flex-1 h-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer text-center px-1 ${
        activeMode === "custom" ? "bg-purple-100 text-[#7F4DC5] font-bold" : "text-gray-800 hover:bg-purple-50"
      }`}
    >
      Personnalisées
    </button>
  </div>

</div>

              <img
                src="/image_icone/miroir.svg"
                alt="Cadre du miroir"
                className="absolute z-0 w-full h-full object-contain pointer-events-none"
              />

              <div
                className="absolute z-10 overflow-hidden"
                style={{
                  width: "203px",
                  height: "270px",
                  borderRadius: "50%",
                  top: "48%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  marginTop: "12px"
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              </div>

              {/* Frame de contrôle placée strictement à droite du miroir (300x300px, border-radius 15px) */}
              <div className="absolute left-[440px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white border border-[#9b6fd9] rounded-[15px] shadow-sm flex flex-col items-center justify-between z-30 overflow-hidden">
                
                {/* Ligne du haut avec les icônes réduites caméra et micro + le trait séparateur sur toute la largeur */}
                <div className="w-full flex flex-col items-end">
                  <div className="w-full flex justify-end items-center gap-8 px-5 pt-4 pb-3">
                    <button 
                      onClick={toggleCamera}
                      className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                    >
                      <img
                        src={cameraActive ? "/image_icone/Camera_active.svg" : "/image_icone/Camera_desactive.svg"}
                        alt="Caméra"
                        className="w-9 h-9"
                      />
                    </button>

                    <button 
                      onClick={toggleMicro}
                      className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                    >
                      <img
                        src={microActive ? "/image_icone/Micro_active.svg" : "/image_icone/Micro_desactive.svg"}
                        alt="Micro"
                        className="w-9 h-9"
                      />
                    </button>
                  </div>
                  {/* Trait horizontal séparateur */}
                  <div className="w-full border-b border-[#7F4DC5]/50" />
                </div>

                {/* Élément central cliquable avec play1.svg pour démarrer */}
                <div className="flex-1 flex items-center justify-center">
                  <button 
                    onClick={genererAffirmationMiroir}
                    disabled={loading}
                    className="transition-transform duration-300 hover:scale-110 cursor-pointer disabled:opacity-50"
                    title="Commencer"
                  >
                    <img
                      src="/image_icone/play1.svg"
                      alt="Lecteur"
                      className="w-20 h-20 object-contain"
                    />
                  </button>
                </div>

                {/* Bouton Suivant en bas de la frame */}
                <div className="w-full px-6 pb-4">
                  <button
                    onClick={genererAffirmationMiroir}
                    disabled={loading}
                    className="w-full bg-[#8B47FF] text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 cursor-pointer text-center"
                  >
                    {loading ? "Chargement..." : "Suivant"}
                  </button>
                </div>
              </div>

              {/* Affirmation superposée sur le miroir, en bas de l'ovale (cf. maquette Figma) */}
              {affirmation && (
                <div
                  className="absolute z-20 text-center text-white text-sm font-medium rounded-lg"
                  style={{
                    width: "210px",
                    top: "72%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(33, 33, 33, 0.5)",
                    padding: "10px 25px",
                  }}
                >
                  {affirmation}
                </div>
              )}
            </div>

            {/* Mention de protection des données, visible dès que la caméra est active */}
            {cameraActive && (
              <p className="text-xs text-gray-400 text-center max-w-[320px]">
                🔒 Ta caméra sert uniquement à t'afficher en direct dans le miroir. Rien n'est enregistré ni partagé.
              </p>
            )}

            {/* Message quand le miroir est bloqué (maquette, sans vraie détection multi-appareils) */}
            {blockedByOtherDevice && (
              <div className="max-w-[400px] text-center bg-red-50 border border-red-300 text-red-600 text-sm font-medium px-4 py-3 rounded-2xl">
                Ton miroir est déjà actif sur un autre appareil. Ferme-le là-bas pour l'activer ici.
              </div>
            )}

            {/* Consigne (indicateur d'écoute) sous le miroir */}
            {affirmation && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-[#8B47FF] rounded-full text-sm font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#8B47FF]"></span>
                {isListening ? "Répétez à haute voix ce que vous voyez pour passer à la suivante..." : "Micro en attente..."}
                <span className="text-xs text-purple-400 font-normal ml-1">
                  ({affirmationCount} utilisé{affirmationCount > 1 ? 's' : ''} aujourd'hui — phase {currentPhase})
                </span>
              </div>
            )}

            {!affirmation && (
              <p className="text-gray-500 text-sm italic font-medium max-w-[300px] text-center">
                Cliquez sur le bouton de lecture pour voir votre premier reflet...
              </p>
            )}

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
      {/* Composant pour afficher la modale au clic sur "Personnalisées" */}
<AffirmationGallery externalIsOpen={isCustomModalOpen} setExternalIsOpen={setIsCustomModalOpen} />
    </div>
  );
}