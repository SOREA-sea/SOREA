"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
/*import StreakTracker from "../../components/StreakTracker";*/
import MenstrualCalendar from "../../components/MenstrualCalendar";
import { notFound } from 'next/navigation';
import AuthRequiredModal from "@/components/AuthRequiredModal";

 
export default function MyPage() {
  const [estConnecte, setEstConnecte] = useState<boolean | null>(null); // null = vérification en cours
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Même vérification que la Navbar : /api/auth/me
  useEffect(() => {
    let annule = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data.user ?? null;
      })
      .then((user) => {
        if (!annule) setEstConnecte(!!user);
      })
      .catch(() => {
        if (!annule) setEstConnecte(false);
      });
    return () => {
      annule = true;
    };
  }, []);

  // Toute action dans le calendrier : sans connexion confirmée, on l'annule et on affiche la fenêtre
  const bloquerSiNonConnecte = (e: React.SyntheticEvent) => {
    if (estConnecte !== true) {
      e.preventDefault();
      e.stopPropagation();
      setShowAuthModal(true);
    }
  };
  return (
    <div
      className="relative min-h-screen flex flex-col text-gray-800 overflow-x-hidden"
    >
      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px] gap-[50px] pt-8">
        <Navbar />
      </div>

   {/* <section className="w-full flex justify-center">
        <StreakTracker />
      </section>*/}

      <section className="w-full flex justify-center py-14">
        {/* className="contents" : ce bloc ne change pas la mise en page, il sert seulement à intercepter les clics */}
        <div
          style={{ display: "contents" }}
          onClickCapture={bloquerSiNonConnecte}
          onKeyDownCapture={(e) => {
            if (e.key !== "Tab") bloquerSiNonConnecte(e);
          }}
        >
          <MenstrualCalendar />
        </div>
      </section>

      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>

      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}