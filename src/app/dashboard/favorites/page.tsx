"use client";

import { useState, useEffect } from "react";

interface FavoriteProduct {
  id: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
  };
}

interface FavoriteCoach {
  id: number;
  createdAt: string;
  coach: {
    id: number;
    bio: string | null;
    specialty: string | null;
    averageRating: number | null;
    user: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}

interface FavoriteSession {
  id: number;
  createdAt: string;
  session: {
    id: number;
    title: string;
    description: string | null;
    sessionType: string | null;
    startsAt: string | null;
    durationMinutes: number | null;
    price: number;
    averageRating: number | null;
  };
}

interface PackFavoriteCoach extends FavoriteCoach {
  type: "coach";
}

interface PackFavoriteSession extends FavoriteSession {
  type: "session";
}

type PackFavorite = PackFavoriteCoach | PackFavoriteSession;

type TabType = "products" | "packs";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [products, setProducts] = useState<FavoriteProduct[]>([]);
  const [coaches, setCoaches] = useState<FavoriteCoach[]>([]);
  const [sessions, setSessions] = useState<FavoriteSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const res = await fetch("/api/dashboard/favorites");
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      setProducts(data.products);
      setCoaches(data.coaches);
      setSessions(data.sessions);
    } catch (error) {
      console.error("Erreur chargement favoris:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (
    favoriteId: number,
    favoriteType: "product" | "coach" | "session"
  ) => {
    try {
      const res = await fetch(`/api/dashboard/favorites?type=${favoriteType}&id=${favoriteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur");

      if (favoriteType === "product") {
        setProducts((prev) => prev.filter((p) => p.id !== favoriteId));
      }
      if (favoriteType === "coach") {
        setCoaches((prev) => prev.filter((c) => c.id !== favoriteId));
      }
      if (favoriteType === "session") {
        setSessions((prev) => prev.filter((s) => s.id !== favoriteId));
      }
    } catch (error) {
      console.error("Erreur suppression favori:", error);
    }
  };

  const packs: PackFavorite[] = [
    ...coaches.map((fav) => ({ ...fav, type: "coach" as const })),
    ...sessions.map((fav) => ({ ...fav, type: "session" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "products", label: "Produits", count: products.length },
    { key: "packs", label: "Packs", count: packs.length },
  ];

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
        <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Collection</p>
        <h1 className="text-3xl md:text-4xl font-black section-title mt-1">Mes favoris</h1>
        <p className="text-foreground/60 mt-2">
          Retrouvez vos produits et packs préférés.
        </p>
      </header>

      {/* Tab navigation */}
      <div className="flex bg-white/50 p-1 rounded-full border border-white/60">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all cursor-pointer ${activeTab === tab.key
                ? "bg-white shadow-sm text-purple-700"
                : "text-foreground/60 hover:text-foreground"
              }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-purple-100 text-purple-700" : "bg-white/60 text-foreground/50"
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "products" && (
        <div>
          {products.length === 0 ? (
            <EmptyState icon="product" text="Aucun produit favori pour le moment" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((fav) => (
                <div key={fav.id} className="glass-panel rounded-2xl p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/80 shrink-0">
                    <img
                      src={fav.product.imageUrl || "/images/product_1.webp"}
                      alt={fav.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{fav.product.name}</p>
                    <p className="text-foreground/50 text-sm line-clamp-1 mt-0.5">{fav.product.description}</p>
                    <p className="text-purple-600 font-bold text-sm mt-1">{fav.product.price} €</p>
                  </div>
                  <button
                    onClick={() => removeFavorite(fav.id, "product")}
                    className="self-start p-2 rounded-xl hover:bg-red-50 text-foreground/40 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                    title="Retirer des favoris"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "packs" && (
        <div>
          {packs.length === 0 ? (
            <EmptyState icon="pack" text="Aucun pack favori pour le moment" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packs.map((fav) => {
                const isCoach = fav.type === "coach";
                const title = isCoach
                  ? `${fav.coach.user.firstName} ${fav.coach.user.lastName}`
                  : fav.session.title;
                const subtitle = isCoach
                  ? fav.coach.specialty || "Coach"
                  : `${fav.session.sessionType || "Séance"}${fav.session.durationMinutes ? ` · ${fav.session.durationMinutes} min` : ""} · ${fav.session.price} €`;
                const imageUrl = isCoach
                  ? fav.coach.user.avatarUrl || "/images/logo_sorea.webp"
                  : "/images/session_placeholder.webp";

                return (
                  <div key={`${fav.type}-${fav.id}`} className="glass-panel rounded-2xl p-4 flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/80 shrink-0">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-700">
                          Pack
                        </span>
                        <span className="text-xs text-foreground/50 uppercase tracking-[0.18em]">
                          {isCoach ? "Coach" : "Séance"}
                        </span>
                      </div>
                      <p className="font-bold text-foreground truncate">{title}</p>
                      <p className="text-foreground/50 text-sm mt-1 line-clamp-2">{subtitle}</p>
                    </div>
                    <button
                      onClick={() => removeFavorite(fav.id, fav.type)}
                      className="self-start p-2 rounded-xl hover:bg-red-50 text-foreground/40 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      title="Retirer des favoris"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="glass-panel rounded-3xl p-10 text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
        {icon === "product" && (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )}
        {icon === "coach" && (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        {icon === "session" && (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {icon === "pack" && (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v13h18V7M3 7l9-4 9 4M12 3v4" />
          </svg>
        )}
      </div>
      <p className="text-foreground/60 font-medium">{text}</p>
      <p className="text-foreground/40 text-sm mt-1">Explorez le site pour ajouter des éléments à vos favoris !</p>
    </div>
  );
}