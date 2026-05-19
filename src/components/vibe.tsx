"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const COLORS = {
  purple: "#7B3FE4",
  purpleHover: "#F6F1FF",
  teal: "#38D9C0",
  tealHover: "#E8F9F6",
  textDark: "#2D2255",
  textGray: "#B8B1D1",
};

// --- Composant Carte ---
function VibeCard({ children, hoverBg, activeBorder }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? hoverBg : "#FFFFFF",
        borderRadius: "4px",
        padding: "24px",
        height: "220px",
        display: "flex",
        transition: "all 0.3s ease",
        cursor: "pointer",
        border: `1.5px solid ${isHovered ? activeBorder : "#F0F0F0"}`,
        boxShadow: isHovered ? "0 12px 24px rgba(0,0,0,0.06)" : "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      {children}
    </div>
  );
}

// --- ONGLET NEWS (Image 2 : Sommeil + Météo) ---
function NewsContent() {
  const [weatherData, setWeatherData] = useState({ temp: "--", city: "Paris", icon: "☀️" });
  const today = new Date().toLocaleDateString('fr-FR');
  const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    // Récupération météo réelle (Paris par défaut, change lat/lon pour ta ville)
    fetch("https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true")
      .then(res => res.json())
      .then(data => {
        setWeatherData({
          temp: Math.round(data.current_weather.temperature),
          city: "Paris",
          icon: data.current_weather.temperature > 15 ? "☀️" : "☁️"
        });
      });
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "11px", fontWeight: 800, marginBottom: "12px", textTransform: "uppercase" }}>News</h3>
        <VibeCard hoverBg={COLORS.purpleHover} activeBorder={COLORS.purple}>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div style={{ width: "40%", background: "#E9DFFF", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
              <span style={{ fontSize: "65px" }}>🛌</span>
            </div>
            <div style={{ width: "60%", paddingLeft: "25px", position: "relative" }}>
              <span style={{ position: "absolute", top: "-15px", right: "0", color: COLORS.purple, fontSize: "11px", fontWeight: 800 }}>{today}</span>
              <h4 style={{ fontWeight: 950, fontSize: "18px", color: COLORS.textDark, marginBottom: "10px", lineHeight: 1.2 }}>Cinq habitudes matinales pour s'éveiller en douceur</h4>
              <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.5 }}>Commence ta journée sereinement grâce à ces étapes apaisantes.</p>
            </div>
          </div>
        </VibeCard>
      </section>

      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "11px", fontWeight: 800, marginBottom: "12px", textTransform: "uppercase" }}>Météo</h3>
        <VibeCard hoverBg={COLORS.tealHover} activeBorder={COLORS.teal}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "40px" }}>{weatherData.icon}</span>
                <span style={{ fontSize: "35px", fontWeight: 950 }}>{weatherData.temp}°C</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 950, color: COLORS.purple, fontSize: "14px" }}>Aujourd'hui {currentTime}</div>
                <div style={{ color: COLORS.textGray, fontSize: "11px", fontWeight: 700 }}>{today}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {['Ven', 'Sam', 'Dim'].map((d, i) => (
                <div key={d} style={{ flex: 1, background: "#F7F5FF", padding: "10px", borderRadius: "4px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: COLORS.textGray }}>{d}</div>
                  <div style={{ fontSize: "20px", margin: "5px 0" }}>☀️</div>
                  <div style={{ fontSize: "10px", fontWeight: 900 }}>23°C</div>
                </div>
              ))}
            </div>
          </div>
        </VibeCard>
      </section>
    </div>
  );
}

// --- ONGLET NOW (Image 1 : Yoga + Visualisation) ---
function NowContent() {
  const today = new Date().toLocaleDateString('fr-FR');
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "11px", fontWeight: 800, marginBottom: "12px", textTransform: "uppercase" }}>Pour ton univers</h3>
        <VibeCard hoverBg={COLORS.purpleHover} activeBorder={COLORS.purple}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontWeight: 950, fontSize: "14px" }}>POUR TOI</span>
              <span style={{ color: COLORS.purple, fontSize: "10px", fontWeight: 800 }}>{today}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <button style={{ background: "none", border: "none", color: COLORS.purple, fontSize: "35px", cursor: "pointer" }}>‹</button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "55px", marginBottom: "10px" }}>🎀</div>
                <h4 style={{ fontWeight: 950, fontSize: "18px", color: COLORS.textDark, lineHeight: 1.2 }}>Moment pour soi avec SEED</h4>
              </div>
              <button style={{ background: "none", border: "none", color: COLORS.purple, fontSize: "35px", cursor: "pointer" }}>›</button>
            </div>
          </div>
        </VibeCard>
      </section>

      <section>
        <h3 style={{ color: COLORS.textGray, fontSize: "11px", fontWeight: 800, marginBottom: "12px", textTransform: "uppercase" }}>Directe</h3>
        <VibeCard hoverBg={COLORS.tealHover} activeBorder={COLORS.teal}>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "45%", background: "#E9DFFF", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", height: "160px" }}>
              <span style={{ fontSize: "70px" }}>🧘‍♀️</span>
            </div>
            <div style={{ width: "55%", paddingLeft: "20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontWeight: 950, fontSize: "14px" }}>LIVE</span>
              <p style={{ color: COLORS.textGray, fontSize: "11px", margin: "4px 0 12px", fontWeight: 700 }}>Coach Mila</p>
              <h4 style={{ fontWeight: 950, fontSize: "19px", color: COLORS.purple, marginBottom: "15px", lineHeight: 1.2 }}>Respiration & Ancrage</h4>
              <button style={{ background: COLORS.purple, color: "white", border: "none", padding: "10px 20px", borderRadius: "25px", fontWeight: 900, fontSize: "12px", cursor: "pointer", width: "fit-content" }}>Rejoindre</button>
            </div>
          </div>
        </VibeCard>
      </section>
    </div>
  );
}

export default function SoreaVibe() {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F1FF 0%, #FFFFFF 50%, #E8F9F6 100%)", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main style={{ padding: "60px 20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "42px", fontWeight: 950, color: COLORS.textDark, marginBottom: "10px" }}>SOREA Vibe</h1>
        <p style={{ textAlign: "center", color: COLORS.textDark, fontSize: "18px", marginBottom: "50px", fontWeight: 600 }}>Inspiration, conseils bien-être et nouveautés SOREA au quotidien.</p>

        <div style={{ maxWidth: "800px", margin: "0 auto 40px", borderBottom: `2px solid #EEE`, display: "flex" }}>
          <button onClick={() => setActiveTab("news")} style={{ flex: 1, padding: "20px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 900, color: activeTab === "news" ? COLORS.purple : COLORS.textGray, borderBottom: activeTab === "news" ? `4px solid ${COLORS.purple}` : "4px solid transparent", textTransform: "uppercase" }}>News</button>
          <button onClick={() => setActiveTab("now")} style={{ flex: 1, padding: "20px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 900, color: activeTab === "now" ? COLORS.teal : COLORS.textGray, borderBottom: activeTab === "now" ? `4px solid ${COLORS.teal}` : "4px solid transparent", textTransform: "uppercase" }}>Now</button>
        </div>

        {activeTab === "news" ? <NewsContent /> : <NowContent />}

        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <button style={{ background: "#FFF", color: COLORS.purple, border: `2.5px solid ${COLORS.purple}`, padding: "15px 45px", borderRadius: "35px", fontWeight: 950, cursor: "pointer", fontSize: "16px" }}>Recevoir mon magazine</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}