"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CompteurLien from "@/components/CompteurLien";

// « Mot de passe oublié ? » (lien de /login) : demande d'un lien de réinitialisation par e-mail.
export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);
  // Fin de validité du lien envoyé (60 minutes après la demande) : compte à rebours affiché sous le message
  const [finLien, setFinLien] = useState<number | null>(null);

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/mot-de-passe-oublie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setMessage({ type: "ok", texte: data.message });
      setFinLien(Date.now() + 60 * 60_000);
    } catch (err) {
      setMessage({ type: "erreur", texte: err instanceof Error ? err.message : "Une erreur est survenue." });
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col text-gray-800">
      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pt-8">
        <Navbar />
      </div>
      <main className="flex-1 flex items-start justify-center px-4 py-20">
        <form onSubmit={envoyer} className="glass-panel bg-white/80 rounded-3xl p-8 w-full max-w-md space-y-5">
          <h1 className="text-2xl font-black section-title">Mot de passe oublié</h1>
          <p className="text-sm text-foreground/70">
            Indique l&apos;adresse e-mail de ton compte : tu recevras un lien pour choisir un nouveau mot de passe.
          </p>

          {message && (
            <div
              role={message.type === "erreur" ? "alert" : "status"}
              className={`p-4 rounded-2xl text-sm font-medium ${message.type === "ok" ? "bg-green-50/80 text-green-700 border border-green-200" : "bg-red-50/80 text-red-600 border border-red-200"}`}
            >
              {message.texte}
            </div>
          )}
          {message?.type === "ok" && finLien && <CompteurLien fin={finLien} texte="Le lien est valable 60 minutes. Il expire dans" />}

          <div className="space-y-1.5">
            <label htmlFor="oubli-email" className="text-sm font-medium ml-1">Adresse e-mail</label>
            <input
              id="oubli-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@domaine.com"
              className="w-full p-4 rounded-full border border-purple-100 bg-white outline-none focus:ring-2 focus:ring-purple-300 transition-all"
            />
          </div>

          <button type="submit" disabled={enCours || !email} className="btn-primary w-full py-3.5 disabled:opacity-60 cursor-pointer">
            {enCours ? "Envoi…" : "M'envoyer le lien"}
          </button>
          <p className="text-sm text-center">
            <Link href="/login" className="text-[#6A18A4] font-semibold hover:underline">Retour à la connexion</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
