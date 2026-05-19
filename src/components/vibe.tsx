"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const COLORS = {
  purple: "#7B3FE4",
  purpleGlow: "rgba(123, 63, 228, 0.4)",
  teal: "#38D9C0",
  tealGlow: "rgba(56, 217, 192, 0.4)",
  textDark: "#2D2255",
  textGray: "#9B92B8",
};

// --- Composant Carte avec l'effet Glow des images ---
function VibeCard({ children, activeColor, glowColor }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: "4px",
        padding: "2px", // Espace pour la bordure colorée
        height: "230px",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        cursor: "pointer",
        position: "relative",
        boxShadow: isHovered 
          ? `0 0 25px ${glowColor}, 0 10px 15px -3px rgba(0, 0, 0, 0.1)` 
          : "0 4px 12px rgba(0,0,0,0.03)",
        border: `1.5px solid ${isHovered ? activeColor : "#F0F0F0"}`,
      }}
    >
      <div style={{
        background: "#FFF",
        height: "100%",
        width: "100%",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        {children}
      </div>
    </div>
  );
}

// --- ONGLET NEWS (Contenu Image 2 : Sommeil + Météo) ---
function NewsContent() {
  const [temp, setTemp] = useState("--");
  const today = new Date().toLocaleDateString('fr-FR');
  const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true")
      .then(r => r.json()).then(d => setTemp(Math.round(d.current_weather.temperature)));
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", maxWidth: "1150px", margin: "0 auto" }}>
      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "12px", fontWeight: 700, marginBottom: "15px", textTransform: "uppercase" }}>News</h3>
        <VibeCard activeColor={COLORS.purple} glowColor={COLORS.purpleGlow}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "45%", background: "#E9DFFF", height: "160px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "70px" }}>🛌</span>
            </div>
            <div style={{ width: "55%", position: "relative" }}>
              <span style={{ position: "absolute", top: "-35px", right: "0", color: COLORS.purple, fontSize: "11px", fontWeight: 800 }}>{today}</span>
              <h4 style={{ fontWeight: 900, fontSize: "18px", color: COLORS.textDark, lineHeight: 1.2, marginBottom: "10px" }}>Cinq habitudes matinales pour s'éveiller en douceur</h4>
              <p style={{ fontSize: "12px", color: "#666" }}>Commence ta journée sereinement grâce à ces étapes apaisantes.</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", color: COLORS.purple, fontSize: "24px" }}>
                <span>‹</span><span>›</span>
              </div>
            </div>
          </div>
        </VibeCard>
      </section>

      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "12px", fontWeight: 700, marginBottom: "15px", textTransform: "uppercase" }}>Météo</h3>
        <VibeCard activeColor={COLORS.teal} glowColor={COLORS.tealGlow}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "40px" }}>☀️</span>
              <span style={{ fontSize: "38px", fontWeight: 950 }}>{temp}°C</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 900, color: COLORS.purple, fontSize: "15px" }}>Aujourd'hui {time}</div>
              <div style={{ color: COLORS.textGray, fontSize: "12px" }}>{today}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {['Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} style={{ flex: 1, background: "#F8F7FF", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: COLORS.textGray }}>{d}</div>
                <div style={{ fontSize: "22px" }}>☀️</div>
                <div style={{ fontSize: "11px", fontWeight: 900 }}>23°C</div>
              </div>
            ))}
            <span style={{ alignSelf: "center", color: COLORS.purple, fontWeight: 900, cursor: "pointer" }}>›</span>
          </div>
        </VibeCard>
      </section>
    </div>
  );
}

// --- ONGLET NOW (Contenu Image 1 : Yoga + Cadeau) ---
function NowContent() {
  const today = new Date().toLocaleDateString('fr-FR');
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", maxWidth: "1150px", margin: "0 auto" }}>
      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "12px", fontWeight: 700, marginBottom: "15px", textTransform: "uppercase" }}>Pour ton univers</h3>
        <VibeCard activeColor={COLORS.purple} glowColor={COLORS.purpleGlow}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 950, fontSize: "15px", letterSpacing: "1px" }}>POUR TOI</span>
            <span style={{ color: COLORS.purple, fontSize: "11px", fontWeight: 800 }}>{today}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
            <span style={{ color: COLORS.purple, fontSize: "35px" }}>‹</span>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "65px", marginBottom: "10px" }}>🎀</div>
              <h4 style={{ fontWeight: 900, fontSize: "19px", maxWidth: "200px" }}>Prendre un moment pour soi avec SEED</h4>
            </div>
            <span style={{ color: COLORS.purple, fontSize: "35px" }}>›</span>
          </div>
        </VibeCard>
      </section>

      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "12px", fontWeight: 700, marginBottom: "15px", textTransform: "uppercase" }}>Directe</h3>
        <VibeCard activeColor={COLORS.teal} glowColor={COLORS.tealGlow}>
          <div style={{ display: "flex", gap: "20px", height: "100%" }}>
            <div style={{ width: "45%", background: "#E9DFFF", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "75px" }}>🧘‍♀️</span>
            </div>
            <div style={{ width: "55%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontWeight: 950, fontSize: "15px" }}>LIVE</span>
              <p style={{ color: COLORS.textGray, fontSize: "12px", margin: "5px 0" }}>Coach Mila</p>
              <h4 style={{ fontWeight: 900, fontSize: "20px", color: COLORS.purple, lineHeight: 1.2, marginBottom: "15px" }}>Respiration zen et ancrage</h4>
              <button style={{ background: COLORS.purple, color: "white", border: "none", padding: "12px 20px", borderRadius: "30px", fontWeight: 900, cursor: "pointer", fontSize: "12px" }}>
                En direct - Rejoindre
              </button>
            </div>
          </div>
        </VibeCard>
      </section>
    </div>
  );
}

export default function SoreaVibe() {
  const [tab, setTab] = useState("now");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F1FF 0%, #FFFFFF 100%)", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main style={{ padding: "60px 20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "48px", fontWeight: 950, color: COLORS.textDark, marginBottom: "10px" }}>SOREA Vibe</h1>
        <p style={{ textAlign: "center", fontSize: "18px", marginBottom: "60px", color: COLORS.textDark, fontWeight: 500 }}>Inspiration, conseils bien-être et nouveautés SOREA au quotidien.</p>

        <div style={{ maxWidth: "900px", margin: "0 auto 50px", display: "flex", position: "relative" }}>
           <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "#EEE" }} />
           <button onClick={() => setTab("news")} style={{ flex: 1, padding: "20px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 900, color: tab === "news" ? COLORS.purple : COLORS.textGray, borderBottom: tab === "news" ? `4px solid ${COLORS.purple}` : "4px solid transparent", zIndex: 1 }}>NEWS</button>
           <button onClick={() => setTab("now")} style={{ flex: 1, padding: "20px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 900, color: tab === "now" ? COLORS.teal : COLORS.textGray, borderBottom: tab === "now" ? `4px solid ${COLORS.teal}` : "4px solid transparent", zIndex: 1 }}>NOW</button>
        </div>

        {tab === "news" ? <NewsContent /> : <NowContent />}

        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <button style={{ background: "#FFF", color: COLORS.purple, border: `2.5px solid ${COLORS.purple}`, padding: "15px 45px", borderRadius: "40px", fontWeight: 950, cursor: "pointer", fontSize: "16px", boxShadow: "0 4px 15px rgba(123, 63, 228, 0.15)" }}>
            Recevoir mon magazine
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}