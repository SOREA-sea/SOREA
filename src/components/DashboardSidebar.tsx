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
  };
}

const navItems = [
  {
    href: "/dashboard",
    label: "Vue d'ensemble",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Mon profil",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/favorites",
    label: "Mes favoris",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/sessions",
    label: "Mes séances",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const adminNavItems = [
  {
    href: "/dashboard/admin",
    label: "Administration",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/users",
    label: "Utilisateurs",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/products",
    label: "Produits",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const isAdmin = user.role === "admin";

  const renderNavItem = (item: { href: string; label: string; icon: React.ReactNode }, isAdminItem = false) => {
    const exactMatchPaths = ["/dashboard", "/dashboard/admin"];
    const isActive = exactMatchPaths.includes(item.href)
      ? pathname === item.href
      : pathname.startsWith(item.href);

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
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col glass-panel rounded-3xl p-6 sticky top-28 self-start" style={{ maxHeight: "calc(100vh - 8rem)" }}>
      {/* Avatar & user info */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-white/30">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white/80 shadow-lg ring-2 ring-white/60 mb-3">
          <Image
            src={user.avatarUrl || "/images/logo_sorea.webp"}
            alt={`${user.firstName} ${user.lastName}`}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold text-lg text-foreground">{user.firstName} {user.lastName}</h3>
        <p className="text-foreground/50 text-xs mt-0.5">{user.email}</p>
        <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isAdmin
            ? "bg-red-100 text-red-700"
            : user.role === "coach"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
        }`}>
          {isAdmin ? "Administrateur" : user.role === "coach" ? "Coach" : "Membre"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2 mt-2">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold px-4">Administration</p>
            </div>
            {adminNavItems.map((item) => renderNavItem(item, true))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="pt-6 border-t border-white/30 mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50/60 transition-all w-full cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}