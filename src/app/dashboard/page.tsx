import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  // Coaches no longer have a separate dashboard page; keep showing the standard dashboard

  // Charger les stats direct côté serveur
  const [favoriteProducts, favoriteCoaches, favoriteSessions, reservations, cart] =
    await Promise.all([
      prisma.favoriteProduct.count({ where: { userId: user.id } }),
      prisma.favoriteCoach.count({ where: { userId: user.id } }),
      prisma.favoriteSession.count({ where: { userId: user.id } }),
      prisma.sessionBooking.count({ where: { userId: user.id, status: "pending" } }),
      prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true },
      }),
    ]);

  const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const totalFavorites = favoriteProducts + favoriteCoaches + favoriteSessions;

  // Charger les prochaines séances réservées
  const upcomingBookings = await prisma.sessionBooking.findMany({
    where: {
      userId: user.id,
      status: "confirmed",
      session: { startsAt: { gte: new Date() } },
    },
    include: {
      session: {
        select: {
          title: true,
          startsAt: true,
          sessionType: true,
          durationMinutes: true,
          coach: {
            select: {
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
      },
    },
    take: 3,
    orderBy: { session: { startsAt: "asc" } },
  });

  const stats = [
    {
      label: "Favoris",
      value: totalFavorites,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "bg-pink-100 text-pink-600",
      href: "/dashboard/favorites",
    },
    {
      label: "Réservations",
      value: reservations,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-violet-100 text-violet-600",
      href: "/dashboard/reservations",
    },
    {
      label: "Panier",
      value: cartItemsCount,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
      color: "bg-green-100 text-green-600",
      href: "#",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Tableau de bord</p>
        <h1 className="text-3xl md:text-4xl font-black section-title mt-1">
          Bonjour, {user.firstName} 👋
        </h1>
        <p className="text-foreground/60 mt-2">
          Bienvenue dans votre espace bien-être. Voici un aperçu de votre activité.
        </p>
      </header>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass-panel rounded-3xl p-6 flex items-center gap-5 hover:shadow-lg transition-all hover:scale-[1.02] group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">{stat.value}</p>
              <p className="text-foreground/50 text-sm font-medium">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming sessions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Prochaines séances</h2>
          <Link href="/dashboard/sessions" className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">
            Tout voir →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-foreground/70 font-medium">Aucune séance à venir</p>
            <p className="text-foreground/50 text-sm mt-1">Explorez nos séances de coaching pour commencer !</p>
            <Link href="/#sessions" className="btn-primary inline-block mt-4 text-sm">
              Découvrir les séances
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => {
              const startsAt = booking.session.startsAt ? new Date(booking.session.startsAt) : null;
              return (
                <div key={booking.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{booking.session.title}</p>
                      <p className="text-foreground/50 text-sm">
                        {booking.session.coach.user.firstName} {booking.session.coach.user.lastName}
                        {booking.session.sessionType && ` · ${booking.session.sessionType}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {startsAt && (
                      <>
                        <p className="font-semibold text-sm text-foreground">
                          {startsAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </p>
                        <p className="text-foreground/50 text-xs">
                          {startsAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          {booking.session.durationMinutes && ` · ${booking.session.durationMinutes} min`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Reservations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Réservations en attente</h2>
          <Link href="/dashboard/reservations" className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">
            Tout voir →
          </Link>
        </div>

        {reservations === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center">
            <p className="text-foreground/70 font-medium">Aucune réservation en attente</p>
            <p className="text-foreground/50 text-sm mt-1">Cliquez sur Réserver sur une séance pour l’ajouter ici.</p>
            <Link href="/#sessions" className="btn-primary inline-block mt-4 text-sm">
              Voir les séances
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-5">
            <p className="text-foreground/70 font-medium">Vous avez {reservations} réservation{reservations > 1 ? "s" : ""} en attente.</p>
            <Link href="/dashboard/reservations" className="btn-primary inline-block mt-4 text-sm">
              Gérer mes réservations
            </Link>
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-xl font-bold mb-4">Accès rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/profile" className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-foreground">Modifier mon profil</p>
              <p className="text-foreground/50 text-sm">Gérez vos informations personnelles</p>
            </div>
          </Link>

          <Link href="/#products" className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 transition-transform group-hover:scale-110 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-foreground">Boutique</p>
              <p className="text-foreground/50 text-sm">Découvrez nos essentiels bien-être</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}