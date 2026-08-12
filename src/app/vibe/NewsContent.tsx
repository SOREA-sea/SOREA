"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { NewsArticle, ArticleCat, WeatherData } from "./types";
import { C } from "./styles";
import WeatherBadge from "./WeatherBadge";
import rawNewsArticles from "./newsData.json";

const defaultNewsArticles = rawNewsArticles as NewsArticle[];

function ArticleCard({ article, tall = false, onClick }: { article: NewsArticle; tall?: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: C.cardBg, borderRadius: 22, overflow: "hidden", cursor: "pointer",
        border: hovered ? "1.5px solid #9B7FF0" : `1.5px solid ${C.border}`,
        boxShadow: hovered ? "0 16px 40px rgba(123,63,228,0.14)" : "0 2px 10px rgba(0,0,0,0.05)",
        transition: "all 0.22s ease", transform: hovered ? "translateY(-4px)" : "none" }}>
      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", minHeight: tall ? 160 : 128 }}>
        <div style={{ position: "relative", background: "linear-gradient(145deg,#EDE6FF,#D9C6FF)", overflow: "hidden" }}>
          {article.img ? (
            <Image src={article.img} alt={article.imgAlt} fill sizes="140px" style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
              {article.emoji}
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.12))" }} />
        </div>
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.purpleLight, color: "#7B3FE4", fontSize: 10, fontWeight: 800,
                  padding: "4px 10px", borderRadius: 999, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3 }}>
                {article.catLabel}
              </span>
              <span style={{ fontSize: 10, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{article.date}</span>
            </div>
            <h4 style={{ fontWeight: 900, fontSize: tall ? 16 : 15, color: C.textDark, lineHeight: 1.3,
                margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h4>
            <p style={{ fontSize: 12, color: C.textGray, margin: 0, lineHeight: 1.55,
                fontFamily: "'DM Sans', sans-serif", display: "-webkit-box",
                WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {article.desc}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 11, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{article.readMin} min</span>
            <span style={{ fontSize: 11, color: "#E879A0", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 3 }}>
              {article.likes > 0 ? `♥ ${article.likes}` : "♡"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySimilarState() {
  return (
    <div style={{ border: `1px dashed ${C.border}`, background: "rgba(255,255,255,0.7)", borderRadius: 18, padding: 22, textAlign: "center", color: C.textGray }}>
      Aucun article
    </div>
  );
}

function SimilarCarousel({ items, onOpenSimilar }: { items: NewsArticle[]; onOpenSimilar: (a: NewsArticle) => void }) {
  if (items.length === 0) return <EmptySimilarState />;
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
      {items.map((sim) => (
        <div key={sim.title} onClick={() => onOpenSimilar(sim)} style={{ flex: "0 0 220px" }}>
          <ArticleCard article={sim} onClick={() => onOpenSimilar(sim)} />
        </div>
      ))}
    </div>
  );
}

function ArticleView({ article, similar, onBack, onOpenSimilar }:
  { article: NewsArticle; similar: NewsArticle[]; onBack: () => void; onOpenSimilar: (a: NewsArticle) => void }) {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <button
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 18,
          padding: "10px 16px",
          borderRadius: 999,
          border: `1px solid ${C.border}`,
          background: C.cardBg,
          color: C.textDark,
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.borderColor = "#7B3FE4";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(123,63,228,0.14)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>‹</span>
        Retour aux articles
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 320px) 1fr", gap: 24, alignItems: "start", marginBottom: 24 }}>
        <div style={{ height: 340, borderRadius: 24, overflow: "hidden", background: "linear-gradient(145deg,#C9A8FF,#A87AFF)", position: "relative" }}>
          {article.img
            ? <Image src={article.img} alt={article.imgAlt} fill sizes="320px" style={{ objectFit: "cover" }} />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 96 }}>{article.emoji}</div>
          }
        </div>
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ background: C.purpleLight, color: "#7B3FE4", fontSize: 11, fontWeight: 800,
                padding: "4px 12px", borderRadius: 99, fontFamily: "'DM Sans', sans-serif" }}>
              {article.catLabel}
            </span>
            <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{article.date}</span>
            <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>· {article.readMin} min de lecture</span>
          </div>
          <h2 style={{ fontWeight: 950, fontSize: 30, color: C.textDark, lineHeight: 1.2,
              margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h2>
          <p style={{ fontSize: 16, color: C.textGray, lineHeight: 1.8, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{article.desc}</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 14, maxWidth: 780 }}>
        {article.paragraphs.map((p, i) => (
          <div key={i} style={{ background: i === 0 ? "rgba(237,230,255,0.36)" : "rgba(255,255,255,0.76)", borderRadius: 18, padding: i === 0 ? "18px 20px" : "14px 18px", borderLeft: i === 0 ? "4px solid #A87AFF" : `1px solid ${C.border}` }}>
            <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: 0,
                fontFamily: "'DM Sans', sans-serif" }}>
              {p.text}
            </p>
            {p.imgEmoji && (
              <div style={{ marginTop: 14, background: "linear-gradient(145deg,#EDE6FF,#E6FAF8)", borderRadius: 14,
                  height: 150, display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", border: "1px dashed #C9A8FF" }}>
                <span style={{ fontSize: 44 }}>{p.imgEmoji}</span>
                <span style={{ fontSize: 11, color: C.textGray, marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
                  {p.imgLabel ?? "Photo d'illustration - insérer image ici"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 44, borderTop: `1.5px solid ${C.border}`, paddingTop: 28 }}>
        <h3 style={{ fontWeight: 900, fontSize: 17, color: C.textDark, marginBottom: 18,
            fontFamily: "'DM Sans', sans-serif" }}>
          Articles similaires
        </h3>
        <SimilarCarousel items={similar} onOpenSimilar={onOpenSimilar} />
      </div>
    </div>
  );
}

type SortMode = "recent" | "ancien" | "populaire";
type CatFilter = "all" | ArticleCat;

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: "9px 14px",
    borderRadius: 999,
    border: active ? "1px solid #7B3FE4" : `1px solid ${C.border}`,
    background: active ? "linear-gradient(135deg, #7B3FE4, #A87AFF)" : C.cardBg,
    color: active ? "#fff" : C.textGray,
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: active ? "0 8px 22px rgba(123,63,228,0.18)" : "none",
    transition: "all 0.2s ease",
  };
}

export default function NewsContent({ weatherData, onOpenWeather }: { weatherData: WeatherData | null; onOpenWeather: () => void }) {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(defaultNewsArticles);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState<CatFilter>("all");
  const [sortMode,  setSortMode]  = useState<SortMode>("recent");

  useEffect(() => {
    let active = true;
    fetch("/api/vibe-news")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (active && Array.isArray(data.articles)) {
          setNewsArticles([...data.articles, ...defaultNewsArticles]);
        }
      })
      .catch(() => {
        // Les articles statiques restent disponibles si l'API est momentanément indisponible.
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...newsArticles]
    .filter(a => {
      const matchCat = catFilter === "all" || a.cat === catFilter;
      const matchSearch = !query || a.title.toLowerCase().includes(query) || a.desc.toLowerCase().includes(query);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortMode === "recent")    return b.dateSort - a.dateSort;
      if (sortMode === "ancien")    return a.dateSort - b.dateSort;
      if (sortMode === "populaire") return b.likes - a.likes;
      return 0;
    });
  }, [search, catFilter, sortMode, newsArticles]);

  const similar = currentArticle
    ? newsArticles.filter(a => a.cat === currentArticle.cat && a.title !== currentArticle.title)
    : [];

  const cats: { key: CatFilter; label: string }[] = [
    { key: "all",       label: "Tout" },
    { key: "bien-etre", label: "Bien-être" },
    { key: "mindset",   label: "Mindset" },
    { key: "methode",   label: "Méthode" },
  ];

  if (currentArticle) {
    return (
      <ArticleView
        article={currentArticle}
        similar={similar}
        onBack={() => setCurrentArticle(null)}
        onOpenSimilar={a => { setCurrentArticle(a); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.cardBg,
              border: `1px solid ${C.border}`, borderRadius: 30, padding: "10px 16px",
              flex: 1, minWidth: 240, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <span style={{ color: C.textGray, fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Rechercher un article…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent",
                fontSize: 14, color: C.textDark, width: "100%", fontFamily: "'DM Sans', sans-serif" }} />
          </div>
          <WeatherBadge data={weatherData} onClick={onOpenWeather} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.textGray, textTransform: "uppercase", letterSpacing: 1 }}>Filtrer</span>
          {cats.map(c => (
            <button key={c.key} onClick={() => setCatFilter(c.key)}
              style={pillStyle(catFilter === c.key)}>
              {c.label}
            </button>
          ))}
          <button onClick={() => { setCatFilter("all"); setSortMode("recent"); setSearch(""); }}
            style={{
              padding: "9px 14px",
              borderRadius: 999,
              border: `1px dashed ${C.border}`,
              background: "transparent",
              color: C.textGray,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
            Réinitialiser
          </button>
          <div style={{ flex: 1 }} />
          <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}
            style={{ padding: "9px 14px", borderRadius: 30, border: `1px solid ${C.border}`,
              background: C.cardBg, fontSize: 13, color: C.textGray, cursor: "pointer",
              outline: "none", fontFamily: "'DM Sans', sans-serif" }}>
            <option value="recent">Plus récent</option>
            <option value="ancien">Plus ancien</option>
            <option value="populaire">Populaire</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>
          {filtered.length} article{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          {catFilter !== "all" ? ` · catégorie ${cats.find(c => c.key === catFilter)?.label}` : ""}
          {search ? ` · recherche “${search}”` : ""}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", background: C.purpleLight,
            borderRadius: 18, color: C.textGray, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          Aucun article ne correspond à votre recherche.
        </div>
      ) : (
        <div style={{ columns: "3 260px", columnGap: 16 }}>
          {filtered.map((article, i) => (
            <div key={article.title} style={{ breakInside: "avoid", marginBottom: 16 }}>
              <ArticleCard article={article} tall={i % 3 === 0}
                onClick={() => { setCurrentArticle(article); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
