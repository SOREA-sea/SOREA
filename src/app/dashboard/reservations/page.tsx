"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useEffect as useEffectHook } from "react";
import { useRouter } from "next/navigation";

type Reservation = {
  id: number;
  status: string;
  bookedAt: string;
  session: {
    id: number;
    title: string;
    description: string | null;
    sessionType: string | null;
    startsAt: string | null;
    durationMinutes: number | null;
    price: number;
    averageRating: number | null;
    coach: {
      user: {
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
      };
      specialty: string | null;
    };
  };
};

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  // No coach-specific redirect — coaches will use the unified dashboard reservations page

  async function fetchReservations() {
    try {
      const res = await fetch("/api/dashboard/reservations");
      if (!res.ok) throw new Error("Erreur chargement réservations");
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error("Erreur chargement réservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAll = async () => {
    const res = await fetch("/api/dashboard/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmAll: true }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Impossible de confirmer les réservations");
      return;
    }

    await fetchReservations();
    alert("Réservations confirmées avec succès");
  };

  const removeReservation = async (reservationId: number) => {
    const res = await fetch(`/api/dashboard/reservations?reservationId=${reservationId}`, {
      method: "DELETE",
    });

    if (!res.ok) return;
    await fetchReservations();
  };

  const pendingCount = reservations.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Coaching</p>
          <h1 className="text-3xl md:text-4xl font-black section-title mt-1">Mes réservations</h1>
          <p className="text-foreground/60 mt-2">
            Gardez vos séances ici avant de les confirmer, comme un panier séparé.
          </p>
        </div>
        {pendingCount > 0 && (
          <button className="btn-primary" onClick={confirmAll}>
            Confirmer tout
          </button>
        )}
      </header>

      {reservations.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center">
          <h2 className="text-xl font-bold text-foreground">Aucune réservation en attente</h2>
          <p className="text-foreground/50 mt-2 max-w-md mx-auto">
            Cliquez sur Réserver depuis une séance pour l’ajouter ici, puis confirmez plus tard.
          </p>
          <Link href="/#sessions" className="btn-primary inline-block mt-6">
            Voir les séances
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const startsAt = reservation.session.startsAt ? new Date(reservation.session.startsAt) : null;

            return (
              <div key={reservation.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-foreground">{reservation.session.title}</p>
                  <p className="text-foreground/50 text-sm">
                    {reservation.session.coach.user.firstName} {reservation.session.coach.user.lastName}
                    {reservation.session.coach.specialty ? ` · ${reservation.session.coach.specialty}` : ""}
                  </p>
                  <p className="text-foreground/40 text-xs mt-1">
                    {reservation.status === "pending" ? "En attente de confirmation" : reservation.status}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {startsAt && (
                    <p className="font-semibold text-foreground">
                      {startsAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                  <p className="text-purple-600 font-bold">{reservation.session.price} €</p>
                  <div className="mt-2 flex gap-2 justify-end">
                    <button
                      className="btn-secondary"
                      onClick={() => removeReservation(reservation.id)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}