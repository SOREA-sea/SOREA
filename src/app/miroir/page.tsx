"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import { pickAffirmation, Phase } from "@/lib/affirmations";
import { fetchCurrentPhase } from "@/lib/cyclePhase";

export default function NouvellePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(true);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const [microActive, setMicroActive] = useState(true);

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

  // --- Génère la prochaine affirmation localement (plus d'appel API/Gemini) ---
  const genererAffirmationMiroir = () => {
    const today = new Date().toISOString().split("T")[0];

    // Limites quotidiennes
    let maxLimit = 3; // Non-inscrit / non-connecté
    if (loggedUser) {
      maxLimit = hasSubscription ? 999 : 5; // Inscrit sans abonnement = 5 max
    }

    if (affirmationCount >= maxLimit) {
      alert(`Limite quotidienne atteinte ! Tu as utilisé tes ${maxLimit} reflets du jour. Reviens demain ! ✨`);
      return;
    }

    setLoading(true);

    // Petit délai de 3,5s avant que la phrase suivante n'apparaisse
    setTimeout(() => {
      const chosen = pickAffirmation(currentPhase, usedAffirmationIds);
      setAffirmation(chosen.text);

      const nextUsed = [...usedAffirmationIds, chosen.id];
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
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-[1440px] mx-auto px-[96px] flex flex-col items-center pt-[150px] pb-[24px]">
          <div className="w-full mb-6 flex flex-col items-start gap-2">
            <Link href="/challenge">
              <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF] relative z-10">
                ← Retour
              </button>
            </Link>

            {/* Bouton de test temporaire — à supprimer une fois la vraie détection backend branchée */}
            <button
              onClick={() => setBlockedByOtherDevice((prev) => !prev)}
              className="text-xs text-gray-400 underline"
            >
              [Test] Simuler blocage multi-appareils
            </button>

            {/* Renvoie vers la page d'abonnement dédiée au Miroir */}
            {!hasSubscription && (
              <Link href="/miroir/abonnement">
                <button className="flex items-center gap-2 bg-[#8B47FF] text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  ✨ Passer à l'abonnement illimité
                </button>
              </Link>
            )}
          </div>

          <div className="flex-grow flex flex-col items-center justify-center w-full min-h-[300px] gap-8 relative z-10">

            <div
              className={`relative flex justify-center items-center rounded-3xl transition-all duration-300 ${
                blockedByOtherDevice ? "ring-4 ring-red-500" : ""
              }`}
              style={{ width: "400px", height: "550px" }}
            >

              <img
                src="/image_icone/miroire.png"
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

              <button
                onClick={toggleMicro}
                className="absolute right-[-150px] top-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
              >
                <img
                  src={microActive ? "/image_icone/Micro_active.svg" : "/image_icone/Micro_desactive.svg"}
                  alt="Micro"
                  className="w-14 h-14"
                />
              </button>

              <button
                onClick={toggleCamera}
                className="absolute right-[-80px] top-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
              >
                <img
                  src={cameraActive ? "/image_icone/Camera_active.svg" : "/image_icone/Camera_desactive.svg"}
                  alt="Caméra"
                  className="w-14 h-14"
                />
              </button>

              {/* Quand le micro est désactivé, le bouton "Suivant" déclenche l'affirmation suivante */}
              {!microActive && (
                <button
                  onClick={genererAffirmationMiroir}
                  disabled={loading}
                  className="absolute bottom-[120px] right-[-115px] bg-[#8B47FF] text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Suivant"}
                </button>
              )}

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
                Cliquez sur "Suivant" pour voir votre premier reflet...
              </p>
            )}

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}