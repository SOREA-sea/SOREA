"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface DashboardSidebarProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    pseudo?: string | null;
    // Stats
    favoritesCount?: number;
    reservationsCount?: number;
    sessionsCount?: number;
  };
}

// Ajout "panierCount" à l'union de types
type DashboardNavCountKey = "favoritesCount" | "reservationsCount" | "sessionsCount" | "panierCount";

type DashboardStatKey = DashboardNavCountKey;

interface DashboardNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  countKey?: DashboardNavCountKey;
}

const navItems: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Mon tableau de bord",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/favorites",
    label: "Mes favoris",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    countKey: "favoritesCount",
  },
  {
    href: "/dashboard/reservations",
    label: "Mes réservations",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    countKey: "reservationsCount",
  },
  {
    href: "/dashboard/sessions",
    label: "Mes séances",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    countKey: "sessionsCount",
  },
];

const adminNavItems = [
  {
    href: "/dashboard/admin",
    label: "Administration",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/users",
    label: "Utilisateurs",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/products",
    label: "Produits",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleEditProfile = () => router.push("/dashboard/profile");

  const isAdmin = user.role === "admin";
  const isCoach = user.role === "coach";

  // Nom affiché : pseudo si défini, sinon prénom + nom
  const displayName = user.pseudo || `${user.firstName} ${user.lastName}`;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const renderNavItem = (
    item: DashboardNavItem,
    isAdminItem = false
  ) => {
    const exactMatchPaths = ["/dashboard", "/dashboard/admin"];
    const isActive = exactMatchPaths.includes(item.href)
      ? pathname === item.href
      : pathname.startsWith(item.href);

    const count = item.countKey !== undefined
      ? item.countKey === "panierCount"
        ? ((user.reservationsCount ?? 0) + (user.sessionsCount ?? 0))
        : (user[item.countKey as DashboardStatKey] as number | undefined)
      : undefined;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
          isActive
            ? isAdminItem
              ? "bg-red-50/80 shadow-sm text-red-700"
              : "bg-white/80 shadow-sm text-purple-700"
            : isAdminItem
              ? "text-foreground/70 hover:bg-red-50/40 hover:text-red-700"
              : "text-foreground/70 hover:bg-white/40 hover:text-foreground"
        }`}
      >
        <span className={isActive ? (isAdminItem ? "text-red-600" : "text-purple-600") : "text-foreground/50"}>
          {item.icon}
        </span>
        <span className="flex-1">{item.label}</span>
        {count !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isActive
              ? isAdminItem ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
              : "bg-white/60 text-foreground/50"
          }`}>
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className="w-72 shrink-0 hidden lg:flex flex-col glass-panel rounded-3xl p-6 sticky top-28 self-start overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 8rem)" }}
    >
      {/* ── PROFIL ── */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-white/30">
        {/* Photo de profil + bouton modifier */}
        <div className="relative mb-3">
          <button
            onClick={handleEditProfile}
            className="group w-20 h-20 rounded-full overflow-hidden bg-white/80 shadow-lg ring-2 ring-white/60 block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            title="Modifier la photo de profil"
            aria-label="Modifier la photo de profil"
          >
            <Image
              src={user.avatarUrl || "/images/logo_sorea.webp"}
              alt={displayName}
              width={80}
              height={80}
              className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
            />
            {/* Overlay crayon au hover */}
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-3 1 1-3a4 4 0 01.828-1.414z" />
              </svg>
            </span>
          </button>
        </div>

        {/* Nom + bouton modifier infos + messagerie */}
        <div className="flex items-center gap-2 justify-center">
          <h3 className="font-bold text-lg text-foreground leading-tight">{displayName}</h3>
          {/* Bouton modifier infos profil */}
          <button
            onClick={handleEditProfile}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/60 hover:bg-purple-50 text-foreground/40 hover:text-purple-600 transition-all shadow-sm"
            title="Modifier mes informations"
            aria-label="Modifier mes informations"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-3 1 1-3a4 4 0 01.828-1.414z" />
            </svg>
          </button>
          {/* Bouton messagerie icône */}
          <Link
            href="/dashboard/messagerie"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/60 hover:bg-purple-50 text-foreground/40 hover:text-purple-600 transition-all shadow-sm"
            title="Ma messagerie"
            aria-label="Ma messagerie"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>

        <p className="text-foreground/50 text-xs mt-0.5">{user.email}</p>

        <span
          className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isAdmin
              ? "bg-red-100 text-red-700"
              : isCoach
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
          }`}
        >
          {isAdmin ? "Administrateur" : isCoach ? "Coach" : "Membre"}
        </span>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 gap-2 py-5 border-b border-white/30">
        <div className="flex flex-col items-center gap-1 bg-white/50 rounded-2xl p-3">
          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">{user.favoritesCount ?? 0}</span>
          <span className="text-[10px] text-foreground/50 font-medium">Favoris</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-white/50 rounded-2xl p-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">{user.reservationsCount ?? 0}</span>
          <span className="text-[10px] text-foreground/50 font-medium">Réservations</span>
        </div>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 mt-5 space-y-1.5">
        {navItems.map((item) => renderNavItem(item))}

        {/* Bouton dashboard coach */}
        {isCoach && (
          <Link
            href="/dashboard/coach"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium bg-blue-50/80 text-blue-700 hover:bg-blue-100/80 transition-all mt-2"
          >
            <span className="text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <span className="flex-1">Espace coach</span>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}

        {/* Section admin */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2 mt-2">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold px-4">Administration</p>
            </div>
            {adminNavItems.map((item) => renderNavItem(item, true))}
          </>
        )}
      </nav>

      {/* ── DÉCONNEXION ── */}
      <div className="pt-6 border-t border-white/30 mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50/60 transition-all w-full cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}