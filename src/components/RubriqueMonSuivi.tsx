"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Rubrique « Mon suivi » des paramètres du compte (/dashboard/profile) : situation choisie dans « Vous êtes... »,
// lue dans le profil menstruel en base (/api/menstrual-profile), avec un accès direct à la modale du calendrier.
// La durée du cycle et le mode discret se règlent dans le calendrier.

interface ProfilSuivi {
  isActive: boolean;
  lastPeriodStartDate: string | null;
  situation?: string | null;
  pregnancyStartDate?: string | null;
  deliveryDate?: string | null;
  breastfeeding?: boolean;
}

const LIBELLES_SITUATION: Record<string, string> = {
  reglee: "Réglée",
  enceinte: "Enceinte",
  menopausee: "Ménopausée",
  autres: "Autres",
  projet: "En projet de grossesse",
  perimenopause: "Périménopausée",
  postpartum: "Post-partum / Allaitante",
};

const dateLongue = (iso: string) =>
  new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function RubriqueMonSuivi() {
  const [profil, setProfil] = useState<ProfilSuivi | null>(null);
  const [erreurChargement, setErreurChargement] = useState(false);

  useEffect(() => {
    let actif = true;
    fetch("/api/menstrual-profile")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((data) => {
        if (actif) setProfil(data.profile);
      })
      .catch(() => actif && setErreurChargement(true));
    return () => {
      actif = false;
    };
  }, []);

  const situation = profil?.situation || null;

  // Détail de la situation : dates utiles selon le cas
  const detailSituation = () => {
    if (!profil) return null;
    if (situation === "enceinte") {
      return profil.pregnancyStartDate ? `Dernières règles avant la grossesse : ${dateLongue(profil.pregnancyStartDate)}.` : null;
    }
    if (situation === "postpartum") {
      const acc = profil.deliveryDate ? `Accouchement le ${dateLongue(profil.deliveryDate)}` : "Date d'accouchement non renseignée";
      return `${acc} · allaitement : ${profil.breastfeeding ? "oui" : "non"}.`;
    }
    if (situation === "menopausee") return "Pas de cycle menstruel suivi.";
    if (!profil.isActive) return "Le suivi du cycle est désactivé.";
    return profil.lastPeriodStartDate
      ? `Début des dernières règles : ${dateLongue(profil.lastPeriodStartDate)}.`
      : "Date des dernières règles non renseignée.";
  };

  return (
    <section id="suivi" className="space-y-5 scroll-mt-24">
      <h2 className="text-2xl font-black section-title">Mon suivi</h2>

      <div className="glass-panel rounded-3xl p-8 space-y-4">
        {erreurChargement ? (
          <p className="text-sm text-red-600">Impossible de charger ton suivi pour le moment. Recharge la page pour réessayer.</p>
        ) : !profil ? (
          <div className="w-6 h-6 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Ma situation</h3>
                <p className="text-foreground/60 text-sm mt-1">
                  Elle adapte le calendrier, tes synthèses et ton rapport pour le médecin.
                </p>
              </div>
              <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                {situation ? LIBELLES_SITUATION[situation] ?? "Non renseignée" : "Non renseignée"}
              </span>
            </div>
            {detailSituation() && <p className="text-sm">{detailSituation()}</p>}
            <Link href="/suivi?vous-etes=1" className="btn-primary inline-block text-sm">
              Modifier ma situation
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
