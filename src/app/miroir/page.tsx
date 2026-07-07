"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

export default function NouvellePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(true);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const [microActive, setMicroActive] = useState(true);

// --- Nouveaux états pour l'IA et les restrictions ---
  const [affirmation, setAffirmation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [affirmationCount, setAffirmationCount] = useState<number>(0);
  
  // Simulation de l'utilisateur (à remplacer par mes vrais states ou props globaux)
  const [loggedUser, setLoggedUser] = useState<any>({ name: "Test" }); // Mettre null pour tester le cas "non-inscrit"
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  // --- NOUVEAUX ÉTATS RECONNAISSANCE VOCALE ---
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // --- État pour la simulation du blocage multi-appareils (maquette, sans backend) ---
  const [blockedByOtherDevice, setBlockedByOtherDevice] = useState<boolean>(false);

    const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

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
  if (blockedByOtherDevice) return; // Bloqué si un autre appareil simule l'usage
  if (cameraActive) {
    stopCamera();
  } else {
    startCamera();
  }
};



const startMicro = async () => { /*Ajout des fonctions du micro*/
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

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
  if (recognitionRef.current) recognitionRef.current.stop(); //couper l'écoute si on éteint le micro manuellement
};

const toggleMicro = () => {
  if (blockedByOtherDevice) return; // Bloqué si un autre appareil simule l'usage
  if (microActive) {
    stopMicro();
  } else {
    startMicro();
  }
};

// Charger le compteur d'affirmations du jour au démarrage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem(`sorea_affirmations_${today}`);
    if (storedData) {
      setAffirmationCount(parseInt(storedData, 10));
    }
  }, []);

  // --- Fonction qui appelle Gemini ---
  const genererAffirmationMiroir = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Définition des limites quotidiennes
    let maxLimit = 3; // Limite d'utilisation pour l'Utilisateur déconnecté/non inscrit
    if (loggedUser) {
      maxLimit = hasSubscription ? 999 : 5; // Limite d'utilisation pour l'utilisateur inscrit mais sans l'abonnement = 5 max
    }

    if (affirmationCount >= maxLimit) {
      alert(`Limite quotidienne atteinte ! Tu as utilisé tes ${maxLimit} reflets du jour. Reviens demain ! ✨`);
      return;
    }

    setLoading(true);
    setAffirmation("");

    try {
      // Phase fictive passée en paramètre (sera dynamique selon ton calendrier plus tard)
      const phaseActuelle = "Printemps"; 
      
      const res = await fetch(`/api/miroir?phase=${phaseActuelle}`);
      const data = await res.json();
      
      if (data.affirmation) {
        setAffirmation(data.affirmation);
        
        // Mettre à jour et sauvegarder le compteur
        const nextCount = affirmationCount + 1;
        setAffirmationCount(nextCount);
        localStorage.setItem(`sorea_affirmations_${today}`, nextCount.toString());
      } else {
        setAffirmation("Une petite erreur est survenue, réessaye dans un instant.");
      }
    } catch (error) {
      console.error("Erreur API Miroir:", error);
      setAffirmation("Impossible de se connecter au Miroir pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fonctions de reconnaissance vocale automatique ---
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

    // Si l'utilisatrice a prononcé l'affirmation, on passe à la suite
    if (spokenText.length > 5 && (targetText.includes(spokenText) || spokenText.includes(targetText))) {
      recognition.onend = null;
      recognition.stop();
      genererAffirmationMiroir(); // Déclenche l'IA suivante !
    }
  };

  recognitionRef.current = recognition;
  recognition.start();
};

// Relancer l'écoute dès qu'une nouvelle affirmation arrive
useEffect(() => {
  if (affirmation && microActive) {
    const timer = setTimeout(() => {
      startSpeechRecognition(affirmation);
    }, 500);
    return () => clearTimeout(timer);
  }
}, [affirmation, microActive]);

useEffect(() => { //Dès que l'utilisatrice clique sur <Link href="/challenge ou n'importe quelle autre page du site, la caméra et le micro sont automatiquement coupés.">
  startCamera();
  startMicro();
  return () => {
    stopCamera();
    stopMicro();
  };
}, []);

useEffect(() => { //Si l'utilisatrice change d'onglet ou minimise la fenêtre, la caméra et le micro sont coupés automatiquement.
  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopCamera();
      stopMicro();
    }
  };

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };
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
                <div
                  className="relative flex justify-center items-center"
                      style={{ width: "400px", height: "550px" }}></div>
                                                      
              </div>

<button //Bouton du micro
  onClick={toggleMicro}
  className="absolute right-[-150px] top-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
>
  <img
    src={
      microActive
        ? "/image_icone/Micro_active.svg"
        : "/image_icone/Micro_desactive.svg"
    }
    alt="Micro"
    className="w-14 h-14"
  />
</button>

  <button //Bouton de la caméra
    onClick={toggleCamera}
    className="absolute right-[-80px] top-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
  >
    <img
      src={
        cameraActive
          ? "/image_icone/Camera_active.svg"
          : "/image_icone/Camera_desactive.svg"
      }
      alt="Caméra"
      className="w-14 h-14"
    />
  </button>

{/* Quand le micro est désactivé, le bouton "Suivant" appelle l'IA */}
  {!microActive && ( //Cette condition --> si le micro est désactivé, le bouton "suivant" s'affiche.
  <button
    onClick={genererAffirmationMiroir}
    disabled={loading}
    className="
      absolute
      bottom-[120px]
      right-[-115px] 

      bg-[#8B47FF]
      text-white
      font-bold

      px-8
      py-3

      rounded-2xl
      shadow-lg

      transition-all
      duration-300

      hover:scale-105
      hover:shadow-xl

      disabled:opacity-50 
    "
  >
    {loading ? "Chargement..." : "Suivant"}
  </button>
)}
            </div>

{/* Message d'explication quand le miroir est bloqué (maquette, sans vraie détection multi-appareils) */}
{blockedByOtherDevice && (
  <div className="max-w-[400px] text-center bg-red-50 border border-red-300 text-red-600 text-sm font-medium px-4 py-3 rounded-2xl">
    Ton miroir est déjà actif sur un autre appareil. Ferme-le là-bas pour l'activer ici.
  </div>
)}

 {/* --- Ajout de la consigne + texte genéré--- */}
{affirmation && (
  <div className="mt-4 max-w-[500px] flex flex-col items-center gap-3">
    {/* La consigne dynamique */}
    <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-[#8B47FF] rounded-full text-sm font-semibold animate-pulse">
      <span className="w-2 h-2 rounded-full bg-[#8B47FF]"></span>
      {isListening ? "Répétez à haute voix ce que vous voyez pour passer à la suivante..." : "Micro en attente..."}
    </div>

    {/* Ton bloc d'affirmation d'origine */}
    <div className="text-center p-6 bg-white border border-purple-200 rounded-2xl shadow-md">
      <p className="text-xl italic font-medium text-purple-900">"{affirmation}"</p>
      <span className="text-xs text-gray-400 block mt-3">
        Reflet généré ({affirmationCount} utilisé{affirmationCount > 1 ? 's' : ''} aujourd'hui)
      </span>
    </div>
  </div>
)}

{/* Petit message s'il n'y a pas encore d'affirmation */}
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