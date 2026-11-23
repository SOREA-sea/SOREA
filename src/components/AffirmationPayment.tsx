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
  isFavorite?: boolean;
}

interface AffirmationPaymentProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPaymentSuccess?: () => void;
  data?: AffirmationPaymentData;
}

// Mise en page calée sur le SVG « PaiementAffirmation » (1016 × 1238) : on écrit les mesures du SVG,
// elles sont converties pour que la modale garde les mêmes proportions à toutes les tailles
const px = (n: number) => `${(n / 10.16).toFixed(3)}cqw`;
const L = (x: number) => `${((x / 1016) * 100).toFixed(3)}%`;
const T = (y: number) => `${((y / 1238) * 100).toFixed(3)}%`;
const POLICE = "Inter, ui-sans-serif, system-ui, sans-serif";

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
      <div
        className="relative"
        style={{
          width: "min(560px, 100%, calc((100dvh - 2rem) * 0.8207))",
          aspectRatio: "1016 / 1238",
          containerType: "inline-size",
        }}
      >
      <div className="absolute inset-0 shadow-2xl overflow-hidden" style={{ background: "#FAF5FF", borderRadius: px(64), fontFamily: POLICE }}>
        
        {/* En-tête : Marque SOREA & Bouton Fermer */}
        {[0, 1, 2].map((i) => (
          <img
            key={i}
            src="/image_Design-SOREA/Logo-Lueur.png"
            alt=""
            aria-hidden="true"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="absolute pointer-events-none"
            style={{ left: L(153), top: T(12), width: px(166), height: px(160), objectFit: "contain" }}
          />
        ))}
        <img
          src="/image_Design-SOREA/Logo-SOREAMiniature.svg"
          alt="SOREA"
          className="absolute"
          style={{ left: L(147), top: T(78), width: px(179), height: px(29), objectFit: "contain" }}
        />
        <button
          onClick={onClose}
          type="button"
          className="absolute cursor-pointer flex items-center justify-center"
          style={{ left: L(884), top: T(63), width: px(46), height: px(45) }}
          aria-label="Fermer"
        >
          <img src="/image_icone/Cross.svg" alt="Fermer" className="w-full h-full object-contain" />
        </button>

                {/* Corps principal : Grille Image + Infos */}
        {/* Bloc Visuel Gauche (SVG / Image de l'Affirmation) */}
        <div
          className="absolute overflow-hidden"
          style={{ left: L(60), top: T(184), width: px(351), height: px(561), borderRadius: px(35) }}
        >
          <img src="/image_photo/MirrorDiamond.svg" alt="Miroir" className="w-full h-full object-cover" />
        </div>

        {/* Bloc Contenu Droit */}
        <div className="absolute flex flex-col items-start" style={{ left: L(456), top: T(184), width: px(471) }}>

          {/* Tag / Badge CATEGORIE */}
          <div className="flex items-center" style={{ gap: px(25), height: px(50) }}>
            <div
              className="flex items-center justify-center font-bold"
              style={{ width: px(235), height: px(50), borderRadius: "9999px", background: "#DBCEEF", color: "#7F4DC5", fontSize: px(30), letterSpacing: "0.07em" }}
            >
              Affirmation
            </div>
            {data.isFavorite && (
              <img
                src="/image_icone/FavoritesYes.svg"
                alt="Favori"
                style={{ width: px(22), height: px(21), objectFit: "contain" }}
              />
            )}
          </div>

          {/* Titre */}
          <h2
            className="font-bold text-black"
            style={{ marginTop: px(41), maxWidth: "100%", fontSize: px(50), lineHeight: px(60), letterSpacing: "0.07em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {data.title || "Titre de l'achat"}
          </h2>

          {/* Liste des citations / extraits (3 lignes visibles, une citation = une ligne, « … » si trop longue) */}
          <div className="w-full" style={{ marginTop: px(26), height: px(156), overflow: "hidden" }}>
            {quotesList.map((quote, idx) => (
              <div
                key={idx}
                className="w-full font-semibold italic truncate"
                style={{ height: px(52), lineHeight: px(52), color: "#7F4DC5", fontSize: px(30), letterSpacing: "0.07em" }}
              >
                {quote}
              </div>
            ))}
          </div>

          {/* Badge N+1 citations */}
          {data.totalQuotesCount && (
            <div
              className="flex items-center justify-center font-semibold"
              style={{ marginTop: px(34), marginLeft: px(102), width: px(299), height: px(58), background: "#FBFAFF", color: "#7F4DC5", fontSize: px(31), letterSpacing: "0.07em" }}
            >
              {data.totalQuotesCount} {data.totalQuotesCount > 1 ? "affirmations" : "affirmation"}
            </div>
          )}

          {/* Description du produit (hauteur fixe : défile si elle est plus longue) */}
          <p
            style={{
              marginTop: px(22),
              marginLeft: px(-2),
              width: px(473),
              height: px(154),
              boxSizing: "border-box",
              padding: `${px(4)} ${px(16)}`,
              background: "rgba(255,255,255,0.3)",
              color: "#4B4B4B",
              fontSize: px(19),
              lineHeight: px(24),
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 6,
            }}
          >
            {data.description}
          </p>
        </div>

        {/* Séparateur décoratif Ligne */}
        <img
          src="/image_Design-SOREA/DividingLinePurple.svg"
          alt="Ligne de séparation"
          className="absolute"
          style={{ left: L(35), top: T(819), width: px(922), transform: "translateY(-50%)" }}
        />

        {/* Prix */}
        <div
          className="absolute w-full text-center font-bold"
          style={{ left: 0, top: T(926), transform: "translateY(-50%)", color: "#7F4DC5", fontSize: px(50), lineHeight: 1, letterSpacing: "0.07em" }}
        >
          {displayPrice} €
        </div>

        {/* Bouton d'action / Paiement */}
        <button
          onClick={handleCheckout}
          type="button"
          className="absolute hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer font-semibold"
          style={{
            left: L(232.5),
            top: T(997),
            width: px(552),
            height: px(100),
            paddingBottom: px(6),
            borderRadius: px(25),
            background: "#E256B3",
            color: "#FBFAFF",
            fontSize: px(29.5),
            letterSpacing: "0.08em",
            boxShadow: `inset 0 -${px(9)} ${px(10.6)} #A84286, 0 ${px(3)} ${px(13.6)} rgba(0,0,0,0.13)`,
          }}
        >
          <span>Accéder à l'affirmation</span>
        </button>

        {/* Footer Sécurisé */}
        <div
          className="absolute flex items-center"
          style={{ left: L(346), top: T(1148), transform: "translateY(-50%)", gap: px(15) }}
        >
          <img src="/image_icone/ClosedPadlockG1.svg" alt="Cadenas" style={{ width: px(22), height: px(27), objectFit: "contain" }} />
          <span style={{ color: "#7F6674", fontSize: px(25.6), letterSpacing: "0.07em", lineHeight: 1 }}>
            Paiement sécurisé
          </span>
        </div>

        {/* Ombre intérieure du cadre (comme dans la maquette) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: px(64), boxShadow: `inset -${px(16)} -${px(20)} ${px(20)} rgba(0,0,0,0.25)` }}
        />

      </div>
      </div>
    </div>
  );
}