"use client";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  purple:      "var(--color-primary-dark)",
  purpleDark:  "var(--color-primary-darker)",
  purpleLight: "#EDE6FF",
  purpleGlow:  "rgba(123,63,228,0.28)",
  teal:        "#38D9C0",
  tealGlow:    "rgba(56,217,192,0.28)",
  textDark:    "#2D2255",
  textGray:    "#9B92B8",
  bg:          "linear-gradient(135deg,#EDE8FA 0%,#F7F5FF 45%,#E6FAF8 100%)",
  cardBg:      "#FFFFFF",
  border:      "#EDEAF7",
};

// ─────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  color: C.textGray,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 14,
  textTransform: "uppercase",
  letterSpacing: 1.2,
  fontFamily: "'DM Sans', sans-serif",
};

// ─────────────────────────────────────────────
// GLOW CARD
// ─────────────────────────────────────────────
interface VibeCardProps {
  children: React.ReactNode;
  variant?: "purple" | "teal";
  style?: React.CSSProperties;
}

function VibeCard({ children, variant = "purple", style = {} }: VibeCardProps) {
  const [hovered, setHovered] = useState(false);

  const gradientBorder = variant === "purple"
    ? "linear-gradient(135deg, #E879F9 0%, #38D9C0 100%)"
    : "linear-gradient(135deg, #38D9C0 0%, #E879F9 100%)";


  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18,
        padding: hovered ? 2 : 1.5,
        background: hovered ? gradientBorder : C.border,
        boxShadow: hovered
          ? "0 0 0 4px rgba(56,217,192,0.18), 0 16px 56px rgba(123,63,228,0.18)"
          : "0 2px 16px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(.175,.885,.32,1.275)",
        ...style,
      }}
    >
      <div style={{
        background: C.cardBg,
        borderRadius: 16,
        overflow: "hidden",
        height: "100%",
        minHeight: style.minHeight,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DOTS
// ─────────────────────────────────────────────
function Dots({ count, current }: { count: number; current: number }) {
  return (
    <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 20 : 7,
            height: 7,
            borderRadius: 99,
            background: i === current ? C.purple : "#D8D3F0",
            transition: "all 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// DATA — NEWS TAB
// ─────────────────────────────────────────────
const newsSlides = [
  { img: null as string | null, imgAlt: "Routine matinale",    emoji: "🛌", date: "04/11/2025", title: "Cinq habitudes matinaux pour s'éveiller en douceur",           desc: "Tu as du mal à te discipliner le matin ? Commence ta journée sereinement grâce à ces étapes apaisantes." },
  { img: null as string | null, imgAlt: "Nutrition bien-être", emoji: "🥗", date: "05/11/2025", title: "Les superaliments de l'automne à adopter dès maintenant",       desc: "Booste ton immunité et ton énergie avec ces trésors de saison." },
  { img: null as string | null, imgAlt: "Yoga matin",          emoji: "🌅", date: "06/11/2025", title: "Yoga doux : une séquence de 10 min pour bien démarrer",         desc: "Réveille ton corps en douceur avant de commencer ta journée." },
  { img: null as string | null, imgAlt: "Sommeil réparateur",  emoji: "🌙", date: "07/11/2025", title: "Mieux dormir grâce à la cohérence cardiaque",                   desc: "Découvre cette technique simple et puissante pour retrouver un sommeil profond." },
];

// ─────────────────────────────────────────────
// WEATHER HELPERS
// ─────────────────────────────────────────────
interface DayForecast {
  date: Date; code: number; maxTemp: number; minTemp: number; precipProb: number; windMax: number;
}

function wIcon(code: number): string {
  if (code === 0) return "☀️"; if (code <= 2) return "🌤️"; if (code <= 3) return "☁️";
  if (code <= 48) return "🌫️"; if (code <= 57) return "🌧️"; if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️"; if (code <= 82) return "🌧️"; if (code <= 99) return "⛈️";
  return "🌡️";
}
function wLabel(code: number): string {
  if (code === 0) return "Ensoleillé"; if (code <= 2) return "Peu nuageux"; if (code <= 3) return "Nuageux";
  if (code <= 48) return "Brouillard"; if (code <= 57) return "Bruine"; if (code <= 67) return "Pluie";
  if (code <= 77) return "Neige"; if (code <= 82) return "Averses"; return "Orage";
}
function shortDay(date: Date): string {
  return date.toLocaleDateString("fr-FR", { weekday: "short" })
    .replace(".", "").slice(0, 3).replace(/^\w/, c => c.toUpperCase());
}

// ─────────────────────────────────────────────
// MODAL 7 JOURS
// ─────────────────────────────────────────────
function WeatherModal({ forecast, onClose }: { forecast: DayForecast[]; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(45,34,85,0.35)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(145deg,#F5F0FF,#E8FAF8)", borderRadius: 24, padding: "28px 32px", minWidth: 340, maxWidth: 480, width: "90vw", boxShadow: "0 24px 64px rgba(123,63,228,0.22)", border: "1.5px solid rgba(56,217,192,0.3)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.textGray, lineHeight: 1 }}>✕</button>
        <h3 style={{ margin: "0 0 20px", color: C.purple, fontWeight: 900, fontSize: 18, fontFamily: "'DM Sans', sans-serif" }}>
          🗓 Prévisions 7 jours - localisation
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {forecast.map((day, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.7)", borderRadius: 14, padding: "10px 16px", border: i === 0 ? `1.5px solid ${C.teal}` : "1.5px solid transparent" }}>
              <div style={{ width: 36, fontWeight: 800, fontSize: 13, color: i === 0 ? C.teal : C.textDark, fontFamily: "'DM Sans', sans-serif" }}>{i === 0 ? "Auj." : shortDay(day.date)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, marginLeft: 10 }}>
                <span style={{ fontSize: 24 }}>{wIcon(day.code)}</span>
                <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{wLabel(day.code)}</span>
              </div>
              <div style={{ textAlign: "center", minWidth: 42 }}>
                <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Pluie</div>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.textDark, fontFamily: "'DM Sans', sans-serif" }}>{day.precipProb}%</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 70 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: C.purple, fontFamily: "'DM Sans', sans-serif" }}>{day.maxTemp}°</span>
                <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}> / {day.minTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NEWS CONTENT
// ─────────────────────────────────────────────
function NewsContent() {
  const [newsIdx,    setNewsIdx]    = useState(0);
  const [currentTemp,setCurrentTemp]= useState<number | null>(null);
  const [currentCode,setCurrentCode]= useState<number>(0);
  const [windSpeed,  setWindSpeed]  = useState<number | null>(null);
  const [nightTemp,  setNightTemp]  = useState<number | null>(null);
  const [precipProb, setPrecipProb] = useState<number | null>(null);
  const [forecast3,  setForecast3]  = useState<DayForecast[]>([]);
  const [forecast7,  setForecast7]  = useState<DayForecast[]>([]);
  const [showModal,  setShowModal]  = useState(false);
  const now = new Date();

  useEffect(() => {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&hourly=temperature_2m,precipitation_probability&timezone=Europe%2FParis&forecast_days=7";
    fetch(url).then(r => r.json()).then(d => {
      setCurrentTemp(Math.round(d.current_weather.temperature));
      setCurrentCode(d.current_weather.weathercode);
      setWindSpeed(Math.round(d.current_weather.windspeed));
      setNightTemp(Math.round(d.daily.temperature_2m_min[0]));
      setPrecipProb(d.daily.precipitation_probability_max[0]);
      const days: DayForecast[] = d.daily.time.map((dateStr: string, i: number) => ({
        date: new Date(dateStr + "T12:00:00"), code: d.daily.weathercode[i],
        maxTemp: Math.round(d.daily.temperature_2m_max[i]), minTemp: Math.round(d.daily.temperature_2m_min[i]),
        precipProb: d.daily.precipitation_probability_max[i] ?? 0, windMax: Math.round(d.daily.windspeed_10m_max[i]),
      }));
      setForecast7(days); setForecast3(days.slice(1, 4));
    }).catch(() => {});
  }, []);

  const today = now.toLocaleDateString("fr-FR");
  const time  = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const slide = newsSlides[newsIdx];

  return (
    <>
      {showModal && forecast7.length > 0 && <WeatherModal forecast={forecast7} onClose={() => setShowModal(false)} />}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 28, maxWidth: 1100, margin: "0 auto" }}>

        {/* ── NEWS CARD ── */}
        <section>
          <p style={labelStyle}>News</p>
          <VibeCard variant="purple" style={{ minHeight: 280 }}>
            <div style={{ display: "flex", minHeight: 280 }}>
              <div style={{ width: "38%", flexShrink: 0, background: "linear-gradient(145deg,#C9A8FF 0%,#A87AFF 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 86, minHeight: 280, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.12)", top: -30, left: -30 }} />
                {slide.img
                  ? <Image src={slide.img} alt={slide.imgAlt} fill sizes="38vw" style={{ objectFit: "cover" }} />
                  : <span style={{ zIndex: 1 }}>{slide.emoji}</span>
                }
                {/* Flèche gauche — classe CSS pour le hover */}
                <button onClick={() => setNewsIdx((newsIdx - 1 + newsSlides.length) % newsSlides.length)} className="arrow-btn-white">‹</button>
              </div>
              <div style={{ flex: 1, padding: "22px 22px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
                <span style={{ position: "absolute", top: 18, right: 20, color: C.purple, fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{slide.date}</span>
                <div style={{ marginTop: 10 }}>
                  <h4 style={{ fontWeight: 900, fontSize: 20, color: C.textDark, lineHeight: 1.3, margin: "0 0 14px", fontFamily: "'DM Sans', sans-serif", paddingRight: 60 }}>{slide.title}</h4>
                  <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{slide.desc}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                  <div style={{ flex: 1 }} />
                  <Dots count={newsSlides.length} current={newsIdx} />
                  <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    {/* Flèche droite — classe CSS pour le hover */}
                    <button onClick={() => setNewsIdx((newsIdx + 1) % newsSlides.length)} className="arrow-btn">›</button>
                  </div>
                </div>
              </div>
            </div>
          </VibeCard>
        </section>

        {/* ── MÉTÉO CARD ── */}
        <section>
          <p style={labelStyle}>Météo</p>
          <VibeCard variant="teal" style={{ minHeight: 280 }}>
            <div style={{ background: "linear-gradient(135deg,#EBF9F6 0%,#EEE8FF 100%)", padding: "16px 14px 14px", boxSizing: "border-box" as const, display: "flex", flexDirection: "column" as const, justifyContent: "space-between", minHeight: 276 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "12px 14px", flex: "0 0 auto", minWidth: 130, display: "flex", flexDirection: "column" as const, alignItems: "center", boxShadow: "0 2px 12px rgba(123,63,228,0.07)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 44 }}>{wIcon(currentCode)}</span>
                    <span style={{ fontSize: 26, fontWeight: 950, color: C.purple, fontFamily: "'DM Sans', sans-serif" }}>{currentTemp !== null ? `${currentTemp}°C` : "--"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 3, margin: "3px 0 8px", opacity: 0.55 }}>
                    <span style={{ fontSize: 13 }}>🌸</span><span style={{ fontSize: 13 }}>🌺</span><span style={{ fontSize: 11 }}>❄️</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {[
                      { icon: "💨", label: "Vent",  val: windSpeed  !== null ? `${windSpeed} km/h` : "--" },
                      { icon: "🌙", label: "Nuit",  val: nightTemp  !== null ? `${nightTemp}°C`    : "--" },
                      { icon: "🌧️", label: "Pluie", val: precipProb !== null ? `${precipProb}%`    : "--" },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 16 }}>{m.icon}</div>
                        <div style={{ fontSize: 9, color: C.teal, fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3 }}>{m.label}</div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: C.textDark, fontFamily: "'DM Sans', sans-serif" }}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center", paddingLeft: 4 }}>
                  <div style={{ fontWeight: 900, color: C.purple, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Aujourd&apos;hui &nbsp; {time}</div>
                  <div style={{ fontSize: 18, fontWeight: 950, color: C.purple, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>{today}</div>
                  {/* Bouton › météo — classe CSS pour le hover */}
                  <button onClick={() => setShowModal(true)} className="weather-more-btn" title="Voir les 7 prochains jours">›</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {forecast3.length > 0
                  ? forecast3.map((day, i) => (
                      <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.75)", borderRadius: 10, padding: "7px 4px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{shortDay(day.date)}</div>
                        <div style={{ fontSize: 22, margin: "3px 0" }}>{wIcon(day.code)}</div>
                        <div style={{ fontSize: 11, fontWeight: 900, color: C.purple, fontFamily: "'DM Sans', sans-serif" }}>{day.maxTemp}°</div>
                        <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{day.precipProb}%</div>
                      </div>
                    ))
                  : [0,1,2].map(i => (
                      <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "7px 4px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>--</div>
                        <div style={{ fontSize: 22, margin: "3px 0" }}>⋯</div>
                      </div>
                    ))
                }
              </div>
            </div>
          </VibeCard>
        </section>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// DATA — NOW TAB
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// NOW CONTENT
// ─────────────────────────────────────────────
function NowContent() {
  const today = new Date().toLocaleDateString("fr-FR");
  const [ptIdx,  setPtIdx]  = useState(0);
  const [dirIdx, setDirIdx] = useState(0);
  const ptSlide  = pourToiSlides[ptIdx];
  const dirSlide = directeSlides[dirIdx];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, maxWidth: 1100, margin: "0 auto" }}>

      {/* ── POUR TOI ── */}
      <section>
        <p style={labelStyle}>Pour ton univers</p>
        <VibeCard variant="purple" style={{ minHeight: 280 }}>
          <div style={{ padding: "22px 18px 18px", minHeight: 280, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 950, fontSize: 15, letterSpacing: 1.2, color: C.textDark, fontFamily: "'DM Sans', sans-serif" }}>POUR TOI</span>
              <span style={{ color: C.purple, fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{today}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
              <button onClick={() => setPtIdx((ptIdx - 1 + pourToiSlides.length) % pourToiSlides.length)} className="arrow-btn">‹</button>
              <div style={{ width: 110, height: 110, borderRadius: 12, flexShrink: 0, background: "linear-gradient(145deg,#EDE6FF,#D9C6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, position: "relative", overflow: "hidden" }}>
                {ptSlide.img
                  ? <Image src={ptSlide.img} alt={ptSlide.imgAlt} fill sizes="110px" style={{ objectFit: "cover" }} />
                  : ptSlide.emoji
                }
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 900, fontSize: 17, color: C.textDark, lineHeight: 1.3, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{ptSlide.title}</h4>
                <p style={{ fontSize: 12, color: "#777", margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{ptSlide.subtitle}</p>
              </div>
              <button onClick={() => setPtIdx((ptIdx + 1) % pourToiSlides.length)} className="arrow-btn">›</button>
            </div>
            <div style={{ marginTop: 18 }}>
              <Dots count={pourToiSlides.length} current={ptIdx} />
            </div>
          </div>
        </VibeCard>
      </section>

      {/* ── DIRECTE ── */}
      <section>
        <p style={labelStyle}>Directe</p>
        <VibeCard variant="teal" style={{ minHeight: 280 }}>
          <div style={{ display: "flex", minHeight: 280 }}>
            <div style={{ width: "45%", flexShrink: 0, background: "linear-gradient(145deg,#E9DFFF,#D6C5FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.18)", bottom: -20, right: -20 }} />
              {dirSlide.img
                ? <Image src={dirSlide.img} alt={dirSlide.imgAlt} fill sizes="45vw" style={{ objectFit: "cover" }} />
                : <span style={{ zIndex: 1 }}>{dirSlide.emoji}</span>
              }
            </div>
            <div style={{ flex: 1, padding: "22px 18px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span style={{ display: "inline-block", fontWeight: 950, fontSize: 13, letterSpacing: 1.5, color: dirSlide.badge === "LIVE" ? "#fff" : C.textGray, background: dirSlide.badge === "LIVE" ? C.purple : "#E8E4F7", padding: "3px 12px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{dirSlide.badge}</span>
                <p style={{ color: C.textGray, fontSize: 13, margin: "6px 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{dirSlide.coach}</p>
                <h4 style={{ fontWeight: 900, fontSize: 20, color: C.purple, lineHeight: 1.25, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{dirSlide.title}</h4>
              </div>
              <div>
                <button className="directe-join" style={{ background: C.purple, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 30, fontWeight: 900, fontSize: 13, cursor: "pointer", width: "100%", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
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

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────
const TABS = [
  { key: "news", label: "News" },
  { key: "now",  label: "Now"  },
] as const;
type TabKey = "news" | "now";

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function SoreaVibe() {
  const [tab,  setTab]  = useState<TabKey>("news");
  const navRef          = useRef<HTMLDivElement>(null);

  const isLoggedIn = false;

  function handleMagazine() {
    window.location.href = isLoggedIn ? "/carnet" : "/login";
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&display=swap');
        * { box-sizing: border-box; }

        /* ── Navbar fixe ── */
        .sorea-navbar-wrapper {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
        }

        /* ── Tabs ── */
        .sorea-tab-btn {
          transition: border-bottom-color 0.25s, filter 0.25s;
          position: relative;
        }
        .sorea-tab-btn:hover {
          border-bottom-color: ${C.teal} !important;
          filter: drop-shadow(0 4px 10px rgba(56,217,192,0.60));
        }
        .sorea-tab-btn.active-tab {
          filter: drop-shadow(0 4px 12px rgba(56,217,192,0.70));
        }

        /* ── Flèches violettes (carousels) ── */
        .arrow-btn {
          background: none;
          border: none;
          color: ${C.purple};
          font-size: 32px;
          font-weight: 900;
          cursor: pointer;
          padding: 0 6px;
          line-height: 1;
          flex-shrink: 0;
          user-select: none;
          transition: transform 0.15s, color 0.15s, filter 0.15s;
        }
        .arrow-btn:hover {
          transform: scale(1.3);
          color: #bf80ff;
          filter: drop-shadow(0 0 8px rgba(123,63,228,0.75));
        }

        /* ── Flèche blanche (zone image News) ── */
        .arrow-btn-white {
          background: none;
          border: none;
          color: #fff;
          font-size: 36px;
          font-weight: 900;
          cursor: pointer;
          padding: 0 6px;
          line-height: 1;
          user-select: none;
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          transition: filter 0.15s;
        }
        .arrow-btn-white:hover {
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.95)) brightness(1.3);
        }

        /* ── Bouton › météo ── */
        .weather-more-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: ${C.purple};
          font-size: 28px;
          font-weight: 900;
          padding: 0;
          line-height: 1;
          align-self: flex-start;
          transition: transform 0.15s, filter 0.15s;
        }
        .weather-more-btn:hover {
          transform: translateX(4px);
          filter: drop-shadow(0 0 6px rgba(123,63,228,0.6));
        }

        /* ── Bouton Rejoindre ── */
        .directe-join {
          transition: background 0.2s, box-shadow 0.2s;
        }
        .directe-join:hover {
          background: ${C.purpleDark} !important;
          box-shadow: 0 4px 16px rgba(74,31,168,0.35);
        }

        /* ── CTA ──
           État normal  : fond blanc, texte violet, ombre basse
           Hover        : dégradé violet direct (var() avec gradient ne fonctionne pas),
                          rien ne bouge (pas de transform)                              */
        .sorea-cta {
          display: inline-block;
          padding: 14px 52px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          border: none;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.2px;
          background: ${C.cardBg};
          color: ${C.purple};
          box-shadow: 0 3px 0 #D8D3E8, 0 2px 12px rgba(0,0,0,0.06);
          transition: background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease;
        }
        .sorea-cta:hover {
          background: linear-gradient(93.09deg, #8B47FF 0%, #BA98F4 100%);
          color: #fff;
          box-shadow: 0 3px 0 #D8D3E8, 0 6px 22px rgba(123,63,228,0.32);
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

        {/* Navbar fixe — hauteur mesurée dynamiquement */}
        <div ref={navRef} className="sorea-navbar-wrapper">
          <Navbar />
        </div>

        {/* Main décalé de la hauteur exacte de la navbar */}
        <main style={{ paddingTop: 80, paddingLeft: 32, paddingRight: 32, paddingBottom: 80 }}>

          {/* HERO */}
          <h1 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,46px)", fontWeight: 950, color: C.textDark, margin: "40px 0 12px", letterSpacing: -0.5, fontFamily: "'DM Sans', sans-serif" }}>
            SOREA Vibe
          </h1>
          <p style={{ textAlign: "center", fontSize: 18, color: C.textDark, fontWeight: 400, margin: "0 0 50px", opacity: 0.85, fontFamily: "'DM Sans', sans-serif" }}>
            Inspiration, conseils bien-être et nouveautés SOREA au quotidien.
          </p>

          {/* TAB BAR */}
          <div style={{ maxWidth: 900, margin: "0 auto 48px", display: "flex", position: "relative" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#E2DDF5" }} />
            {TABS.map(({ key, label }) => {
              const isActive = tab === key;
              return (
                <button
                  key={key}
                  className={`sorea-tab-btn${isActive ? " active-tab" : ""}`}
                  onClick={() => setTab(key)}
                  style={{
                    flex: 1, padding: "16px 0", background: "none", border: "none",
                    cursor: "pointer", fontSize: 16, fontWeight: 800, letterSpacing: 0.3,
                    color: C.purple,
                    borderBottom: isActive ? `3px solid ${C.teal}` : `3px solid transparent`,
                    zIndex: 1, fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          {tab === "news" ? <NewsContent /> : <NowContent />}

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <button className="sorea-cta" onClick={handleMagazine}>
              Recevoir mon magazine
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}