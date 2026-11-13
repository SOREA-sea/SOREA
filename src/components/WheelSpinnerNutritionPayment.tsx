"use client";

import React from "react";

interface WheelSpinnerNutritionPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment?: () => void;
  itemId?: string | number;
}

export default function WheelSpinnerNutritionPayment({
  isOpen,
  onClose,
  onConfirmPayment,
  itemId,
}: WheelSpinnerNutritionPaymentProps) {
  if (!isOpen) return null;

  // Ajout de la fonction de redirection Stripe
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          title: "Défis Nutrition - Rejouer",
          price: "0.99",
          type: "nutrition",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[480px] rounded-[28px] px-8 py-5 shadow-2xl flex flex-col items-center text-center overflow-hidden border border-purple-100"
        style={{
          background: "linear-gradient(180deg, #FDF8FC 0%, #F7EFF9 100%)",
        }}
      >
        {/* Barre supérieure : Logo SOREA à gauche et Croix de fermeture à droite */}
        <div className="w-full flex items-center justify-between mb-6">
          <img
            src="/image_Design-SOREA/Logo-SOREAMiniature.svg"
            alt="SOREA"
            className="h-6 object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-100/60 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <img
              src="/image_icone/Cross.svg"
              alt="Fermer"
              className="w-5 h-5 object-contain"
            />
          </button>
        </div>

        {/* Badge NUTRITION */}
        <div className="bg-[#E9DDF8] text-[#7F4DC5] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4">
          NUTRITION
        </div>

        {/* Titre principal */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Envie de rejouer ?
        </h2>

        {/* Image centrale de la roue */}
        <div className="my-0 flex items-center justify-center">
          <img
            src="/image_Design-SOREA/image_Wheel-Spinner/WS_NutritionHead1.svg"
            alt="Roue Nutrition"
            className="w-32 h-32 object-contain drop-shadow-md"
          />
        </div>

        {/* Texte descriptif */}
        <div className="bg-white/60 rounded-xl px-4 py-2 mt-1 mb-2 border border-purple-100/60">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Relance la roue et découvre un nouveau défi pour nourrir ton équilibre au quotidien.
          </p>
        </div>

        {/* Ligne séparatrice avec étoile */}
        <div className="w-full flex items-center justify-center my-2">
          <img
            src="/image_Design-SOREA/DividingLine.svg"
            alt="Séparateur"
            className="w-full max-w-[340px] object-contain"
          />
        </div>

        {/* Prix fixe */}
        <div className="text-2xl font-bold text-[#7F4DC5] my-4">
          0.99 €
        </div>

        {/* Bouton d'action principal */}
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full max-w-[497px] py-4 rounded-[25px] text-white font-bold text-base hover:opacity-95 hover:-translate-y-0.5 transition-all cursor-pointer"
          style={{
            backgroundColor: "var(--color-SOREA-R1, #D942A6)",
            boxShadow: "0px 3px 13.6px rgba(0, 0, 0, 0.13), inset 0px -9px 10.6px #A84286",
          }}
        >
          Rejouer maintenant
        </button>

        {/* Mention Paiement sécurisé avec cadenas */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 font-medium">
          <img
            src="/image_icone/ClosedPadlockG1.svg"
            alt="Sécurisé"
            className="w-3.5 h-3.5 object-contain"
          />
          <span>Paiement sécurisé</span>
        </div>
      </div>
    </div>
  );
}