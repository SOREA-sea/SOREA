"use client";

import { useEffect, useState } from "react";

// Taille de la maquette « Offre 7 jours abonnement.svg » : tout est positionné en pixels dans ce cadre,
// puis le cadre entier est réduit (jamais agrandi) pour tenir dans la fenêtre.
const LARGEUR = 1016;
const HAUTEUR = 1621;

const VIOLET = "#7F4DC5";

export default function OffreSeptJours() {
  const [echelle, setEchelle] = useState(1);

  useEffect(() => {
    const ajuster = () =>
      setEchelle(Math.min(1, (window.innerWidth - 32) / LARGEUR, (window.innerHeight - 32) / HAUTEUR));
    ajuster();
    window.addEventListener("resize", ajuster);
    return () => window.removeEventListener("resize", ajuster);
  }, []);

  // Empêche de faire défiler la page derrière la fenêtre
  useEffect(() => {
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Offre 7 jours"
    >
      <div style={{ width: LARGEUR * echelle, height: HAUTEUR * echelle }}>
        <div
          className="relative"
          style={{
            width: LARGEUR,
            height: HAUTEUR,
            transform: `scale(${echelle})`,
            transformOrigin: "top left",
            background: "#FAF5FF",
            borderRadius: 64,
            boxShadow: "inset -8px -10px 12px rgba(60, 60, 60, 0.35)",
            fontFamily: "var(--font-inria-sans), sans-serif",
          }}
        >
          {/* Logo SOREA (texte + petite lueur) */}
          <div
            className="absolute"
            style={{
              left: 140,
              top: 115,
              width: 110,
              height: 100,
              background: "radial-gradient(circle, rgba(190,170,255,0.45) 0%, rgba(250,245,255,0) 70%)",
            }}
          />
          <div
            className="absolute whitespace-nowrap"
            style={{ left: 105, top: 140, fontSize: 38, fontWeight: 300, letterSpacing: "0.5em", color: "#280267", lineHeight: "50px" }}
          >
            SOREA
          </div>

          {/* Titre */}
          <h2
            className="absolute text-center font-bold whitespace-nowrap"
            style={{ left: 0, width: 1032, top: 349, fontSize: 52, lineHeight: "61px", letterSpacing: "0.06em", color: VIOLET }}
          >
            Nous vous offrons
            <br />
            7 jours !
          </h2>

          {/* Bandeau */}
          <div
            className="absolute flex items-center justify-center text-center text-white whitespace-nowrap"
            style={{ left: 185, top: 518, width: 646, height: 110, background: "#BFA9FF", fontSize: 25, lineHeight: "30px", letterSpacing: "0.1em" }}
          >
            <p>
              Accédez à toutes les expériences et
              <br />
              découvrez comment SOREA peut prendre
              <br />
              soin de vous chaque jour.
            </p>
          </div>

          {/* Encadré en pointillés */}
          <div
            className="absolute"
            style={{ left: 121, top: 723, width: 462, height: 195, border: "2px dashed #A98BE8", background: "#FAF7FF" }}
          >
            {[
              { texte: "Accessibilité à tous les jeux", top: 41 },
              { texte: "Sans engagement", top: 83 },
              { texte: "Annulation à tout moment", top: 125 },
            ].map((ligne) => (
              <div key={ligne.texte} className="absolute flex items-center whitespace-nowrap" style={{ left: 35, top: ligne.top, height: 28 }}>
                <img src="/image_icone/LotusPuce.svg" alt="" style={{ width: 28, height: 28 }} />
                <span style={{ marginLeft: 21, fontSize: 20, letterSpacing: "0.1em", color: "#212121" }}>{ligne.texte}</span>
              </div>
            ))}
          </div>

          {/* Méduse */}
          <img
            src="/image_Design-SOREA/Jellyfish.svg"
            alt=""
            className="absolute"
            style={{ left: 622, top: 678, width: 240, height: 290, objectFit: "contain" }}
          />

          {/* Bouton rose (pas encore actif) */}
          <button
            type="button"
            className="absolute text-white font-bold"
            style={{
              left: 325,
              top: 987,
              width: 366,
              height: 88,
              borderRadius: 24,
              background: "#E055B0",
              boxShadow: "inset 0 -7px 4px rgba(120, 30, 90, 0.35), 0 3px 4px rgba(0,0,0,0.2)",
              fontSize: 30,
              letterSpacing: "0.06em",
              cursor: "default",
            }}
          >
            C’est parti !
          </button>

          {/* Paiement sécurisé */}
          <img
            src="/image_icone/ClosedPadlockG1.svg"
            alt=""
            className="absolute"
            style={{ left: 146, top: 1112, width: 22, height: 30, objectFit: "contain" }}
          />
          <div
            className="absolute whitespace-nowrap"
            style={{ left: 192, top: 1112, fontSize: 20, lineHeight: "30px", letterSpacing: "0.08em", color: "#7F6674" }}
          >
            Paiement sécurisé • Résiliation selon les conditions de l’offre
          </div>

          {/* Séparateur avec étoile */}
          <div className="absolute" style={{ left: 45, top: 1209, width: 405, borderTop: "2px dotted #8B47FF" }} />
          <div className="absolute" style={{ left: 568, top: 1209, width: 400, borderTop: "2px dotted #8B47FF" }} />
          <svg className="absolute" style={{ left: 477, top: 1179, width: 62, height: 62 }} viewBox="0 0 24 24" fill={VIOLET}>
            <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
          </svg>

          {/* Bouton violet (pas encore actif) */}
          <button
            type="button"
            className="absolute text-white font-bold"
            style={{
              left: 214,
              top: 1291,
              width: 588,
              height: 88,
              borderRadius: 24,
              background: VIOLET,
              boxShadow: "inset 0 -7px 4px rgba(40, 2, 103, 0.35), 0 3px 4px rgba(0,0,0,0.2)",
              fontSize: 30,
              letterSpacing: "0.06em",
              cursor: "default",
            }}
          >
            Choisir mon abonnement
          </button>

          {/* Tampon en bas */}
          <img
            src="/image_Design-SOREA/SubscriptionBuffer.svg"
            alt=""
            className="absolute"
            style={{ left: 378, top: 1422, width: 260, height: 90, objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}