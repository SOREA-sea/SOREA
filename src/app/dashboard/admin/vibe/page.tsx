"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

type AdminNews = {
  id: number;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  author: { firstName: string; lastName: string };
};

export default function AdminVibePage() {
  const [news, setNews] = useState<AdminNews[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("bien-etre");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadNews = useCallback(async () => {
    const response = await fetch("/api/admin/vibe-news");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Impossible de charger les actualités");
    setNews(data.news);
  }, []);

  useEffect(() => {
    // Le chargement initial synchronise l'interface avec l'API d'administration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNews().catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [loadNews]);

  async function publish(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/vibe-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Publication impossible");
      setTitle("");
      setContent("");
      setMessage("La news est publiée dans Vibe.");
      await loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publication impossible");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(item: AdminNews) {
    setError("");
    const response = await fetch("/api/admin/vibe-news", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isPublished: !item.isPublished }),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Modification impossible");
    await loadNews();
  }

  async function remove(id: number) {
    if (!window.confirm("Supprimer définitivement cette actualité ?")) return;
    const response = await fetch(`/api/admin/vibe-news?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Suppression impossible");
    await loadNews();
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">Admin</span>
          <h1 className="text-3xl md:text-4xl font-black section-title mt-3">Actualités Vibe</h1>
          <p className="text-foreground/60 mt-2">Rédigez un texte qui apparaîtra dans la partie News de Vibe.</p>
        </div>
        <Link href="/vibe" className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-semibold text-sm hover:bg-purple-200">
          Voir Vibe
        </Link>
      </header>

      <form onSubmit={publish} className="glass-panel rounded-3xl p-6 md:p-8 space-y-5">
        <div className="grid md:grid-cols-[1fr_220px] gap-4">
          <label className="space-y-2">
            <span className="text-sm font-bold">Titre</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} required
              className="w-full px-4 py-3 rounded-2xl border border-white/50 bg-white/70 outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Titre de la news" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold">Catégorie</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/50 bg-white/70 outline-none focus:ring-2 focus:ring-purple-300">
              <option value="bien-etre">Bien-être</option>
              <option value="mindset">Mindset</option>
              <option value="methode">Méthode</option>
            </select>
          </label>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-bold">Texte</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} minLength={10} maxLength={10000} required rows={9}
            className="w-full px-4 py-3 rounded-2xl border border-white/50 bg-white/70 outline-none focus:ring-2 focus:ring-purple-300 resize-y"
            placeholder="Écrivez votre actualité ici. Séparez les paragraphes avec une ligne vide." />
          <span className="block text-right text-xs text-foreground/40">{content.length} / 10 000</span>
        </label>
        {message && <p className="text-green-700 bg-green-50 rounded-xl px-4 py-3">{message}</p>}
        {error && <p className="text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
        <button disabled={saving} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-bold shadow-lg disabled:opacity-50">
          {saving ? "Publication…" : "Publier dans les news"}
        </button>
      </form>

      <section>
        <h2 className="text-xl font-bold mb-4">Publications</h2>
        {loading ? (
          <p className="text-foreground/50">Chargement…</p>
        ) : news.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-foreground/50">Aucune actualité publiée pour le moment.</div>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <article key={item.id} className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${item.isPublished ? "bg-green-500" : "bg-gray-400"}`} />
                    <span className="text-xs uppercase font-bold text-foreground/40">{item.isPublished ? "Publiée" : "Masquée"}</span>
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-foreground/55 line-clamp-2 mt-1">{item.content}</p>
                  <p className="text-xs text-foreground/40 mt-2">
                    {new Date(item.createdAt).toLocaleDateString("fr-FR")} · {item.author.firstName} {item.author.lastName}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggle(item)} className="px-4 py-2 rounded-xl bg-white/70 text-sm font-semibold hover:bg-white">
                    {item.isPublished ? "Masquer" : "Publier"}
                  </button>
                  <button onClick={() => remove(item.id)} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100">
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
