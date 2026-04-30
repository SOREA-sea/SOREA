"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CoachSessionCreator() {
  const router = useRouter();
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const toLocalDatetime = (d: Date) => {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const minStartsAt = toLocalDatetime(now);
  const maxDate = new Date(now);
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxStartsAt = toLocalDatetime(maxDate);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      startsAt: String(formData.get("startsAt") || "").trim(),
      durationMinutes: Number(formData.get("durationMinutes") || 0) || undefined,
      capacity: Number(formData.get("capacity") || 0) || undefined,
      price: Number(formData.get("price") || 0),
    };

    try {
      const res = await fetch("/api/coach/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Impossible de créer la séance");
        return;
      }

      event.currentTarget.reset();
      setIsOpen(false);
      router.refresh();
    } catch {
      setError("Impossible de créer la séance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/50">Espace coach</p>
          <h2 className="text-2xl font-black text-foreground mt-1">Ajouter une séance</h2>
          <p className="text-foreground/60 text-sm mt-1">Créez une séance qui pourra ensuite être vue par les clients et l’admin.</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? "Fermer" : "Nouveau créneau"}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-foreground/70">Titre</span>
            <input name="title" required className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:border-purple-400" placeholder="Séance de remise en forme" />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-foreground/70">Description</span>
            <textarea name="description" rows={3} className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:border-purple-400" placeholder="Décris la séance, l’objectif ou le niveau attendu" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground/70">Date et heure</span>
            <input name="startsAt" type="datetime-local" required min={minStartsAt} max={maxStartsAt} defaultValue={minStartsAt} className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:border-purple-400" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground/70">Prix</span>
            <input name="price" type="number" min="0" step="0.01" required className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:border-purple-400" placeholder="25" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground/70">Durée (minutes)</span>
            <input name="durationMinutes" type="number" min="1" step="1" className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:border-purple-400" placeholder="60" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground/70">Capacité</span>
            <input name="capacity" type="number" min="1" step="1" className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:border-purple-400" placeholder="10" />
          </label>

          {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setIsOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la séance"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}