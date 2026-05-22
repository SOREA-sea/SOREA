"use client";
import React, { useState } from "react";
import Image from "next/image";
import { VibeCard, Dots } from "./common";
import { labelStyle } from "./styles";

const pourToiSlides = [
  { img: null as string | null, imgAlt: "Cadeau SEED",       emoji: "🎀",    title: "Prendre un moment pour soi avec SEED",       subtitle: "Télécharge un audio exclusif de visualisation." },
  { img: null as string | null, imgAlt: "Méditation guidée", emoji: "🧘‍♀️", title: "5 minutes de pleine conscience chaque matin", subtitle: "Un rituel simple pour commencer sereinement." },
  { img: null as string | null, imgAlt: "Journal bien-être", emoji: "📓",    title: "Ton journal bien-être du mois de novembre",  subtitle: "Reflète, ressens, progresse." },
];
const directeSlides = [
  { img: "/uploads/coaches/coach-1.png", imgAlt: "Coach Mila - Yoga",        coach: "Coach Mila",  title: "Respiration zen et ancrage",       badge: "LIVE" },
  { img: "/uploads/coaches/coach-2.png", imgAlt: "Coach Sofia - Stretching",  emoji: "🤸‍♀️", coach: "Coach Sofia", title: "Stretching matinal en douceur",     badge: "LIVE" },
  { img: "/uploads/coaches/coach-3.png", imgAlt: "Coach Léa - Méditation",   emoji: "🌸",    coach: "Coach Léa",   title: "Méditation guidée & visualisation", badge: "SOON" },
];

export default function NowContent(){
  const today = new Date().toLocaleDateString("fr-FR");
  const [ptIdx,  setPtIdx]  = useState(0);
  const [dirIdx, setDirIdx] = useState(0);
  const ptSlide  = pourToiSlides[ptIdx];
  const dirSlide = directeSlides[dirIdx];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, maxWidth: 1100, margin: "0 auto" }}>
      <section>
        <p style={labelStyle}>Pour ton univers</p>
        <VibeCard variant="purple" style={{ minHeight: 280 }}>
          <div style={{ padding: "22px 18px 18px", minHeight: 280, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 950, fontSize: 15, letterSpacing: 1.2, color: "#2D2255", fontFamily: "'DM Sans', sans-serif" }}>POUR TOI</span>
              <span style={{ color: "var(--color-primary-dark)", fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{today}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
              <button onClick={() => setPtIdx((ptIdx - 1 + pourToiSlides.length) % pourToiSlides.length)} className="arrow-btn">‹</button>
              <div style={{ width: 110, height: 110, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(145deg,#EDE6FF,#D9C6FF)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 56, position: "relative", overflow: "hidden" }}>
                {ptSlide.img
                  ? <Image src={ptSlide.img} alt={ptSlide.imgAlt} fill sizes="110px" style={{ objectFit: "cover" }} />
                  : ptSlide.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 900, fontSize: 17, color: "#2D2255", lineHeight: 1.3, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{ptSlide.title}</h4>
                <p style={{ fontSize: 12, color: "#777", margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{ptSlide.subtitle}</p>
              </div>
              <button onClick={() => setPtIdx((ptIdx + 1) % pourToiSlides.length)} className="arrow-btn">›</button>
            </div>
            <div style={{ marginTop: 18 }}><Dots count={pourToiSlides.length} current={ptIdx} /></div>
          </div>
        </VibeCard>
      </section>

      <section>
        <p style={labelStyle}>Directe</p>
        <VibeCard variant="teal" style={{ minHeight: 280 }}>
          <div style={{ display: "flex", minHeight: 280 }}>
            <div style={{ width: "45%", flexShrink: 0, background: "linear-gradient(145deg,#E9DFFF,#D6C5FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 80, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)", bottom: -20, right: -20 }} />
              {dirSlide.img
                ? <Image src={dirSlide.img} alt={dirSlide.imgAlt} fill sizes="45vw" style={{ objectFit: "cover" }} />
                : <span style={{ zIndex: 1 }}>{(dirSlide as { emoji?: string }).emoji ?? "🌸"}</span>
              }
            </div>
            <div style={{ flex: 1, padding: "22px 18px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span style={{ display: "inline-block", fontWeight: 950, fontSize: 13, letterSpacing: 1.5,
                    color: dirSlide.badge === "LIVE" ? "#fff" : "#9B92B8",
                    background: dirSlide.badge === "LIVE" ? "var(--color-primary-dark)" : "#E8E4F7",
                    padding: "3px 12px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                  {dirSlide.badge}
                </span>
                <p style={{ color: "#9B92B8", fontSize: 13, margin: "6px 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{dirSlide.coach}</p>
                <h4 style={{ fontWeight: 900, fontSize: 20, color: "var(--color-primary-dark)", lineHeight: 1.25, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{dirSlide.title}</h4>
              </div>
              <div>
                <button className="directe-join" style={{ background: "var(--color-primary-dark)", color: "#fff", border: "none",
                    padding: "12px 20px", borderRadius: 30, fontWeight: 900, fontSize: 13,
                    cursor: "pointer", width: "100%", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
                  En direct - Rejoindre
                </button>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button onClick={() => setDirIdx((dirIdx - 1 + directeSlides.length) % directeSlides.length)} className="arrow-btn">‹</button>
                  <Dots count={directeSlides.length} current={dirIdx} />
                  <button onClick={() => setDirIdx((dirIdx + 1) % directeSlides.length)} className="arrow-btn">›</button>
                </div>
              </div>
            </div>
          </div>
        </VibeCard>
      </section>
    </div>
  );
}
