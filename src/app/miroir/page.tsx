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
};

const toggleMicro = () => {
  if (microActive) {
    stopMicro();
  } else {
    startMicro();
  }
};

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
          <div className="w-full mb-6">
            <Link href="/challenge">
              <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF] relative z-10">
                ← Retour
              </button>
            </Link>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center w-full min-h-[300px] gap-8 relative z-10">
            
            <div className="relative flex justify-center items-center" style={{ width: "400px", height: "550px" }}>
              
              <img 
                src="/image_mirror/miroire.png" 
                alt="Cadre du miroir" 
                className="absolute z-0 w-full h-full object-contain pointer-events-none"
              />

              <div 
                className="absolute z-10 overflow-hidden bg-black"
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
        ? "/image_mirror/Micro_active.svg"
        : "/image_mirror/Micro_desactive.svg"
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
          ? "/image_mirror/Camera_active.svg"
          : "/image_mirror/Camera_desactive.svg"
      }
      alt="Caméra"
      className="w-14 h-14"
    />
  </button>
  {!microActive && ( //Cette condition --> si le micro est désactivé, le bouton "suivant" s'affiche.
  <button
    onClick={() => console.log("Étape suivante")}
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
    "
  >
    Suivant
  </button>
)}
            </div>
            
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}