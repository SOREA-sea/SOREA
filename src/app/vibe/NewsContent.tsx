"use client";
import React, { useState } from "react";
import Image from "next/image";
import { NewsArticle, ArticleCat, WeatherData } from "./types";
import { C, labelStyle } from "./styles";
import WeatherBadge from "./WeatherBadge";
import newsArticles from "./newsData.json";

function ArticleCard({ article, tall = false, onClick }: { article: NewsArticle; tall?: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: C.cardBg, borderRadius: 16, overflow: "hidden", cursor: "pointer",
        border: hovered ? "1.5px solid #9B7FF0" : `1.5px solid ${C.border}`,
        boxShadow: hovered ? "0 8px 32px rgba(123,63,228,0.14)" : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.22s", transform: hovered ? "translateY(-3px)" : "none" }}>
      <div style={{ height: tall ? 200 : 140, background: "linear-gradient(145deg,#EDE6FF,#D9C6FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: tall ? 72 : 56, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", top: -20, right: -20 }} />
        {article.img
          ? <Image src={article.img} alt={article.imgAlt} fill sizes="300px" style={{ objectFit: "cover" }} />
          : <span style={{ zIndex: 1 }}>{article.emoji}</span>
        }
        <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.92)",
            color: "#7B3FE4", fontSize: 10, fontWeight: 800, padding: "3px 10px",
            borderRadius: 99, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>
          {article.catLabel}
        </span>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <h4 style={{ fontWeight: 800, fontSize: 13, color: C.textDark, lineHeight: 1.4,
            margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h4>
        <p style={{ fontSize: 11, color: C.textGray, margin: "0 0 10px", lineHeight: 1.5,
            fontFamily: "'DM Sans', sans-serif", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{article.date}</span>
          <span style={{ fontSize: 11, color: "#E879A0", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 3 }}>
            {article.likes > 0 ? `♥ ${article.likes}` : "♡"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ArticleView({ article, similar, onBack, onOpenSimilar }:
  { article: NewsArticle; similar: NewsArticle[]; onBack: () => void; onOpenSimilar: (a: NewsArticle) => void }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <button onClick={onBack} className="back-btn">‹ Retour aux articles</button>
      <div style={{ height: 240, borderRadius: 20, overflow: "hidden",
          background: "linear-gradient(145deg,#C9A8FF,#A87AFF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 96, marginBottom: 22, position: "relative" }}>
        {article.img
          ? <Image src={article.img} alt={article.imgAlt} fill sizes="720px" style={{ objectFit: "cover" }} />
          : <span>{article.emoji}</span>
        }
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ background: C.purpleLight, color: "#7B3FE4", fontSize: 11, fontWeight: 800,
            padding: "4px 12px", borderRadius: 99, fontFamily: "'DM Sans', sans-serif" }}>
          {article.catLabel}
        </span>
        <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{article.date}</span>
        <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>· {article.readMin} min de lecture</span>
      </div>

      <h2 style={{ fontWeight: 950, fontSize: 24, color: C.textDark, lineHeight: 1.3,
          margin: "0 0 22px", fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h2>

      {article.paragraphs.map((p, i) => (
        <div key={i}>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: "0 0 14px",
              fontFamily: "'DM Sans', sans-serif",
              background: i === 0 ? "rgba(237,230,255,0.4)" : "transparent",
              padding: i === 0 ? "16px 18px" : "0",
              borderRadius: i === 0 ? 14 : 0,
              borderLeft: i === 0 ? "3px solid #A87AFF" : "none" }}>
            {p.text}
          </p>
          {p.imgEmoji && (
            <div style={{ background: "linear-gradient(145deg,#EDE6FF,#E6FAF8)", borderRadius: 14,
                height: 150, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", marginBottom: 14, border: "1px dashed #C9A8FF" }}>
              <span style={{ fontSize: 44 }}>{p.imgEmoji}</span>
              <span style={{ fontSize: 11, color: C.textGray, marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
                {p.imgLabel ?? "Photo d'illustration — insérer image ici"}
              </span>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 44, borderTop: `1.5px solid ${C.border}`, paddingTop: 28 }}>
        <h3 style={{ fontWeight: 900, fontSize: 17, color: C.textDark, marginBottom: 18,
            fontFamily: "'DM Sans', sans-serif" }}>
          Articles similaires
        </h3>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {similar.map((sim, i) => (
            <div key={i} onClick={() => onOpenSimilar(sim)}
              style={{ flex: "0 0 180px", background: C.cardBg, borderRadius: 14,
                overflow: "hidden", cursor: "pointer", border: `1px solid ${C.border}` }}>
              <div style={{ height: 90, background: "linear-gradient(145deg,#EDE6FF,#D9C6FF)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                {sim.img ? <Image src={sim.img} alt={sim.imgAlt} fill sizes="180px" style={{ objectFit: "cover" }} /> : sim.emoji}
              </div>
              <div style={{ padding: "8px 10px 10px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.textDark, margin: "0 0 4px",
                    lineHeight: 1.35, fontFamily: "'DM Sans', sans-serif" }}>{sim.title}</p>
                <p style={{ fontSize: 10, color: C.textGray, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{sim.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type SortMode = "recent" | "ancien" | "populaire";
type CatFilter = "all" | ArticleCat;

export default function NewsContent({ weatherData, onOpenWeather }: { weatherData: WeatherData | null; onOpenWeather: () => void }) {
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState<CatFilter>("all");
  const [sortMode,  setSortMode]  = useState<SortMode>("recent");

  const filtered = newsArticles
    .filter(a => {
      const matchCat = catFilter === "all" || a.cat === catFilter;
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                          a.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortMode === "recent")    return b.dateSort - a.dateSort;
      if (sortMode === "ancien")    return a.dateSort - b.dateSort;
      return b.likes - a.likes;
    });

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
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.cardBg,
            border: `1px solid ${C.border}`, borderRadius: 30, padding: "9px 16px",
            flex: 1, minWidth: 200, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <span style={{ color: C.textGray, fontSize: 16 }}>🔍</span>
          <input type="text" placeholder="Rechercher un article…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent",
              fontSize: 14, color: C.textDark, width: "100%", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        {cats.map(c => (
          <button key={c.key} onClick={() => setCatFilter(c.key)}
            className={catFilter === c.key ? "filter-pill-active" : "filter-pill"}>
            {c.label}
          </button>
        ))}
        <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}
          style={{ padding: "9px 14px", borderRadius: 30, border: `1px solid ${C.border}`,
            background: C.cardBg, fontSize: 13, color: C.textGray, cursor: "pointer",
            outline: "none", fontFamily: "'DM Sans', sans-serif" }}>
          <option value="recent">Plus récent</option>
          <option value="ancien">Plus ancien</option>
          <option value="populaire">Populaire</option>
        </select>
        <WeatherBadge data={weatherData} onClick={onOpenWeather} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", background: C.purpleLight,
            borderRadius: 18, color: C.textGray, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          Aucun article ne correspond à votre recherche.
        </div>
      ) : (
        <div style={{ columns: "3 200px", columnGap: 16 }}>
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
