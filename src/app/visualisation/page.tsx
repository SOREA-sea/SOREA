"use client";

import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Visualisation from "@/components/visualisation";

export default function VisualisationPage() {
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
          
          <div className="w-full mb-10">
            <Link href="/challenge">
              <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF] relative z-10">
                ← Retour.
              </button>
            </Link>
          </div>
          
          {/* IMPORT DU COMPOSANT ICI */}
          <div className="w-full flex-grow flex flex-col items-center relative z-10">
            <Visualisation />
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
      
    </div>
  );
}