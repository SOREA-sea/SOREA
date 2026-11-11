"use client";

import React from "react";
import { X, Lock } from "lucide-react";

export interface VisualisationPaymentData {
  id?: string;
  title?: string;
  imagesCount?: number;
  description?: string;
  price?: number | string;
  imageUrl?: string;
}

interface VisualisationPaymentProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPaymentSuccess?: () => void;
  data?: VisualisationPaymentData;
}

export default function VisualisationPayment({
  isOpen = true,
  onClose,
  onPaymentSuccess,
  data = {
    title: "Titre de l'achat",
    imagesCount: 3,
    description:
      "Une parenthèse en images pour conserver les instants qui vous font du bien et célébrer votre équilibre au quotidien.",
    price: "0.95",
  },
}: VisualisationPaymentProps) {
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
          type: "visualisation",
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

  const displayPrice =
    typeof data.price === "number"
      ? data.price.toFixed(2)
      : data.price || "0.95";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      {/* Conteneur principal de la modale */}
      <div className="relative w-full max-w-[480px] bg-[#FAF5FF] rounded-[32px] shadow-2xl border border-purple-100 p-8 flex flex-col items-center">
        {/* En-tête : Marque SOREA & Bouton Fermer */}
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-sm font-semibold tracking-[0.3em] text-[#333333] uppercase">
            S O R E A
          </span>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-purple-100/50 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tag / Badge CATEGORIE */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#E5D7F8] text-[#8B47FF] text-xs font-bold mb-3">
          <span>Visualisation</span>
          <span className="text-[10px]">★</span>
        </div>

        {/* Titre de l'achat */}
        <h2 className="text-2xl font-bold text-[#1F1F1F] text-center mb-6">
          {data.title || "Titre de l'achat"}
        </h2>

        {/* Bloc Visuel de la Pellicule (SVG / Image) */}
        <div className="relative w-[320px] h-[180px] aspect-[16/9] rounded-2xl bg-[#FAF5FF] flex items-center justify-center p-2 mb-4">
          <img
            src="/image_Design-SOREA/PelliculeTest.svg"
            alt={data.title || "Pellicule de Visualisation"}
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>

        {/* Badge N+1 images */}
        <div className="px-4 py-1 rounded-full bg-white border border-purple-100 shadow-xs text-xs font-bold text-[#8B47FF] mb-4">
          {data.imagesCount && data.imagesCount > 0
            ? data.imagesCount - 2 > 0
              ? data.imagesCount - 2
              : 1
            : 1}{" "}
          images
        </div>

        {/* Description du produit */}
        <p className="text-xs text-center leading-relaxed text-gray-500 max-w-[360px] mb-4 font-normal">
          {data.description ||
            "Une parenthèse en images pour conserver les instants qui vous font du bien et célébrer votre équilibre au quotidien."}
        </p>

        {/* Séparateur décoratif Étoile */}
        <div className="w-full flex items-center justify-center gap-4 my-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
          <svg
            className="w-5 h-5 text-[#8B47FF] fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
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
          className="w-full py-4 px-6 rounded-2xl bg-[#E256B3] hover:bg-[#d647a5] active:scale-[0.99] transition-all shadow-md hover:shadow-lg text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Débloquer ma pellicule</span>
        </button>

        {/* Footer Sécurisé */}
        <span className="mt-4 text-[11px] text-gray-400 font-medium tracking-wide">
          Paiement sécurisé
        </span>
      </div>
    </div>
  );
}
