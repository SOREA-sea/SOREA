"use client";

import { useState } from "react";

export default function BoutonGererAbonnement() {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const ouvrir = async () => {
    setErreur(null);
    setChargement(true);
    try {
      const res = await fetch("/api/billing/portail", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Une erreur est survenue.");
      window.location.href = data.url;
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Une erreur est survenue.");
      setChargement(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={ouvrir} disabled={chargement} className="btn-primary text-sm">
        {chargement ? "Redirection…" : "Gérer mon abonnement"}
      </button>
      {erreur && <p className="text-sm text-red-600 mt-2">{erreur}</p>}
    </div>
  );
}