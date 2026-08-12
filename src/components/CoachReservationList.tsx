"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CoachReservationList({ reservations }: { reservations: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/dashboard/reservations?reservationId=${id}`, { method: "DELETE" });
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
      {reservations.map((r) => (
        <div key={r.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-foreground">{r.session.title}</p>
            <p className="text-foreground/50 text-sm">{r.status}</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => handleDelete(r.id)} disabled={loadingId === r.id}>{loadingId === r.id ? "Suppression..." : "Retirer"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
