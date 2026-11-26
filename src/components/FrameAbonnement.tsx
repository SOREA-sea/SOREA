"use client";

import { useEffect, useState } from "react";

// Taille de la maquette « Frame Abonnement.svg » : tout est positionné en pixels dans ce cadre,
// puis le cadre entier est réduit (jamais agrandi) pour tenir dans la fenêtre.
const LARGEUR = 1016;
const HAUTEUR = 1920;

// Taille maximale d'affichage (1 = taille de la maquette). Monte pour agrandir, baisse pour réduire.
const ECHELLE_MAX = 0.6;

const VIOLET = "#7F4DC5";
const ROSE = "#E055B0";

type Formule = "mensuel" | "annuel";

// Position (en pixels de la maquette) de chaque carte de formule
const FORMULES: {
  id: Formule;
  titre: string;
  detail: string;
  prix: string;
  top: number; // haut de la carte
  radioCentre: number; // hauteur du centre du rond, dans la carte
  texteGauche: number; // départ du texte, dans la carte
  badge: boolean;
}[] = [
  { id: "mensuel", titre: "Mensuel", detail: "Facturé mensuellement", prix: "5,99 €/mois", top: 1113, radioCentre: 53, texteGauche: 92, badge: false },
  { id: "annuel", titre: "Annuel", detail: "Facturé annuellement", prix: "2,99 €/mois", top: 1311, radioCentre: 66, texteGauche: 103, badge: true },
];

export default function FrameAbonnement({ onClose }: { onClose?: () => void }) {
  const [echelle, setEchelle] = useState(1);
  const [formule, setFormule] = useState<Formule | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const ajuster = () =>
      setEchelle(Math.min(ECHELLE_MAX, (window.innerWidth - 32) / LARGEUR));
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

  // « Choisir mon abonnement » : on ouvre la page de paiement Stripe pour la formule choisie
  const choisirAbonnement = async () => {
    if (!formule) {
      setErreur("Choisis une formule pour continuer.");
      return;
    }
    setErreur(null);
    setChargement(true);
    try {
      const res = await fetch("/api/checkout/abonnement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ formule }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Impossible d'ouvrir le paiement pour le moment.");
      window.location.href = data.url;
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Une erreur est survenue.");
      setChargement(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] overflow-y-auto bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Abonnement SOREA"
    >
      <div className="mx-auto my-4" style={{ width: LARGEUR * echelle, height: HAUTEUR * echelle }}>
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
          {/* Croix : seulement si la fenêtre peut être fermée */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute cursor-pointer flex items-center justify-center"
              style={{ left: 870, top: 89, width: 46, height: 45 }}
            >
              <img src="/image_icone/Cross.svg" alt="" className="w-full h-full object-contain" />
            </button>
          )}

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
            SOREA, ta bulle
            <br />
            de sérénité
          </h2>

          {/* Bandeau */}
          <div
            className="absolute flex items-center justify-center text-center text-white whitespace-nowrap"
            style={{ left: 185, top: 533, width: 646, height: 80, background: "#BFA9FF", fontSize: 25, lineHeight: "30px", letterSpacing: "0.1em" }}
          >
            <p>
              Accédez à toutes vos expériences digitales
              <br />
              et avancez tranquillement, jour après jour.
            </p>
          </div>

          {/* Encadré en pointillés */}
          <div
            className="absolute"
            style={{ left: 121, top: 681, width: 462, height: 281, border: "2px dashed #A98BE8", background: "#FAF7FF" }}
          >
            {[
              { lignes: ["Accès complet aux routines"], top: 37 },
              { lignes: ["Wheel-Spinner gratuit et", "utilisation illimité"], top: 81 },
              { lignes: ["Création d’Affirmations et", "de Visualisations illimitée."], top: 147 },
              { lignes: ["Notification personnalisées"], top: 213 },
            ].map((ligne) => (
              <div
                key={ligne.lignes[0]}
                className="absolute flex items-center whitespace-nowrap"
                style={{ left: 35, top: ligne.top, height: ligne.lignes.length * 24 }}
              >
                <img src="/image_icone/LotusPuce.svg" alt="" style={{ width: 28, height: 28 }} />
                <span style={{ marginLeft: 21, fontSize: 20, lineHeight: "24px", letterSpacing: "0.1em", color: "#212121" }}>
                  {ligne.lignes.map((texte, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {texte}
                    </span>
                  ))}
                </span>
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

          {/* Séparateur avec étoile */}
          <div className="absolute" style={{ left: 45, top: 1039, width: 405, borderTop: "2px dotted #8B47FF" }} />
          <div className="absolute" style={{ left: 568, top: 1039, width: 400, borderTop: "2px dotted #8B47FF" }} />
          <svg className="absolute" style={{ left: 477, top: 1009, width: 62, height: 62 }} viewBox="0 0 24 24" fill={VIOLET}>
            <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
          </svg>

          {/* Formules */}
          <div role="radiogroup" aria-label="Formule d'abonnement">
            {FORMULES.map((f) => {
              const choisie = formule === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={choisie}
                  onClick={() => {
                    setFormule(f.id);
                    setErreur(null);
                  }}
                  className="absolute cursor-pointer text-left"
                  style={{
                    left: 95,
                    top: f.top,
                    width: 826,
                    height: 148,
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.6)",
                    border: choisie ? `2px solid ${VIOLET}` : "2px solid transparent",
                    boxShadow: choisie ? "0 3px 10px rgba(127,77,197,0.25)" : "none",
                  }}
                >
                  {/* Rond de sélection */}
                  <span
                    className="absolute flex items-center justify-center"
                    style={{
                      left: 43,
                      top: f.radioCentre - 14 - 2,
                      width: 28,
                      height: 28,
                      borderRadius: 9999,
                      border: `2px solid ${choisie ? VIOLET : "#7F6674"}`,
                    }}
                  >
                    {choisie && <span style={{ width: 14, height: 14, borderRadius: 9999, background: VIOLET }} />}
                  </span>

                  {/* Titre (+ pastille « Économisez 50% » pour l'annuel) */}
                  <span
                    className="absolute font-bold whitespace-nowrap"
                    style={{ left: f.texteGauche - 2, top: 52 - 2 - 17, fontSize: 26, lineHeight: "34px", letterSpacing: "0.1em", color: "#212121" }}
                  >
                    {f.titre}
                  </span>
                  {f.badge && (
                    <span
                      className="absolute flex items-center justify-center font-bold whitespace-nowrap"
                      style={{
                        left: 225 - 2,
                        top: 37 - 2,
                        width: 263,
                        height: 29,
                        borderRadius: 6,
                        border: "1.5px solid #E256B3",
                        background: "#FFF0F8",
                        color: "#E256B3",
                        fontSize: 20,
                        letterSpacing: "0.08em",
                      }}
                    >
                      ÉCONOMISEZ 50%
                    </span>
                  )}
                  <span
                    className="absolute whitespace-nowrap"
                    style={{ left: f.texteGauche - 2, top: 97 - 2 - 17, fontSize: 25, lineHeight: "34px", letterSpacing: "0.08em", color: "#7F6674" }}
                  >
                    {f.detail}
                  </span>

                  {/* Prix */}
                  <span
                    className="absolute font-bold whitespace-nowrap"
                    style={{ right: 44 - 2, top: 75 - 2 - 17, fontSize: 26, lineHeight: "34px", letterSpacing: "0.06em", color: "#212121" }}
                  >
                    {f.prix}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Message d'erreur (aucune formule choisie, ou paiement impossible) */}
          {erreur && (
            <div
              className="absolute text-center"
              style={{ left: 0, top: 1470, width: 1016, fontSize: 18, lineHeight: "24px", letterSpacing: "0.05em", color: "#C0392B" }}
            >
              {erreur}
            </div>
          )}

          {/* Bouton rose */}
          <button
            type="button"
            onClick={choisirAbonnement}
            disabled={chargement}
            className="absolute text-white font-bold"
            style={{
              left: 214,
              top: 1508,
              width: 588,
              height: 88,
              borderRadius: 24,
              background: ROSE,
              boxShadow: "inset 0 -7px 4px rgba(120, 30, 90, 0.35), 0 3px 4px rgba(0,0,0,0.2)",
              fontSize: 30,
              letterSpacing: "0.06em",
              cursor: chargement ? "wait" : "pointer",
              opacity: chargement ? 0.7 : 1,
            }}
          >
            {chargement ? "Redirection…" : "Choisir mon abonnement"}
          </button>

          {/* Paiement sécurisé */}
          <img
            src="/image_icone/ClosedPadlockG1.svg"
            alt=""
            className="absolute"
            style={{ left: 146, top: 1644, width: 22, height: 30, objectFit: "contain" }}
          />
          <div
            className="absolute whitespace-nowrap"
            style={{ left: 192, top: 1644, fontSize: 20, lineHeight: "30px", letterSpacing: "0.08em", color: "#7F6674" }}
          >
            Paiement sécurisé • Résiliation selon les conditions de l’offre
          </div>

          {/* Tampon en bas */}
          <img
            src="/image_Design-SOREA/SubscriptionBuffer.svg"
            alt=""
            className="absolute"
            style={{ left: 378, top: 1722, width: 260, height: 90, objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}