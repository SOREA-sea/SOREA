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

type TabType = "products" | "coaches" | "sessions";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [products, setProducts] = useState<FavoriteProduct[]>([]);
  const [coaches, setCoaches] = useState<FavoriteCoach[]>([]);
  const [sessions, setSessions] = useState<FavoriteSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
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

  const removeFavorite = async (type: TabType, favoriteId: number) => {
    const typeMap: Record<TabType, string> = {
      products: "product",
      coaches: "coach",
      sessions: "session",
    };

    try {
      const res = await fetch(`/api/dashboard/favorites?type=${typeMap[type]}&id=${favoriteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur");

      // Update local state
      if (type === "products") setProducts((prev) => prev.filter((p) => p.id !== favoriteId));
      if (type === "coaches") setCoaches((prev) => prev.filter((c) => c.id !== favoriteId));
      if (type === "sessions") setSessions((prev) => prev.filter((s) => s.id !== favoriteId));
    } catch (error) {
      console.error("Erreur suppression favori:", error);
    }
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "products", label: "Produits", count: products.length },
    { key: "coaches", label: "Coachs", count: coaches.length },
    { key: "sessions", label: "Séances", count: sessions.length },
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
          Retrouvez vos produits, coachs et séances préférés.
        </p>
      </header>

      {/* Tab navigation */}
      <div className="flex bg-white/50 p-1 rounded-full border border-white/60">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white shadow-sm text-purple-700"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? "bg-purple-100 text-purple-700" : "bg-white/60 text-foreground/50"
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
                    onClick={() => removeFavorite("products", fav.id)}
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

      {activeTab === "coaches" && (
        <div>
          {coaches.length === 0 ? (
            <EmptyState icon="coach" text="Aucun coach favori pour le moment" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coaches.map((fav) => (
                <div key={fav.id} className="glass-panel rounded-2xl p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/80 shrink-0">
                    <img
                      src={fav.coach.user.avatarUrl || "/images/logo_sorea.webp"}
                      alt={`${fav.coach.user.firstName} ${fav.coach.user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">
                      {fav.coach.user.firstName} {fav.coach.user.lastName}
                    </p>
                    <p className="text-foreground/50 text-sm mt-0.5">{fav.coach.specialty}</p>
                    {fav.coach.averageRating && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-foreground/70">{fav.coach.averageRating}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFavorite("coaches", fav.id)}
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

      {activeTab === "sessions" && (
        <div>
          {sessions.length === 0 ? (
            <EmptyState icon="session" text="Aucune séance favorite pour le moment" />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sessions.map((fav) => {
                const startsAt = fav.session.startsAt ? new Date(fav.session.startsAt) : null;
                return (
                  <div key={fav.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{fav.session.title}</p>
                        <p className="text-foreground/50 text-sm">
                          {fav.session.sessionType}
                          {fav.session.durationMinutes && ` · ${fav.session.durationMinutes} min`}
                          {" · "}
                          {fav.session.price} €
                        </p>
                        {startsAt && (
                          <p className="text-foreground/40 text-xs mt-0.5">
                            {startsAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite("sessions", fav.id)}
                      className="p-2 rounded-xl hover:bg-red-50 text-foreground/40 hover:text-red-500 transition-colors cursor-pointer shrink-0"
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
      </div>
      <p className="text-foreground/60 font-medium">{text}</p>
      <p className="text-foreground/40 text-sm mt-1">Explorez le site pour ajouter des éléments à vos favoris !</p>
    </div>
  );
}