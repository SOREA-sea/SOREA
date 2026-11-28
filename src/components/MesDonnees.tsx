"use client";

import { useEffect, useState, type ReactNode } from "react";

// Rubrique « Mes données » de /dashboard/profile (RGPD) et demande de consentement aux données de santé.
// - PorteConsentementSante : entoure le suivi (/suivi, /dashboard/suivi) ; sans consentement, affiche la demande.
// - RubriqueMesDonnees     : consentement (donner / retirer), effacer ses données de suivi, supprimer son compte.

const champ =
  "w-full p-4 rounded-full border border-white/80 bg-white/75 outline-none focus:ring-2 focus:ring-purple-300 transition-all";

const dateLongue = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

interface EtatConsentement {
  consenti: boolean;
  depuis: string | null;
  retireLe: string | null;
}

// Texte du consentement : le même partout (inscription, suivi, Mes données)
export const TEXTE_CONSENTEMENT_SANTE =
  "J'accepte que SOREA enregistre et utilise mes données de santé (règles, cycle, grossesse, post-partum, allaitement, " +
  "ménopause, symptômes, ressentis) pour me proposer un suivi calculé et personnalisé, les synthèses et les conseils " +
  "adaptés à ma situation. " +
  "Je peux retirer mon accord à tout moment dans Mon compte, rubrique « Mes données ».";

async function donnerConsentement() {
  const res = await fetch("/api/account/consentement-sante", { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur");
  return data as { consenti: true; depuis: string | null };
}

// ── Demande de consentement (formulaire) ─────────────────────────────────────
function DemandeConsentement({ onAccepte, compacte = false }: { onAccepte: (depuis: string | null) => void; compacte?: boolean }) {
  const [coche, setCoche] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const accepter = async () => {
    setEnCours(true);
    setErreur(null);
    try {
      const r = await donnerConsentement();
      onAccepte(r.depuis);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="space-y-4">
      {!compacte && (
        <p className="text-sm text-foreground/70">
          Ton cycle, ta grossesse, ton post-partum, ta ménopause ou tes symptômes sont des données de santé. La loi (RGPD) demande ton accord
          explicite avant que SOREA les enregistre. Sans cet accord, le reste de ton compte fonctionne normalement.
        </p>
      )}
      <label className="flex items-start gap-3 text-sm cursor-pointer">
        <input type="checkbox" className="mt-1" checked={coche} onChange={(e) => setCoche(e.target.checked)} />
        <span>{TEXTE_CONSENTEMENT_SANTE}</span>
      </label>
      {erreur && <p role="alert" className="text-sm text-red-600">{erreur}</p>}
      <button
        type="button"
        onClick={accepter}
        disabled={!coche || enCours}
        className="btn-primary px-8 py-3.5 disabled:opacity-60 cursor-pointer"
      >
        {enCours ? "Enregistrement…" : "Je donne mon accord"}
      </button>
    </div>
  );
}

// ── Porte du suivi ───────────────────────────────────────────────────────────
// Personne non connectée (401) : on laisse passer, la page gère déjà la connexion.
export function PorteConsentementSante({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<"chargement" | "ok" | "demande">("chargement");

  useEffect(() => {
    let actif = true;
    fetch("/api/account/consentement-sante")
      .then(async (res) => {
        if (!actif) return;
        if (res.status === 401) return setEtat("ok");
        const data = res.ok ? await res.json() : null;
        setEtat(data && !data.consenti ? "demande" : "ok");
      })
      .catch(() => actif && setEtat("ok"));
    return () => {
      actif = false;
    };
  }, []);

  if (etat === "chargement") {
    return <div className="w-8 h-8 my-20 mx-auto border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />;
  }
  if (etat === "demande") {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 my-10">
        <div className="glass-panel rounded-3xl p-8 space-y-4 bg-white/80">
          <h2 className="text-2xl font-black section-title">Avant de commencer ton suivi</h2>
          <DemandeConsentement onAccepte={() => setEtat("ok")} />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

// ── Rubrique Mes données ─────────────────────────────────────────────────────
function CarteConsentement() {
  const [etat, setEtat] = useState<EtatConsentement | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [retrait, setRetrait] = useState(false); // formulaire de retrait ouvert
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;
    fetch("/api/account/consentement-sante")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((data) => actif && setEtat(data))
      .catch(() => actif && setErreur("Impossible de charger ton consentement pour le moment."));
    return () => {
      actif = false;
    };
  }, []);

  const retirer = async () => {
    setEnCours(true);
    setErreur(null);
    try {
      const res = await fetch("/api/account/consentement-sante", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setEtat({ consenti: false, depuis: null, retireLe: new Date().toISOString() });
      setMessage(
        "Accord retiré. Ton suivi est bloqué ; tes données sont conservées, mais plus utilisées, tant que tu ne redonnes pas ton accord."
      );
      setRetrait(false);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-8 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Données de santé</h3>
          <p className="text-foreground/60 text-sm mt-1">
            Ton accord pour que SOREA enregistre et utilise tes données de santé, quelle que soit ta situation : cycle, grossesse, post-partum, allaitement, ménopause, symptômes.
          </p>
        </div>
        {etat && (
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${etat.consenti ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
          >
            {etat.consenti ? "Accord donné" : "Pas d'accord"}
          </span>
        )}
      </div>

      {message && <div role="status" className="p-4 rounded-2xl text-sm font-medium bg-green-50/80 text-green-700 border border-green-200">{message}</div>}
      {erreur && <p role="alert" className="text-sm text-red-600">{erreur}</p>}

      {!etat ? (
        !erreur && <div className="w-6 h-6 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      ) : etat.consenti ? (
        <>
          <p className="text-sm">
            Accord donné le <strong>{etat.depuis ? dateLongue(etat.depuis) : "—"}</strong>.
          </p>
          {/* Remerciement : visible tant que l'accord est donné */}
          <p className="text-sm p-4 rounded-2xl bg-purple-50/80 text-[#6A18A4] border border-purple-100">
            Merci pour ta confiance. Grâce à ton accord, SOREA peut t&apos;accompagner avec un suivi qui te ressemble.
            Tes données restent les tiennes : tu peux changer d&apos;avis à tout moment.
          </p>
          {!retrait ? (
            <button
              type="button"
              onClick={() => setRetrait(true)}
              className="px-5 py-2.5 bg-white/70 rounded-full text-sm font-medium hover:bg-white transition-all cursor-pointer"
            >
              Retirer mon accord
            </button>
          ) : (
            <div className="space-y-4 p-5 rounded-2xl bg-white/60">
              <p className="text-sm">
                Sans ton accord, le calendrier, les synthèses et les conseils liés à ta situation sont bloqués.
                Le reste de ton compte continue de fonctionner.
              </p>
              <p className="text-sm text-foreground/60">
                Tes données sont conservées, mais plus utilisées. Pour les effacer, utilise « Effacer mes données de suivi » juste en dessous.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={retirer}
                  disabled={enCours}
                  className="px-5 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {enCours ? "Retrait…" : "Confirmer le retrait"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRetrait(false);
                  }}
                  className="px-5 py-2.5 bg-white/70 rounded-full text-sm font-medium hover:bg-white transition-all cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {etat.retireLe && (
            <p className="text-sm text-foreground/60">Accord retiré le {dateLongue(etat.retireLe)}.</p>
          )}
          <DemandeConsentement
            compacte
            onAccepte={(depuis) => {
              setEtat({ consenti: true, depuis, retireLe: etat.retireLe });
              setMessage("Merci, ton accord est enregistré. Ton suivi est de nouveau disponible.");
            }}
          />
        </>
      )}
    </div>
  );
}

function CarteExport() {
  return (
    <div className="glass-panel rounded-3xl p-8 space-y-4">
      <div>
        <h3 className="text-xl font-bold">Télécharger mes données</h3>
        <p className="text-foreground/60 text-sm mt-1">
          Un fichier avec tout ce que SOREA sait de toi : ton compte, ton suivi, ton carnet, tes achats, ton coaching,
          tes favoris et tes connexions. Ton mot de passe n&apos;en fait jamais partie.
        </p>
      </div>
      {/* Lien direct : le navigateur télécharge le fichier JSON envoyé par le serveur */}
      <a href="/api/account/export" download className="btn-primary inline-block px-8 py-3.5">
        Télécharger mes données
      </a>
    </div>
  );
}

function CarteEffacerSuivi() {
  const [cycle, setCycle] = useState(true);
  const [carnet, setCarnet] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);

  const effacer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/donnees-suivi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycle, carnet, confirmation: confirmation.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      const quoi = cycle && carnet ? "de ton cycle et de ton carnet" : cycle ? "de ton cycle" : "de ton carnet";
      setMessage({ type: "ok", texte: `Les données ${quoi} ont été effacées.` });
      setConfirmation("");
    } catch (err) {
      setMessage({ type: "erreur", texte: err instanceof Error ? err.message : "Une erreur est survenue." });
    } finally {
      setEnCours(false);
    }
  };

  return (
    <form onSubmit={effacer} className="glass-panel rounded-3xl p-8 space-y-5">
      <div>
        <h3 className="text-xl font-bold">Effacer mes données de suivi</h3>
        <p className="text-foreground/60 text-sm mt-1">
          Repartir de zéro sans supprimer ton compte : ton abonnement, tes achats et ton coaching sont conservés.
          L&apos;effacement est définitif.
        </p>
      </div>

      {message && (
        <div
          role={message.type === "erreur" ? "alert" : "status"}
          className={`p-4 rounded-2xl text-sm font-medium ${message.type === "ok" ? "bg-green-50/80 text-green-700 border border-green-200" : "bg-red-50/80 text-red-600 border border-red-200"}`}
        >
          {message.texte}
        </div>
      )}

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium mb-2">Ce que tu veux effacer</legend>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <input type="checkbox" className="mt-1" checked={cycle} onChange={(e) => setCycle(e.target.checked)} />
          <span>
            <strong>Mon cycle</strong> : situation, règles, jours du calendrier (retards, notes), synthèses et symptômes.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <input type="checkbox" className="mt-1" checked={carnet} onChange={(e) => setCarnet(e.target.checked)} />
          <span>
            <strong>Mon carnet</strong> : humeurs, ressentis, journal, notes, habitudes, défis et loisirs.
          </span>
        </label>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="effacer-confirmation" className="text-sm font-medium ml-1">
          Pour confirmer, tape <strong>SUPPRIMER</strong>
        </label>
        <input id="effacer-confirmation" type="text" autoComplete="off" value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)} className={champ} />
      </div>

      <button
        type="submit"
        disabled={enCours || (!cycle && !carnet) || confirmation.trim() !== "SUPPRIMER"}
        className="px-6 py-3 bg-red-50 text-red-600 rounded-full text-sm font-bold hover:bg-red-100 transition-all disabled:opacity-60 cursor-pointer"
      >
        {enCours ? "Effacement…" : "Effacer définitivement"}
      </button>
    </form>
  );
}

function CarteSupprimerCompte() {
  const [ouvert, setOuvert] = useState(false);
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const supprimer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: motDePasse, confirmation: confirmation.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      window.location.href = "/";
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
      setEnCours(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-8 space-y-5 border border-red-100">
      <div>
        <h3 className="text-xl font-bold text-red-600">Supprimer mon compte</h3>
        <p className="text-foreground/60 text-sm mt-1">
          Ton compte et toutes tes données (suivi, carnet, favoris, panier, réservations, connexions) sont effacés
          définitivement. Si tu as un abonnement, il est résilié immédiatement ; tes factures restent disponibles
          auprès de Stripe, notre prestataire de paiement.
        </p>
      </div>

      {!ouvert ? (
        <button
          type="button"
          onClick={() => setOuvert(true)}
          className="px-6 py-3 bg-red-50 text-red-600 rounded-full text-sm font-bold hover:bg-red-100 transition-all cursor-pointer"
        >
          Supprimer mon compte
        </button>
      ) : (
        <form onSubmit={supprimer} className="space-y-4">
          {erreur && <div role="alert" className="p-4 rounded-2xl text-sm font-medium bg-red-50/80 text-red-600 border border-red-200">{erreur}</div>}
          <div className="space-y-1.5">
            <label htmlFor="suppression-mdp" className="text-sm font-medium ml-1">Ton mot de passe</label>
            <input id="suppression-mdp" type="password" autoComplete="current-password" required value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)} className={champ} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="suppression-confirmation" className="text-sm font-medium ml-1">
              Pour confirmer, tape <strong>SUPPRIMER</strong>
            </label>
            <input id="suppression-confirmation" type="text" autoComplete="off" value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)} className={champ} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={enCours || !motDePasse || confirmation.trim() !== "SUPPRIMER"}
              className="px-6 py-3 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {enCours ? "Suppression…" : "Supprimer définitivement mon compte"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOuvert(false);
                setMotDePasse("");
                setConfirmation("");
                setErreur(null);
              }}
              className="px-6 py-3 bg-white/70 rounded-full text-sm font-medium hover:bg-white transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RubriqueMesDonnees() {
  return (
    <section id="donnees" className="space-y-5 scroll-mt-24">
      <h2 className="text-2xl font-black section-title">Mes données</h2>
      <CarteExport />
      <CarteConsentement />
      <CarteEffacerSuivi />
      <CarteSupprimerCompte />
    </section>
  );
}
