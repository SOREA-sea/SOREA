"use client";

import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

export default function MiroirAbonnementPage() {
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
        <div className="w-full max-w-[600px] mx-auto px-6 flex flex-col items-center pt-[100px] pb-[48px] gap-8">

          <Link href="/miroir">
            <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]">
              ← Retour au Miroir
            </button>
          </Link>

          <div className="text-center flex flex-col items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Débloque ton Miroir en illimité</h1>
            <p className="text-gray-500 max-w-[420px]">
              Avec l'abonnement SOREA, ton Miroir n'a plus de limite quotidienne
              d'affirmations et t'accompagne à chaque phase de ton cycle.
            </p>
          </div>

          <div className="w-full rounded-3xl bg-white border border-purple-200 shadow-sm p-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#8B47FF] text-xl">✓</span>
              <span className="text-gray-700">Affirmations illimitées, chaque jour</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#8B47FF] text-xl">✓</span>
              <span className="text-gray-700">Contenu adapté à chaque phase de ton cycle</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#8B47FF] text-xl">✓</span>
              <span className="text-gray-700">Accès à l'ensemble des fonctionnalités premium SOREA</span>
            </div>
          </div>

          <button
            onClick={() => alert("Étape de paiement à connecter — pour l'instant ce bouton est une maquette fonctionnelle.")}
            className="bg-[#8B47FF] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Je m'abonne
          </button>

          <p className="text-xs text-gray-400 text-center max-w-[320px]">
            Sans engagement, résiliable à tout moment.
          </p>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}