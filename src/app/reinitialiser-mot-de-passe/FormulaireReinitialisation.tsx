"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import CompteurLien from "@/components/CompteurLien";

const champ =
  "w-full p-4 rounded-full border border-purple-100 bg-white outline-none focus:ring-2 focus:ring-purple-300 transition-all";

// Choix du nouveau mot de passe à partir du lien reçu par e-mail.
// expireLe : fin de validité réelle du lien (lue en base), null si le lien est inconnu, expiré ou déjà utilisé.
export default function FormulaireReinitialisation({ token, expireLe }: { token: string; expireLe: number | null }) {
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [afficher, setAfficher] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [termine, setTermine] = useState(false);
  const [expire, setExpire] = useState(expireLe === null);
  const marquerExpire = useCallback(() => setExpire(true), []);

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    if (nouveau !== confirmation) {
      setErreur("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }
    setEnCours(true);
    try {
      const res = await fetch("/api/auth/reinitialiser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: nouveau }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setTermine(true);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  };

  if (!token || (expire && !termine)) {
    return (
      <div className="glass-panel bg-white/80 rounded-3xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-black section-title">{token ? "Lien expiré" : "Lien incomplet"}</h1>
        <p className="text-sm text-foreground/70">
          {token
            ? "Ce lien a expiré ou a déjà servi : il n'est valable que 60 minutes et une seule fois. Refais une demande pour en recevoir un nouveau."
            : "Ce lien n'est pas valide. Refais une demande de nouveau mot de passe."}
        </p>
        <Link href="/mot-de-passe-oublie" className="btn-primary inline-block px-6 py-3">Refaire une demande</Link>
      </div>
    );
  }

  if (termine) {
    return (
      <div className="glass-panel bg-white/80 rounded-3xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-black section-title">Mot de passe modifié</h1>
        <p role="status" className="text-sm text-foreground/70">
          Ton nouveau mot de passe est enregistré. Par sécurité, tous tes appareils ont été déconnectés : connecte-toi avec ton nouveau mot de passe.
        </p>
        <Link href="/login" className="btn-primary inline-block px-6 py-3">Me connecter</Link>
      </div>
    );
  }

  const type = afficher ? "text" : "password";

  return (
    <form onSubmit={envoyer} className="glass-panel bg-white/80 rounded-3xl p-8 w-full max-w-md space-y-5">
      <h1 className="text-2xl font-black section-title">Nouveau mot de passe</h1>
      {expireLe !== null && <CompteurLien fin={expireLe} onFin={marquerExpire} />}

      {erreur && (
        <div role="alert" className="p-4 rounded-2xl text-sm font-medium bg-red-50/80 text-red-600 border border-red-200">
          {erreur}
          {/expiré|valide/.test(erreur) && (
            <>
              {" "}
              <Link href="/mot-de-passe-oublie" className="underline font-semibold">Refaire une demande</Link>
            </>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="reinit-nouveau" className="text-sm font-medium ml-1">Nouveau mot de passe</label>
        <input id="reinit-nouveau" type={type} autoComplete="new-password" required value={nouveau}
          onChange={(e) => setNouveau(e.target.value)} className={champ} aria-describedby="reinit-regles" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="reinit-confirmation" className="text-sm font-medium ml-1">Confirmer le nouveau mot de passe</label>
        <input id="reinit-confirmation" type={type} autoComplete="new-password" required value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)} className={champ} />
      </div>
      <p id="reinit-regles" className="text-xs text-foreground/50 ml-1">
        Au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.
        Évite les suites (abc, 123), les répétitions, ton nom et ta date de naissance.
      </p>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={afficher} onChange={(e) => setAfficher(e.target.checked)} />
        Afficher les mots de passe
      </label>

      <button type="submit" disabled={enCours || !nouveau || !confirmation} className="btn-primary w-full py-3.5 disabled:opacity-60 cursor-pointer">
        {enCours ? "Enregistrement…" : "Enregistrer mon nouveau mot de passe"}
      </button>
    </form>
  );
}
