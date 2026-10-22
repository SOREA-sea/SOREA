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
  const [microActive, setMicroActive] = useState(false); // Désactivé par défaut pour ne pas bloquer les utilisateurs sans micro
  // État du mode d'affirmation sélectionné ('default' par défaut)
  const [activeMode, setActiveMode] = useState<"default" | "cycle" | "custom">("default");

  const [activeCustomCard, setActiveCustomCard] = useState<any>(null);
  const [customIndex, setCustomIndex] = useState<number>(0);

  // État pour gérer la lecture / pause du bouton central
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // --- États pour les affirmations (100% local, plus d'IA) ---
  const [affirmation, setAffirmation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoadingText, setShowLoadingText] = useState<boolean>(false); // État pour le délai de 3s avant l'affichage du texte "✨ Reflet suivant..."
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

  const togglePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (!affirmation) {
        genererAffirmationMiroir();
      }
    } else {
      setIsPlaying(false);
      // Dès que l'on clique sur pause, on désactive le micro et on stoppe la reconnaissance vocale
      stopMicro();
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

  // État pour la modale d'instructions du miroir (étape 1 puis étape 2)
  const [showInstruction, setShowInstruction] = useState(true);
  const [instructionStep, setInstructionStep] = useState<1 | 2>(1);

  const hideInstructionsMirror = () => {
    setShowInstruction(false);
  };

 // --- Génère la prochaine affirmation avec un délai de transition de 3s pour "Reflet suivant..." ---
  const genererAffirmationMiroir = () => {
    const today = new Date().toISOString().split("T")[0];

    if (!loggedUser) {
      alert("Vous devez être inscrit pour utiliser le miroir !✨");
      return;
    }
    let maxLimit = 999; // Limite fixée à 999 pour tout le monde

    setLoading(true);
    setShowLoadingText(false); // Réinitialisation au départ

    // 1. Après 3 secondes d'attente, on affiche le message "✨ Reflet suivant..."
    const showTimer = setTimeout(() => {
      setShowLoadingText(true);
    }, 3000);

    // 2. Le message reste affiché pendant 3 secondes supplémentaires (soit au total 6 secondes avant le changement de phrase)
    const hideTimer = setTimeout(() => {
      setShowLoadingText(false);

      let chosenText = "";
      let chosenId = "";

      if (activeMode === "default") {
        const chosen = pickDefaultAffirmation(usedAffirmationIds);
        chosenText = chosen.text;
        chosenId = chosen.id;
      } else if (activeMode === "custom" && activeCustomCard) {
        const lines = activeCustomCard.text
          .split("\n")
          .map((l: string) => l.trim())
          .filter((l: string) => l.length > 0);

        const currentIndex = customIndex % lines.length;
        chosenText = lines[currentIndex];
        chosenId = `${activeCustomCard.id}_${currentIndex}`;

        const nextIndex = (currentIndex + 1) % lines.length;
        setCustomIndex(nextIndex);
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
    }, 6000); // 3 secondes d'attente + 3 secondes d'affichage du message de transition
  };

// --- Reconnaissance vocale 100% locale, gratuite et ultra-tolérante ---
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

    // Variable globale pour accumuler tout ce qui est dit pendant toute la session de l'affirmation
    let fullSessionTranscript = "";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let currentIntervalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentIntervalTranscript += event.results[i][0].transcript;
      }

      // On accumule au fil de l'eau pour ne jamais perdre ce qui a été dit
      fullSessionTranscript += " " + currentIntervalTranscript;

      // Nettoyage complet (suppression des symboles, puces, accents, mise en minuscules)
      const normalize = (str: string) => 
        str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[✓●•\*.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
          .trim();

      const spokenClean = normalize(fullSessionTranscript);
      const targetClean = normalize(textToMatch);

      const stopWords = new Set(["le", "la", "les", "un", "une", "des", "de", "du", "et", "à", "en", "que", "qui", "ce"]);
      const targetWords = targetClean.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
      const spokenWords = new Set(spokenClean.split(/\s+/));

      // 1. Correspondance directe globale
      const isDirectMatch = targetClean.includes(spokenClean) && spokenClean.length > 3;

      // 2. Calcul du ratio de mots-clés
      let matchedCount = 0;
      if (targetWords.length > 0) {
        targetWords.forEach(word => {
          if (spokenWords.has(word)) matchedCount++;
        });
      }
      const matchRatio = targetWords.length > 0 ? matchedCount / targetWords.length : 0;

      // 3. Vérification du premier ou du dernier mot significatif
      const cleanWords = targetClean.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
      const firstWord = cleanWords[0] || "";
      const lastWord = cleanWords[cleanWords.length - 1] || "";

      const spokenWordsArray = spokenClean.split(/\s+/);
      const hasFirstWord = firstWord && spokenWordsArray.includes(firstWord);
      const hasLastWord = lastWord && spokenWordsArray.includes(lastWord);

      // Validation immédiate dès qu'une condition de succès est remplie
      if (isDirectMatch || hasFirstWord || hasLastWord || (targetWords.length > 0 && matchRatio >= 0.45)) {
        recognition.onend = null;
        recognition.stop();
        genererAffirmationMiroir();
      }
    };

    // Relance automatique immédiate si le navigateur coupe l'écoute par inadvertance
    recognition.onend = () => {
      setIsListening(false);
      if (microActive && textToMatch) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore si l'instance est déjà active
        }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Erreur de démarrage de la reconnaissance vocale :", e);
    }
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
<div className="absolute left-[-380px] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-14">
  <div className="flex flex-col items-center text-center gap-10">
    <h1 className="text-3xl md:text-4xl font-serif font-light text-[#212121] tracking-wider whitespace-nowrap">
      Affirmation
    </h1>
    {activeMode === "custom" && activeCustomCard && (
      <h2 className="text-4xl font-semibold text-[#7F4DC5] italic">
        {activeCustomCard.title}
      </h2>
    )}
    {activeMode === "cycle" && (
      <h2 className="text-4xl font-semibold text-[#7F4DC5] italic">
        {currentPhase}
      </h2>
    )}
  </div>

  {/* Les 3 boutons de sélection de mode (changement de mode sans déclenchement automatique) */}
  <div className="flex w-[350px] h-[55px] bg-white border border-[#9b6fd9] rounded-[10px] overflow-hidden shadow-sm">
    <button 
      onClick={() => {
        setActiveMode("default");
        setAffirmation("");
        setCustomIndex(0);
        setIsPlaying(false);
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
        setAffirmation("");
        setCustomIndex(0);
        setIsPlaying(false);
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
        setAffirmation("");
        setCustomIndex(0);
        setIsPlaying(false);
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
                src="/image_Design-SOREA/miroir.svg"
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

                {/* Élément central cliquable avec bascule Play / Pause (indépendant du micro) */}
                <div className="flex-1 flex items-center justify-center">
                  <button 
                    onClick={togglePlayPause}
                    disabled={loading}
                    className="transition-transform duration-300 hover:scale-110 cursor-pointer disabled:opacity-40"
                    title={isPlaying ? "Pause" : "Commencer"}
                  >
                    <img
                      src={isPlaying ? "/image_icone/pause1.svg" : "/image_icone/play1.svg"}
                      alt={isPlaying ? "Pause" : "Lecture"}
                      className="w-20 h-20 object-contain"
                    />
                  </button>
                </div>

                {/* Bouton Suivant : actif dès que le jeu est en cours (isPlaying) */}
                <div className="w-full px-6 pb-4">
                  <button
                    onClick={genererAffirmationMiroir}
                    disabled={loading || !isPlaying}
                    className={`w-full bg-[#8B47FF] text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 text-center ${
                      !isPlaying ? "opacity-40 cursor" : "hover:scale-105 hover:shadow-xl cursor-pointer"
                    }`}
                    title={!isPlaying ? "Mettez lecture pour utiliser le bouton Suivant" : "Affirmation suivante"}
                  >
                    Suivant
                  </button>
                </div>

              </div>

              {/* Affirmation superposée sur le miroir (reste affichée pendant le chargement de la suivante) */}
              {affirmation && (
                <div
                  className="absolute z-20 text-center text-white text-sm font-medium rounded-[4px]"
                  style={{
                    width: "210px",
                    top: cameraActive ? "72%" : "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(33, 33, 33, 0.5)",
                    padding: "10px 25px",
                  }}
                >
                  {affirmation}
                </div>
              )}

              {/* Chargement indépendant positionné au centre du miroir */}
              {/* Chargement indépendant : n'apparaît qu'après 3 secondes grâce à showLoadingText */}
              {loading && showLoadingText && (
                <div
                  className="absolute z-30 text-center text-white text-sm font-semibold rounded-lg shadow-lg animate-pulse"
                  style={{
                    width: "190px",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(33, 33, 33, 0.8)",
                    padding: "10px 20px",
                  }}
                >
                  ✨ Une affirmation arrive...
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

            {/* Consigne sous le miroir */}
            {affirmation && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-[#8B47FF] rounded-full text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#8B47FF]"></span>
                {microActive 
                  ? (isListening ? "Répétez à haute voix pour passer à la suivante..." : "Micro en attente...")
                  : "Cliquez sur 'Suivant' pour passer à la phrase suivante"}
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

{/* MODALE DE CONSIGNES DU MIROIR */}
      {showInstruction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="w-full max-w-lg mx-4 p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 flex flex-col items-center relative animate-in zoom-in-95 duration-300">
            
            {instructionStep === 1 ? (
              <>
                <p className="text-center text-[#4b3b5c] text-xl font-bold mb-2">
                  Miroir mon beau miroir
                </p>
                <p className="text-gray-600 text-base mb-8 mt-3 text-center">
                  Affirme-toi chaque jour face à ton miroir virtuel. Répète des phrases positives à haute voix pour renforcer ta confiance et cultiver ta lumière intérieure.
                </p>
                
                <div className="flex w-full justify-center">
                  <button 
                    onClick={() => setInstructionStep(2)}
                    className="px-8 py-2.5 bg-[#8B47FF] text-white font-bold rounded-full hover:bg-[#7a3be6] transition-colors shadow-md text-sm cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-center text-[#4b3b5c] text-xl font-bold mb-2">
                  Comment jouer ?
                </p>
                <p className="text-gray-600 text-base mb-8 mt-3 text-center">
                  Cliquez sur <strong>Play</strong> pour démarrer l'expérience. Vous pouvez répeter vos affirmations grâce au <b>Micro intelligent</b> ou utiliser le bouton <b>Suivant</b> pour faire défiler vos reflets manuellement.
                </p>
                
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={hideInstructionsMirror}
                    className="px-8 py-2.5 bg-[#8B47FF] text-white font-bold rounded-full hover:bg-[#7a3be6] transition-colors shadow-md text-sm cursor-pointer"
                  >
                    OK
                  </button>
                  <button 
                    onClick={hideInstructionsMirror}
                    className="px-4 py-2.5 bg-transparent text-gray-400 font-medium hover:text-[#8B47FF] transition-colors text-sm underline underline-offset-2 cursor-pointer"
                  >
                    Ne plus afficher
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
  
}