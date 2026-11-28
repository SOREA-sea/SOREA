"use client";

import { useEffect, useState } from "react";

// Compte à rebours du lien « Mot de passe oublié » (valable 60 minutes) : « Ce lien expire dans 59:32 ».
// fin : instant d'expiration (millisecondes). onFin est appelé une fois, quand le temps est écoulé.
export default function CompteurLien({ fin, onFin, texte = "Ton lien expire dans" }: { fin: number; onFin?: () => void; texte?: string }) {
  const [maintenant, setMaintenant] = useState(() => Date.now());
  const reste = Math.max(0, fin - maintenant);

  useEffect(() => {
    if (reste <= 0) {
      onFin?.();
      return;
    }
    const minuterie = setTimeout(() => setMaintenant(Date.now()), 1000);
    return () => clearTimeout(minuterie);
  }, [reste, onFin]);

  const minutes = Math.floor(reste / 60000);
  const secondes = Math.floor((reste % 60000) / 1000);
  const bientot = reste < 5 * 60000; // moins de 5 minutes : en rouge

  return (
    // suppressHydrationWarning : l'heure du serveur et celle du navigateur diffèrent forcément de quelques secondes
    <p
      suppressHydrationWarning
      role="timer"
      aria-live="off"
      className={`text-sm font-semibold p-3 rounded-2xl text-center border ${bientot ? "bg-red-50/80 text-red-600 border-red-200" : "bg-purple-50/80 text-[#6A18A4] border-purple-100"}`}
    >
      {reste > 0 ? (
        <>
          {texte}{" "}
          <span className="tabular-nums" suppressHydrationWarning>
            {String(minutes).padStart(2, "0")}:{String(secondes).padStart(2, "0")}
          </span>
        </>
      ) : (
        "Ton lien a expiré."
      )}
    </p>
  );
}
