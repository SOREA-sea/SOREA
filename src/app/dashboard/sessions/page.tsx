"use client";
import Link from "next/link";

import { useState, useEffect } from "react";

interface Booking {
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
}

export default function SessionsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/dashboard/bookings");
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Erreur chargement réservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => b.session.startsAt && new Date(b.session.startsAt) >= now
  );
  const past = bookings.filter(
    (b) => !b.session.startsAt || new Date(b.session.startsAt) < now
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Coaching</p>
        <h1 className="text-3xl md:text-4xl font-black section-title mt-1">Mes séances</h1>
        <p className="text-foreground/60 mt-2">
          Consultez vos séances réservées et suivez votre parcours bien-être.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5 text-purple-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Aucune séance réservée</h2>
          <p className="text-foreground/50 mt-2 max-w-md mx-auto">
            Vous n'avez pas encore réservé de séance de coaching. Explorez nos programmes pour trouver celle qui vous correspond.
          </p>
          <Link href="/#sessions" className="btn-primary inline-block mt-6">
            Découvrir les séances
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming sessions */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                À venir
                <span className="text-foreground/40 font-normal text-sm ml-1">({upcoming.length})</span>
              </h2>
              <div className="space-y-3">
                {upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} variant="upcoming" />
                ))}
              </div>
            </section>
          )}

          {/* Past sessions */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                Passées
                <span className="text-foreground/40 font-normal text-sm ml-1">({past.length})</span>
              </h2>
              <div className="space-y-3">
                {past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} variant="past" />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function BookingCard({ booking, variant }: { booking: Booking; variant: "upcoming" | "past" }) {
  const startsAt = booking.session.startsAt ? new Date(booking.session.startsAt) : null;
  const isPast = variant === "past";

  return (
    <div className={`glass-panel rounded-2xl p-5 flex items-center justify-between transition-all ${isPast ? "opacity-60" : "hover:shadow-lg"}`}>
      <div className="flex items-center gap-4">
        {/* Coach avatar */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/80 shadow shrink-0">
          <img
            src={booking.session.coach.user.avatarUrl || "/images/logo_sorea.webp"}
            alt={`${booking.session.coach.user.firstName} ${booking.session.coach.user.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="font-bold text-foreground">{booking.session.title}</p>
          <p className="text-foreground/50 text-sm">
            {booking.session.coach.user.firstName} {booking.session.coach.user.lastName}
            {booking.session.coach.specialty && ` · ${booking.session.coach.specialty}`}
          </p>
          <div className="flex items-center gap-3 mt-1">
            {booking.session.sessionType && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                {booking.session.sessionType}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              booking.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
            }`}>
              {booking.status === "confirmed" ? "Confirmée" : booking.status === "pending" ? "En attente" : booking.status}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-4">
        {startsAt && (
          <>
            <p className="font-semibold text-foreground">
              {startsAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <p className="text-foreground/50 text-sm">
              {startsAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </>
        )}
        {booking.session.durationMinutes && (
          <p className="text-foreground/40 text-xs mt-0.5">{booking.session.durationMinutes} min</p>
        )}
        <p className="text-purple-600 font-bold text-sm mt-1">{booking.session.price} €</p>
      </div>
    </div>
  );
}