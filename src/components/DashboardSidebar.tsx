"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

interface DashboardSidebarProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    pseudo?: string | null;
    favoritesCount?: number;
    reservationsCount?: number;
    sessionsCount?: number;
    twoFactorEnabled?: boolean;
  };
  notificationsCount?: number;
}

// Avatar SVG par défaut — silhouette homme ou femme, aléatoire
function DefaultAvatar({ seed, size = 80 }: { seed: string; size?: number }) {
  // déterministe selon le seed (email/prénom) — pas vraiment aléatoire, stable par user
  const isFemale = seed.charCodeAt(0) % 2 === 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-full"
    >
      <rect width="80" height="80" rx="40" fill="#E5E7EB" />
      {isFemale ? (
        // Silhouette féminine
        <>
          <ellipse cx="40" cy="28" rx="13" ry="14" fill="#9CA3AF" />
          <path
            d="M16 72c0-14.912 10.745-24 24-24s24 9.088 24 24"
            fill="#9CA3AF"
          />
          {/* cheveux longs */}
          <path
            d="M27 32 Q26 50 28 54 Q30 56 32 54 Q33 52 33 48"
            stroke="#9CA3AF"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M53 32 Q54 50 52 54 Q50 56 48 54 Q47 52 47 48"
            stroke="#9CA3AF"
            strokeWidth="3"
            fill="none"
          />
        </>
      ) : (
        // Silhouette masculine
        <>
          <ellipse cx="40" cy="28" rx="13" ry="14" fill="#9CA3AF" />
          <path
            d="M16 72c0-14.912 10.745-24 24-24s24 9.088 24 24"
            fill="#9CA3AF"
          />
        </>
      )}
    </svg>
  );
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
    label: "Vue d'ensemble",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/favorites",
    label: "Mes favoris",
    countKey: "favoritesCount" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
<<<<<<< HEAD
    countKey: "favoritesCount",
=======
>>>>>>> f65ced3b ( front side bar dashboard)
  },
  {
    href: "/dashboard/reservations",
    label: "Mes réservations",
    countKey: "reservationsCount" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
<<<<<<< HEAD
    countKey: "reservationsCount",
=======
>>>>>>> f65ced3b ( front side bar dashboard)
  },
  {
    href: "/dashboard/sessions",
    label: "Mes séances",
    countKey: "sessionsCount" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
<<<<<<< HEAD
    countKey: "sessionsCount",
=======
  },
  {
    href: "/dashboard/panier",
    label: "Mon panier",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
>>>>>>> f65ced3b ( front side bar dashboard)
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
  {
    href: "/dashboard/coach/session/create",
    label: "Créer une séance",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ user, notificationsCount = 0 }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

<<<<<<< HEAD
  const handleEditProfile = () => router.push("/dashboard/profile");

  const isAdmin = user.role?.split(',').includes("admin");
  const isCoach = user.role?.split(',').includes("coach");
=======
  const isAdmin = user.role === "admin";
  const isCoach = user.role === "coach";
>>>>>>> f65ced3b ( front side bar dashboard)

  const displayName = user.pseudo || `${user.firstName} ${user.lastName}`;

  // Seed stable pour l'avatar par défaut
  const avatarSeed = useMemo(() => user.email || user.firstName, [user.email, user.firstName]);

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
        {count !== undefined && count > 0 && (
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

        {/* Avatar + crayon (modifier photo) */}
        <div className="relative mb-3 group">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 shadow-lg ring-2 ring-white/60">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <DefaultAvatar seed={avatarSeed} size={80} />
            )}
          </div>

          {/* Bouton crayon — modifier la photo uniquement */}
          <button
            onClick={() => router.push("/dashboard/profile?tab=photo")}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-all"
            title="Modifier la photo de profil"
            aria-label="Modifier la photo de profil"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-3 1 1-3a4 4 0 01.828-1.414z" />
            </svg>
          </button>
        </div>

        {/* Nom + icônes messagerie et notifications */}
        <div className="flex items-center gap-2 justify-center mt-1">
          <h3 className="font-bold text-lg text-foreground leading-tight">{displayName}</h3>

          {/* Icône message — envoyer un message */}
          <Link
            href="/dashboard/messagerie"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/60 hover:bg-purple-50 text-foreground/40 hover:text-purple-600 transition-all shadow-sm"
            title="Messagerie"
            aria-label="Messagerie"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>

          {/* Icône notifications */}
          <Link
            href="/dashboard/notifications"
            className="relative w-7 h-7 rounded-full flex items-center justify-center bg-white/60 hover:bg-purple-50 text-foreground/40 hover:text-purple-600 transition-all shadow-sm"
            title="Notifications"
            aria-label="Notifications"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-fuchsia-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {notificationsCount > 9 ? "9+" : notificationsCount}
              </span>
            )}
          </Link>
        </div>

        <p className="text-foreground/50 text-xs mt-1">{user.email}</p>

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

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 mt-5 space-y-1.5">
<<<<<<< HEAD
        {navItems.map((item) => renderNavItem(item))}
=======
        {navItems.map((item) => {
          // Coachs n'ont pas réservations/séances utilisateur (ils ont leur espace dédié)
          if (isCoach && (item.href === "/dashboard/reservations" || item.href === "/dashboard/sessions")) {
            return null;
          }
          return renderNavItem(item);
        })}
>>>>>>> f65ced3b ( front side bar dashboard)

        {/* Espace coach */}
        {isCoach && (
          <>
            <div className="pt-4 pb-2 mt-2">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold px-4">Espace coach</p>
            </div>
            <Link
              href="/dashboard/coach"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                pathname.startsWith("/dashboard/coach")
                  ? "bg-blue-50/80 shadow-sm text-blue-700"
                  : "text-foreground/70 hover:bg-blue-50/40 hover:text-blue-700"
              }`}
            >
              <span className={pathname.startsWith("/dashboard/coach") ? "text-blue-600" : "text-foreground/50"}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <span className="flex-1">Tableau de bord coach</span>
            </Link>
            <Link
              href="/dashboard/coach/sessions/create"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                pathname === "/dashboard/coach/sessions/create"
                  ? "bg-blue-50/80 shadow-sm text-blue-700"
                  : "text-foreground/70 hover:bg-blue-50/40 hover:text-blue-700"
              }`}
            >
              <span className={pathname === "/dashboard/coach/sessions/create" ? "text-blue-600" : "text-foreground/50"}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="flex-1">Créer une séance</span>
            </Link>
          </>
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