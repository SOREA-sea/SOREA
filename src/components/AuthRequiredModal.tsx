"use client";

import Link from "next/link";
import { useEffect } from "react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fenêtre affichée quand un visiteur non connecté clique sur un outil bien-être
export default function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  // Fermeture avec la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-required-title"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#FAF5FF] border border-purple-200 shadow-2xl p-8 flex flex-col items-center text-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-purple-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="auth-required-title" className="text-2xl font-bold text-black tracking-[0.06em] pt-2">
          Connecte-toi pour continuer
        </h2>
        <p className="text-[#4b3b5c] leading-relaxed">
          Pour utiliser les outils bien-être de SOREA, tu dois d&apos;abord te connecter ou créer ton compte.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Link
            href="/login"
            className="flex-1 text-center bg-[#7F4DC5] text-white font-bold px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity"
          >
            Se connecter
          </Link>
          <Link
            href="/login?tab=inscription"
            className="flex-1 text-center bg-white text-[#7F4DC5] font-bold px-6 py-3 rounded-xl border-2 border-[#7F4DC5] hover:bg-[#F4EBFF] transition-colors"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}