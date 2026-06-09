"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

export default function NouvellePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erreur d'accès à la caméra :", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative items-center">
      
      <div className="w-[1440px] px-[96px] mx-auto pb-[24px]">
        <Navbar />
      </div>

      <main className="flex flex-col flex-grow items-center mx-auto w-[1440px] pt-[150px] px-[96px] pb-[24px]">
        
        <div className="w-full mb-6">
          <Link href="/challenge">
            <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]">
              ← Retour
            </button>
          </Link>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] gap-8">
          
          <div className="relative flex justify-center items-center" style={{ width: "400px", height: "550px" }}>
            
            <img 
              src="/image_ambassadrice_svg/miroire.png" 
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
            </div>

          </div>
          
          
        </div>
      </main>

      <div className="w-[1440px] px-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}