import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  const currentUser = session!.user;

  // Stats globales
  const [
    totalUsers,
    activeUsers,
    totalCoaches,
    totalProducts,
    activeProducts,
    totalSessions,
    totalBookings,
    totalReviews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.coachProfile.count(),
    prisma.shopProduct.count(),
    prisma.shopProduct.count({ where: { isActive: true } }),
    prisma.coachSession.count(),
    prisma.sessionBooking.count(),
    prisma.coachReview.count(),
  ]);

  // Revenus estimés
  const bookingsWithPrice = await prisma.sessionBooking.findMany({
    include: { session: { select: { price: true } } },
  });
  const totalRevenue = bookingsWithPrice.reduce((sum, b) => sum + b.session.price, 0);

  // Derniers inscrits
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      avatarUrl: true,
    },
  });

  const stats = [
    {
      label: "Utilisateurs",
      value: totalUsers,
      sub: `${activeUsers} actifs`,
      color: "bg-purple-100 text-purple-600",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Produits",
      value: totalProducts,
      sub: `${activeProducts} actifs`,
      color: "bg-green-100 text-green-600",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: "Séances",
      value: totalSessions,
      sub: `${totalBookings} réservations`,
      color: "bg-blue-100 text-blue-600",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Revenus",
      value: `${totalRevenue.toFixed(0)} €`,
      sub: `${totalBookings} transactions`,
      color: "bg-amber-100 text-amber-600",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-1">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
            Admin
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black section-title">Administration</h1>
        <p className="text-foreground/60 mt-2">
          Vue d'ensemble de la plateforme SOREA.
        </p>
      </header>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-panel rounded-3xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-foreground/50 text-sm font-medium">{stat.label}</p>
              </div>
            </div>
            <p className="text-foreground/40 text-xs mt-3">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick access admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/admin/users"
          className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all hover:scale-[1.01] group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-foreground">Gérer les utilisateurs</p>
            <p className="text-foreground/50 text-sm">{totalUsers} utilisateurs inscrits</p>
          </div>
        </Link>

        <Link
          href="/dashboard/admin/products"
          className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all hover:scale-[1.01] group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 transition-transform group-hover:scale-110 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-foreground">Gérer les produits</p>
            <p className="text-foreground/50 text-sm">{totalProducts} produits en catalogue</p>
          </div>
        </Link>
      </div>

      {/* Recent users */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Dernières inscriptions</h2>
          <Link href="/dashboard/admin/users" className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">
            Tout voir →
          </Link>
        </div>
        <div className="glass-panel rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4">Utilisateur</th>
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4 hidden sm:table-cell">Rôle</th>
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4 hidden md:table-cell">Statut</th>
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4 hidden lg:table-cell">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/15 last:border-0 hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-white/60 shrink-0">
                        <img
                          src={u.avatarUrl || "/images/logo_sorea.webp"}
                          alt={`${u.firstName} ${u.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-foreground/50 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : u.role === "coach"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                    }`}>
                      {u.role === "admin" ? "Admin" : u.role === "coach" ? "Coach" : "Membre"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${u.isActive ? "text-green-600" : "text-red-500"}`}>
                      <span className={`w-2 h-2 rounded-full ${u.isActive ? "bg-green-400" : "bg-red-400"}`}></span>
                      {u.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-foreground/50 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
