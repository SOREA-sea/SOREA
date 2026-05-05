"use client";

import { useState, useEffect } from "react";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
  _count: {
    bookings: number;
    favoriteProducts: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filter, setFilter] = useState<"all" | "user" | "coach" | "admin">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      setMessage({ type: "error", text: "Impossible de charger les utilisateurs" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (userId: number, currentActive: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
      );
      setMessage({ type: "success", text: `Utilisateur ${!currentActive ? "activé" : "désactivé"}` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const changeRole = async (userId: number, newRole: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setMessage({ type: "success", text: "Rôle mis à jour" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Supprimer définitivement ${userName} ?`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setMessage({ type: "success", text: "Utilisateur supprimé" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter = filter === "all" || u.role === filter;
    const matchesSearch =
      search === "" ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3 mb-1">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
            Admin
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black section-title">Gestion des utilisateurs</h1>
        <p className="text-foreground/60 mt-2">
          {users.length} utilisateurs inscrits sur la plateforme.
        </p>
      </header>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50/80 text-green-700 border border-green-200"
            : "bg-red-50/80 text-red-600 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3.5 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
          />
        </div>
        <div className="flex bg-white/50 p-1 rounded-full border border-white/60 shrink-0">
          {(["all", "user", "coach", "admin"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                filter === f
                  ? "bg-white shadow-sm text-purple-700"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {f === "all" ? "Tous" : f === "user" ? "Membres" : f === "coach" ? "Coachs" : "Admins"}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4">Utilisateur</th>
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4">Rôle</th>
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4 hidden md:table-cell">Activité</th>
                <th className="text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4 hidden lg:table-cell">Inscrit le</th>
                <th className="text-right text-xs uppercase tracking-wider text-foreground/50 font-semibold px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className={`border-b border-white/15 last:border-0 transition-colors ${
                  !u.isActive ? "opacity-50" : "hover:bg-white/20"
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/60">
                          <img
                            src={u.avatarUrl || "/images/logo_sorea.webp"}
                            alt={`${u.firstName} ${u.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${u.isActive ? "bg-green-400" : "bg-gray-300"}`}></span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-foreground/50 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      disabled={actionLoading === u.id}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/60 border border-white/80 outline-none cursor-pointer focus:ring-2 focus:ring-purple-300"
                    >
                      <option value="user">Membre</option>
                      <option value="coach">Coach</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-xs text-foreground/60 space-y-0.5">
                      <p>{u._count.bookings} réservation{u._count.bookings > 1 ? "s" : ""}</p>
                      <p>{u._count.favoriteProducts} favori{u._count.favoriteProducts > 1 ? "s" : ""}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-foreground/50 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(u.id, u.isActive)}
                        disabled={actionLoading === u.id}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          u.isActive
                            ? "hover:bg-yellow-50 text-yellow-600"
                            : "hover:bg-green-50 text-green-600"
                        }`}
                        title={u.isActive ? "Désactiver" : "Activer"}
                      >
                        {u.isActive ? (
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                        disabled={actionLoading === u.id}
                        className="p-2 rounded-xl hover:bg-red-50 text-foreground/40 hover:text-red-500 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-foreground/50">
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
