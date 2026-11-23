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
  isFavorite?: boolean;
  images?: (string | { url: string; transform?: { scale: number; x: number; y: number } })[];
}

interface VisualisationPaymentProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPaymentSuccess?: () => void;
  data?: VisualisationPaymentData;
}

// Mise en page calée sur le SVG « PaiementVisualisation » (1016 × 1547) : on écrit les mesures du SVG,
// elles sont converties pour que la modale garde les mêmes proportions à toutes les tailles
const px = (n: number) => `${(n / 10.16).toFixed(3)}cqw`;
const L = (x: number) => `${((x / 1016) * 100).toFixed(3)}%`;
const T = (y: number) => `${((y / 1547) * 100).toFixed(3)}%`;
const POLICE = "Inter, ui-sans-serif, system-ui, sans-serif";

// ✏️ RÉGLAGES DES 3 IMAGES SUR LA PELLICULE
// Les valeurs sont en unités du SVG : le bloc de la pellicule fait 706 de large sur 350 de haut.
// x : plus grand = l'image va vers la droite | y : plus grand = l'image descend
// largeur / hauteur : taille de l'image complète
// visible : largeur réellement affichée (plus petite que « largeur » = l'image est coupée sur sa droite)
const CADRES_PELLICULE = [
  { x: 57, y: 43, largeur: 207, hauteur: 208, visible: 207 },
  { x: 282, y: 43, largeur: 207, hauteur: 208, visible: 207 },
  { x: 510, y: 43, largeur: 207, hauteur: 208, visible: 114 },
];

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

  const texteDescription =
    data.description ||
    "Une parenthèse en images pour conserver les instants qui vous font du bien et célébrer votre équilibre au quotidien.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      {/* Conteneur principal de la modale */}
      <div
        className="relative"
        style={{
          width: "min(560px, 100%, calc((100dvh - 2rem) * 0.6568))",
          aspectRatio: "1016 / 1547",
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
            style={{ left: L(124), top: T(65), width: px(166), height: px(160), objectFit: "contain" }}
          />
        ))}
        <img
          src="/image_Design-SOREA/Logo-SOREAMiniature.svg"
          alt="SOREA"
          className="absolute"
          style={{ left: L(118), top: T(131), width: px(179), height: px(29), objectFit: "contain" }}
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

        {/* Tag / Badge CATEGORIE */}
        <div
          className="absolute flex items-center justify-center font-bold"
          style={{ left: L(355), top: T(233), width: px(248), height: px(50), borderRadius: "9999px", background: "#DBCEEF", color: "#7F4DC5", fontSize: px(30), letterSpacing: "0.07em" }}
        >
          Visualisation
        </div>
        {data.isFavorite && (
          <img
            src="/image_icone/FavoritesYes.svg"
            alt="Favori"
            className="absolute"
            style={{ left: L(627), top: T(247), width: px(22), height: px(21), objectFit: "contain" }}
          />
        )}

        {/* Titre de l'achat */}
        <h2
          className="absolute font-bold text-black text-center"
          style={{ left: L(90), top: T(324), width: px(780), margin: 0, fontSize: px(50), lineHeight: px(60), letterSpacing: "0.07em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {data.title || "Titre de l'achat"}
        </h2>

        {/* Bloc Visuel de la Pellicule : le SVG, puis les 3 premières images posées sur les 3 cadres */}
        <div
          className="absolute"
          style={{ left: L(152), top: T(444), width: px(706), height: px(350) }}
        >
          <img
            src="/image_Design-SOREA/PelliculeTest.svg"
            alt={data.title || "Pellicule de Visualisation"}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: `drop-shadow(${px(35)} ${px(50)} ${px(20)} rgba(0,0,0,0.25))`,
            }}
          />
          {[0, 1, 2].map((i) => {
            const photo = data.images?.[i];
            if (!photo) return null;
            const urlPhoto = typeof photo === "string" ? photo : photo.url;
            const zoom = typeof photo === "string" ? 1 : photo.transform?.scale ?? 1;
            return (
              <div
                key={i}
                className="absolute overflow-hidden"
                style={{
                  left: px(CADRES_PELLICULE[i].x),
                  top: px(CADRES_PELLICULE[i].y),
                  width: px(CADRES_PELLICULE[i].visible),
                  height: px(CADRES_PELLICULE[i].hauteur),
                }}
              >
                {/* La 3e image garde la taille d'un cadre complet : le bord de la pellicule la coupe */}
                <img
                  src={urlPhoto}
                  alt=""
                  style={{
                    width: px(CADRES_PELLICULE[i].largeur),
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${zoom})`,
                    transformOrigin: "center",
                    display: "block",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Badge N+1 images */}
        <div
          className="absolute flex items-center justify-center font-semibold"
          style={{ left: L(371), top: T(855), width: px(299), height: px(58), background: "#FBFAFF", color: "#7F4DC5", fontSize: px(31), letterSpacing: "0.07em" }}
        >
          {data.imagesCount ?? 0} {(data.imagesCount ?? 0) > 1 ? "images" : "image"}
        </div>

        {/* Description du produit (hauteur fixe, 4 lignes maximum) */}
        <div
          className="absolute flex items-center justify-center"
          style={{ left: L(181), top: T(928), width: px(679), height: px(122), boxSizing: "border-box", padding: `0 ${px(24)}`, background: "#F7F1FB" }}
        >
          <p
            className="w-full text-center"
            style={{
              margin: 0,
              color: "#4B4B4B",
              fontSize: px(22.5),
              lineHeight: px(texteDescription.length > 110 ? 30 : 40),
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
              textWrap: "balance",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 4,
            } as React.CSSProperties}
          >
            {texteDescription}
          </p>
        </div>

        {/* Séparateur décoratif Étoile */}
        <img
          src="/image_Design-SOREA/DividingLinePurple.svg"
          alt="Ligne de séparation"
          className="absolute"
          style={{ left: L(47), top: T(1099), width: px(922), transform: "translateY(-50%)" }}
        />

        {/* Prix */}
        <div
          className="absolute w-full text-center font-bold"
          style={{ left: 0, top: T(1208), transform: "translateY(-50%)", paddingLeft: px(25), boxSizing: "border-box", color: "#7F4DC5", fontSize: px(50), lineHeight: 1, letterSpacing: "0.07em" }}
        >
          {displayPrice} €
        </div>

        {/* Bouton d'action / Paiement */}
        <button
          onClick={handleCheckout}
          type="button"
          className="absolute hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer font-semibold"
          style={{
            left: L(243.5),
            top: T(1277),
            width: px(554),
            height: px(88),
            paddingTop: px(6),
            boxSizing: "border-box",
            borderRadius: px(25),
            background: "#E256B3",
            color: "#FBFAFF",
            fontSize: px(29.5),
            letterSpacing: "0.08em",
            boxShadow: `inset 0 -${px(9)} ${px(10.6)} #A84286, 0 ${px(3)} ${px(13.6)} rgba(0,0,0,0.13)`,
          }}
        >
          <span>Débloquer ma pellicule</span>
        </button>

        {/* Footer Sécurisé */}
        <div
          className="absolute flex items-center"
          style={{ left: L(347), top: T(1427), transform: "translateY(-50%)", gap: px(26) }}
        >
          <img src="/image_icone/ClosedPadlockG1.svg" alt="Cadenas" style={{ width: px(21), height: px(29), objectFit: "contain" }} />
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
