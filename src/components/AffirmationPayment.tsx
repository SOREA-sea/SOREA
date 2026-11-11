"use client";

import React from "react";
import { Lock, Check } from "lucide-react";

export interface AffirmationPaymentData {
  id?: string;
  title?: string;
  quotes?: string[];
  totalQuotesCount?: number;
  description?: string;
  price?: number | string;
  imageUrl?: string;
}

interface AffirmationPaymentProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPaymentSuccess?: () => void;
  data?: AffirmationPaymentData;
}

export default function AffirmationPayment({
  isOpen = true,
  onClose,
  onPaymentSuccess,
  data = {
    title: "Titre de l'achat",
    quotes: ["Citation 1", "Citation 2..."],
    totalQuotesCount: 3,
    description:
      "Un duo d'affirmations puissantes pour renforcer votre confiance en vous et célébrer votre beauté intérieure.",
    price: "0.95",
  },
}: AffirmationPaymentProps) {
  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          price: data.price,
          type: "affirmation",
        }),
      });

      const { url, error } = await response.json();
      if (error) {
        alert("Erreur : " + error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Erreur réseau", err);
    }
  };

  const quotesList = data.quotes || ["Citation 1", "Citation 2..."];
  const displayPrice = typeof data.price === "number" ? data.price.toFixed(2) : data.price || "0.95";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      {/* Conteneur principal de la modale */}
      <div className="relative w-full max-w-[500px] bg-[#FAF5FF] rounded-[64px] shadow-2xl border border-purple-100 p-8 flex flex-col items-center">
        
        {/* En-tête : Marque SOREA & Bouton Fermer */}
        <div className="w-full flex items-center justify-between mb-6">
          <img src="/image_Design-SOREA/Logo-SOREAMiniature.svg" alt="SOREA" className="h-6 object-contain" />
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-purple-100/50 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Fermer"
          >
            <img src="/image_icone/Cross.svg" alt="Fermer" className="w-6 h-6 object-contain" />
          </button>
        </div>

        {/* Corps principal : Grille Image + Infos */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 items-start mb-6">
          
          {/* Bloc Visuel Gauche (SVG / Image de l'Affirmation) */}
          <div className="relative w-full aspect-square rounded-2xl bg-[#E8DCF8]/60 overflow-hidden flex items-center justify-center p-2 shadow-inner">
              <img src="/image_photo/MirrorDiamond.svg" alt="Fermer" className="w-full h-full object-contain"/>
          </div>

          {/* Bloc Contenu Droit */}
          <div className="flex flex-col items-start gap-3">
            
            {/* Tag / Badge CATEGORIE */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D7F8] text-[#8B47FF] text-xs font-bold">
              <span>Affirmation</span>
              <span className="text-[10px]">★</span>
            </div>

            {/* Titre */}
            <h2 className="text-xl font-bold text-[#1F1F1F] leading-tight">
              {data.title || "Titre de l'achat"}
            </h2>

            {/* Liste des citations / extraits */}
            <div className="flex flex-col gap-1.5 w-full my-1">
              {quotesList.map((quote, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs font-medium text-[#8B47FF] italic">
                  <Check size={14} className="stroke-[2.5]" />
                  <span className="truncate">{quote}</span>
                </div>
              ))}
            </div>

            {/* Badge N+1 citations */}
            {data.totalQuotesCount && (
              <div className="self-end px-3 py-1 rounded-full bg-white border border-purple-100 shadow-xs text-[11px] font-bold text-[#8B47FF]">
                {data.totalQuotesCount - quotesList.length > 0 ? data.totalQuotesCount - quotesList.length : 1} 
                citations
              </div>
            )}

            {/* Description du produit */}
            <p className="text-[11px] leading-relaxed text-gray-500 font-normal">
              {data.description}
            </p>
          </div>
        </div>

        {/* Séparateur décoratif Ligne */}
        <div className="w-full flex items-center justify-center my-2">
          <img src="/image_Design-SOREA/DividingLine.svg" alt="Ligne de séparation" className="w-full object-contain" />
        </div>

        {/* Prix */}
        <div className="my-4 text-center">
          <span className="text-xl font-semibold text-[#8B47FF]">
            {displayPrice} €
          </span>
        </div>

        {/* Bouton d'action / Paiement */}
        <button
          onClick={handleCheckout}
          type="button"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r bg-[#E256B3] hover:opacity-95 active:scale-[0.99] transition-all shadow-md hover:shadow-lg text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Accéder à l'affirmation</span>
        </button>

        {/* Footer Sécurisé */}
        <div className="mt-4 flex items-center gap-1.5">
          <img src="/image_icone/ClosedPadlockG1.svg" alt="Cadenas" className="w-4 h-4 object-contain" />
          <span className="text-[25px] text-[#7F6674] font-medium tracking-wide">
            Paiement sécurisé
          </span>
        </div>

      </div>
    </div>
  );
}