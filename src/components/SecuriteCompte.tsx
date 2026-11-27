"use client";

import { useCallback, useEffect, useState } from "react";

// Rubrique « Sécurité » de /dashboard/profile : changer son mot de passe, voir ses connexions actives
// et se déconnecter des autres appareils. (La 2FA reste gérée dans la page.)

const champ =
  "w-full p-4 rounded-full border border-white/80 bg-white/75 outline-none focus:ring-2 focus:ring-purple-300 transition-all";

const dateHeure = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

// ── Mot de passe ─────────────────────────────────────────────────────────────
export function CarteMotDePasse({ onChange }: { onChange?: () => void }) {
  const [actuel, setActuel] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [afficher, setAfficher] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (nouveau !== confirmation) {
      setMessage({ type: "erreur", texte: "La confirmation ne correspond pas au nouveau mot de passe." });
      return;
    }
    setEnCours(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: actuel, newPassword: nouveau }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setActuel("");
      setNouveau("");
      setConfirmation("");
      const autres = data.autresConnexionsFermees as number;
      setMessage({
        type: "ok",
        texte:
          autres > 0
            ? `Mot de passe modifié. Tes ${autres} autre${autres > 1 ? "s" : ""} connexion${autres > 1 ? "s ont" : " a"} été fermée${autres > 1 ? "s" : ""}.`
            : "Mot de passe modifié.",
      });
      onChange?.();
    } catch (err) {
      setMessage({ type: "erreur", texte: err instanceof Error ? err.message : "Une erreur est survenue." });
    } finally {
      setEnCours(false);
    }
  };

  const type = afficher ? "text" : "password";

  return (
    <form onSubmit={envoyer} className="glass-panel rounded-3xl p-8 space-y-5">
      <div>
        <h3 className="text-xl font-bold">Mot de passe</h3>
        <p className="text-foreground/60 text-sm mt-1">
          Après le changement, tes autres appareils sont déconnectés. Celui-ci reste connecté.
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

      <div className="space-y-1.5">
        <label htmlFor="mdp-actuel" className="text-sm font-medium ml-1">Mot de passe actuel</label>
        <input id="mdp-actuel" type={type} autoComplete="current-password" required value={actuel}
          onChange={(e) => setActuel(e.target.value)} className={champ} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="mdp-nouveau" className="text-sm font-medium ml-1">Nouveau mot de passe</label>
          <input id="mdp-nouveau" type={type} autoComplete="new-password" required value={nouveau}
            onChange={(e) => setNouveau(e.target.value)} className={champ} aria-describedby="mdp-regles" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="mdp-confirmation" className="text-sm font-medium ml-1">Confirmer le nouveau mot de passe</label>
          <input id="mdp-confirmation" type={type} autoComplete="new-password" required value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)} className={champ} />
        </div>
      </div>
      <p id="mdp-regles" className="text-xs text-foreground/50 ml-1">
        Au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.
        Évite les suites (abc, 123), les répétitions, ton nom et ta date de naissance.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={afficher} onChange={(e) => setAfficher(e.target.checked)} />
          Afficher les mots de passe
        </label>
        <button type="submit" disabled={enCours || !actuel || !nouveau || !confirmation}
          className="btn-primary px-8 py-3.5 disabled:opacity-60 cursor-pointer">
          {enCours ? "Modification…" : "Changer le mot de passe"}
        </button>
      </div>
    </form>
  );
}

// ── Connexions actives ───────────────────────────────────────────────────────
interface Connexion {
  cle: string;
  appareil: string;
  connecteeLe: string;
  expireLe: string;
  actuelle: boolean;
}

export function CarteConnexions({ actualisation = 0 }: { actualisation?: number }) {
  const [connexions, setConnexions] = useState<Connexion[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<string | null>(null); // clé fermée, ou "autres"

  const charger = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/sessions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setConnexions(data.sessions);
      setErreur(null);
    } catch {
      setErreur("Impossible de charger tes connexions pour le moment.");
    }
  }, []);

  useEffect(() => {
    let actif = true;
    fetch("/api/auth/sessions")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((data) => {
        if (actif) setConnexions(data.sessions);
      })
      .catch(() => actif && setErreur("Impossible de charger tes connexions pour le moment."));
    return () => {
      actif = false;
    };
  }, [actualisation]);

  const fermer = async (corps: { cle: string } | { autres: true }, marque: string) => {
    setEnCours(marque);
    setErreur(null);
    try {
      const res = await fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      await charger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(null);
    }
  };

  const autres = connexions?.filter((c) => !c.actuelle).length ?? 0;

  return (
    <div className="glass-panel rounded-3xl p-8 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Connexions actives</h3>
          <p className="text-foreground/60 text-sm mt-1">
            Les appareils connectés à ton compte. Si tu n&apos;en reconnais pas un, ferme-le et change ton mot de passe.
          </p>
        </div>
        {autres > 0 && (
          <button
            type="button"
            onClick={() => fermer({ autres: true }, "autres")}
            disabled={enCours !== null}
            className="px-5 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-60 cursor-pointer"
          >
            {enCours === "autres" ? "Déconnexion…" : "Déconnecter tous les autres appareils"}
          </button>
        )}
      </div>

      {erreur && <p role="alert" className="text-sm text-red-600">{erreur}</p>}

      {!connexions ? (
        !erreur && <div className="w-6 h-6 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      ) : (
        <ul className="divide-y divide-white/60">
          {connexions.map((c) => (
            <li key={c.cle} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-sm">
                  {c.appareil}
                  {c.actuelle && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Cet appareil</span>
                  )}
                </p>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Connecté le {dateHeure(c.connecteeLe)} · expire le {dateHeure(c.expireLe)}
                </p>
              </div>
              {!c.actuelle && (
                <button
                  type="button"
                  onClick={() => fermer({ cle: c.cle }, c.cle)}
                  disabled={enCours !== null}
                  className="px-4 py-2 bg-white/70 rounded-full text-sm font-medium hover:bg-white transition-all disabled:opacity-60 cursor-pointer"
                >
                  {enCours === c.cle ? "Déconnexion…" : "Déconnecter"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
