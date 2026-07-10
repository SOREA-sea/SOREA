"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import { pickAffirmation, Phase } from "@/lib/affirmations";
import { fetchCurrentPhase } from "@/lib/cyclePhase";

export default function NouvellePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const [microActive, setMicroActive] = useState(true);

  // --- Le miroir ne démarre plus automatiquement : il faut cliquer sur "Activer mon miroir" ---
  const [mirrorActive, setMirrorActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

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

  // Limite quotidienne selon le statut de l'utilisatrice
  const maxLimit = loggedUser ? (hasSubscription ? 999 : 5) : 3;

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

  // Toggle du switch "Micro activé"
  const toggleMicro = () => {
    if (blockedByOtherDevice) return;
    if (microActive) {
      stopMicro();
    } else {
      startMicro();
    }
  };

  // --- Génère la prochaine affirmation localement (plus d'appel API/Gemini) ---
  const genererAffirmationMiroir = () => {
    const today = new Date().toISOString().split("T")[0];

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

  // --- Active le miroir : démarre caméra + micro et génère le premier reflet ---
  const activerMiroir = async () => {
    if (blockedByOtherDevice) return;
    setMirrorActive(true);
    setIsPaused(false);
    await startCamera();
    if (microActive) await startMicro();
    genererAffirmationMiroir();
  };

  // --- Coupe tout et revient à l'écran d'accueil du miroir ---
  const arreterMiroir = () => {
    stopCamera();
    stopMicro();
    setMirrorActive(false);
    setIsPaused(false);
    setAffirmation("");
    if (recognitionRef.current) recognitionRef.current.abort();
  };

  // --- Pause / reprise du cycle d'écoute (la caméra reste active) ---
  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      if (affirmation && microActive) startSpeechRecognition(affirmation);
    } else {
      setIsPaused(true);
      if (recognitionRef.current) recognitionRef.current.stop();
    }
  };

  // --- Reconnaissance vocale automatique (mode "perroquet") ---
  const startSpeechRecognition = (textToMatch: string) => {
    if (!microActive || !textToMatch || isPaused) return;

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

  // Relance l'écoute dès qu'une nouvelle affirmation arrive (si pas en pause)
  useEffect(() => {
    if (affirmation && microActive && !isPaused && mirrorActive) {
      const timer = setTimeout(() => {
        startSpeechRecognition(affirmation);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [affirmation, microActive, isPaused, mirrorActive]);

  // Coupe caméra/micro si l'utilisatrice quitte la page
  useEffect(() => {
    return () => {
      stopCamera();
      stopMicro();
    };
  }, []);

  // Coupe caméra/micro si l'utilisatrice change d'onglet ou minimise la fenêtre
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && mirrorActive) {
        stopCamera();
        stopMicro();
        setMirrorActive(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [mirrorActive]);

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
        <div className="w-full max-w-[600px] mx-auto px-6 flex flex-col items-center pt-[80px] pb-[48px]">

          {/* --- En-tête : titre + accroche + bouton d'activation --- */}
          {!mirrorActive && (
            <div className="w-full text-center flex flex-col items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Le Miroir</h1>
              <p className="text-gray-500 max-w-[320px]">
                Regarde-toi, répète l'affirmation du jour à voix haute, et laisse-la s'ancrer en toi.
              </p>
              <button
                onClick={activerMiroir}
                disabled={blockedByOtherDevice}
                className="bg-[#4B4B4B] text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50"
              >
                Activer mon miroir
              </button>

              {/* Bouton de test temporaire — à supprimer une fois la vraie détection backend branchée */}
              <button
                onClick={() => setBlockedByOtherDevice((prev) => !prev)}
                className="text-xs text-gray-400 underline"
              >
                [Test] Simuler blocage multi-appareils
              </button>
            </div>
          )}

          {mirrorActive && (
            <div className="w-full border-t border-dashed border-purple-200 pt-6 mb-4" />
          )}

          {/* Message quand le miroir est bloqué (maquette, sans vraie détection multi-appareils) */}
          {blockedByOtherDevice && (
            <div className="max-w-[400px] text-center bg-red-50 border border-red-300 text-red-600 text-sm font-medium px-4 py-3 rounded-2xl mb-4">
              Ton miroir est déjà actif sur un autre appareil. Ferme-le là-bas pour l'activer ici.
            </div>
          )}

          {mirrorActive && (
            <div className="w-full flex flex-col items-center gap-4">

              {/* --- Badge caméra active --- */}
              <div className="w-full flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white">
                <span className={`w-2.5 h-2.5 rounded-full ${cameraActive ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-sm font-medium text-gray-700">
                  {cameraActive ? "Caméra active" : "Caméra désactivée"}
                </span>
              </div>

              {/* --- Carte du miroir --- */}
              <div
                className={`w-full rounded-3xl bg-gray-100 p-6 flex flex-col items-center gap-4 transition-all duration-300 ${
                  blockedByOtherDevice ? "ring-4 ring-red-500" : ""
                }`}
              >
                {/* Affirmation au-dessus du miroir */}
                <div className="min-h-[48px] flex items-center justify-center px-4">
                  {affirmation ? (
                    <p className="text-center text-gray-800 font-medium italic">"{affirmation}"</p>
                  ) : (
                    <p className="text-center text-gray-400 text-sm italic">
                      {loading ? "Ton reflet arrive..." : "Ton affirmation apparaîtra ici."}
                    </p>
                  )}
                </div>

                {/* Miroir + caméra */}
                <div
                  className="relative flex justify-center items-center"
                  style={{ width: "260px", height: "357px" }}
                >
                  <img
                    src="/image_icone/miroire.png"
                    alt="Cadre du miroir"
                    className="absolute z-0 w-full h-full object-contain pointer-events-none"
                  />
                  <div
                    className="absolute z-10 overflow-hidden"
                    style={{
                      width: "132px",
                      height: "175px",
                      borderRadius: "50%",
                      top: "48%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      marginTop: "8px"
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
                </div>

                {/* Compteur + consigne */}
                <p className="text-sm text-gray-500 text-center">
                  Affirmation {affirmationCount} / {maxLimit === 999 ? "∞" : maxLimit}
                  {" · "}
                  {microActive
                    ? (isPaused ? "en pause" : (isListening ? "répète à voix haute pour continuer" : "micro en attente..."))
                    : "clique sur \"Suivant\" pour continuer"}
                </p>

                {/* Boutons de contrôle */}
                <div className="flex items-center gap-4">
                  {microActive ? (
                    <button
                      onClick={togglePause}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2b2b2b] text-white transition-transform duration-200 hover:scale-105"
                      aria-label={isPaused ? "Reprendre" : "Mettre en pause"}
                    >
                      {isPaused ? "▶" : "❚❚"}
                    </button>
                  ) : (
                    <button
                      onClick={genererAffirmationMiroir}
                      disabled={loading}
                      className="px-5 h-10 flex items-center justify-center rounded-full bg-[#8B47FF] text-white text-sm font-semibold transition-transform duration-200 hover:scale-105 disabled:opacity-50"
                    >
                      {loading ? "..." : "Suivant"}
                    </button>
                  )}

                  <button
                    onClick={arreterMiroir}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2b2b2b] text-white transition-transform duration-200 hover:scale-105"
                    aria-label="Arrêter le miroir"
                  >
                    ✕
                  </button>
                </div>

                {/* Switch micro */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span className="text-sm text-gray-600">Micro activé</span>
                  <span className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={microActive}
                      onChange={toggleMicro}
                      className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-gray-300 peer-checked:bg-emerald-500 transition-colors duration-200" />
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>

              {/* Mention de protection des données */}
              <p className="text-xs text-gray-400 text-center max-w-[320px]">
                🔒 Ta caméra sert uniquement à t'afficher en direct dans le miroir. Rien n'est enregistré ni partagé.
              </p>
            </div>
          )}

          {/* --- Pied de page --- */}
          <div className="w-full mt-8 rounded-3xl bg-gray-100 p-6 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-gray-500 max-w-[320px]">
              Continue ton parcours ou reviens plus tard pour un nouveau reflet.
            </p>
            <Link href="/challenge">
              <button className="bg-[#4B4B4B] text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Retour au Challenge
              </button>
            </Link>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}