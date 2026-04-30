"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CoachSessionList({ sessions }: { sessions: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette séance ? Cette action est irréversible.")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/coach/sessions?sessionId=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erreur suppression");
        return;
      }
      router.refresh();
    } catch (e) {
      alert("Erreur suppression");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {sessions.map((s) => (
        <div key={s.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-foreground">{s.title}</p>
            <p className="text-foreground/50 text-sm">{s.isPublished ? "Publiée" : "Brouillon"}{s.capacity ? ` · Capacité ${s.capacity}` : ""}</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => navigator.clipboard?.writeText(window.location.origin + `/sessions/${s.id}`)}>Copier lien</button>
            <button className="btn-danger" onClick={() => handleDelete(s.id)} disabled={loadingId === s.id}>{loadingId === s.id ? "Suppression..." : "Supprimer"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
