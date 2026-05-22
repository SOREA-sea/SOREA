"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WeatherModal from "@/components/WeatherModal";
import WeatherBadge from "@/app/vibe/WeatherBadge";
import NewsContent from "@/app/vibe/NewsContent";
import NowContent from "@/app/vibe/NowContent";
import { C } from "@/app/vibe/styles";
import { WeatherData as VWeatherData, DayForecast as VDayForecast } from "@/app/vibe/types";
// reverseGeocode kept locally to avoid cross-folder export issues
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { "User-Agent": "SOREA-App/1.0 (your-email@example.com)" } });
    if (!res.ok) return "Localité inconnue";
    const data = await res.json();
    const addr = data?.address ?? {};
    return addr.city || addr.town || addr.village || addr.hamlet || addr.county || addr.state || data?.display_name || "Localité inconnue";
  } catch {
    return "Localité inconnue";
  }
}

const TABS = [{ key: "news", label: "News" }, { key: "now", label: "Now" }] as const;
type TabKey = "news" | "now";

export default function SoreaVibe() {
  const [tab, setTab] = useState<TabKey>("news");
  const [weatherData, setWeatherData] = useState<VWeatherData | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = false;

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&hourly=temperature_2m&timezone=auto&forecast_days=7`;
      const [res, city] = await Promise.all([fetch(url).then(r => r.json()), reverseGeocode(lat, lon)]);
      const cw = res.current_weather;
      const allHourly: number[] = res.hourly?.temperature_2m ?? [];
      const todayHourly = allHourly.slice(0, 24).filter((_, i) => i % 3 === 0);
      const days: VDayForecast[] = res.daily.time.map((dateStr: string, i: number) => ({
        date: new Date(dateStr + "T12:00:00"), code: res.daily.weathercode[i],
        maxTemp: Math.round(res.daily.temperature_2m_max[i]),
        minTemp: Math.round(res.daily.temperature_2m_min[i]),
        precipProb: res.daily.precipitation_probability_max[i] ?? 0,
        windMax: Math.round(res.daily.windspeed_10m_max[i]),
        hourlyTemps: i === 0 ? todayHourly : undefined,
      }));
      setWeatherData({
        currentTemp: Math.round(cw.temperature),
        currentCode: cw.weathercode,
        windSpeed: Math.round(cw.windspeed),
        cityName: city,
        forecast7: days,
      });
    } catch { /* fail silently */ }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(48.85, 2.35),
        { timeout: 8000 }
      );
    } else {
      (async () => { await fetchWeather(48.85, 2.35); })();
    }
  }, [fetchWeather]);

  function handleMagazine() {
    window.location.href = isLoggedIn ? "/carnet" : "/login";
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&display=swap');
        * { box-sizing: border-box; }

        .sorea-navbar-wrapper { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
        .weather-badge-wrapper { position: fixed; top: 54px; right: 24px; z-index: 110; }
        .weather-badge-btn { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.92); border: 1px solid #EDEAF7; border-radius: 30px; padding: 5px 12px; cursor: pointer; backdrop-filter: blur(8px); box-shadow: 0 2px 12px rgba(123,63,228,0.12); transition: border-color 0.18s, box-shadow 0.18s; }
        .weather-badge-btn:hover { border-color: #38D9C0; box-shadow: 0 0 0 3px rgba(56,217,192,0.18); }
        .sorea-tab-btn { transition: border-bottom-color 0.25s, filter 0.25s; position: relative; }
        .sorea-tab-btn:hover { border-bottom-color: ${C.teal} !important; filter: drop-shadow(0 4px 10px rgba(56,217,192,0.60)); }
        .sorea-tab-btn.active-tab { filter: drop-shadow(0 4px 12px rgba(56,217,192,0.70)); }
        .arrow-btn { background: none; border: none; color: ${C.purple}; font-size: 32px; font-weight: 900; cursor: pointer; padding: 0 6px; line-height: 1; flex-shrink: 0; user-select: none; transition: transform 0.15s, color 0.15s, filter 0.15s; }
        .arrow-btn:hover { transform: scale(1.3); color: #bf80ff; filter: drop-shadow(0 0 8px rgba(123,63,228,0.75)); }
        .sorea-cta { display: inline-block; padding: 14px 52px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; letter-spacing: 0.2px; background: ${C.cardBg}; color: ${C.purple}; box-shadow: 0 3px 0 #D8D3E8, 0 2px 12px rgba(0,0,0,0.06); transition: background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease; }
        .sorea-cta:hover { background: linear-gradient(93.09deg,#8B47FF 0%,#BA98F4 100%); color: #fff; box-shadow: 0 3px 0 #D8D3E8, 0 6px 22px rgba(123,63,228,0.32); }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
        <div ref={navRef} className="sorea-navbar-wrapper"><Navbar /></div>
        <div className="weather-badge-wrapper"><WeatherBadge data={weatherData} onClick={() => setShowWeather(true)} /></div>
        {showWeather && weatherData && <WeatherModal data={weatherData} onClose={() => setShowWeather(false)} />}

        <main style={{ paddingTop: 80, paddingLeft: 32, paddingRight: 32, paddingBottom: 80 }}>
          <h1 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,46px)", fontWeight: 950, color: C.textDark, margin: "40px 0 12px", letterSpacing: -0.5 }}>SOREA Vibe</h1>
          <p style={{ textAlign: "center", fontSize: 18, color: C.textDark, fontWeight: 400, margin: "0 0 50px", opacity: 0.85 }}>Inspiration, conseils bien-être et nouveautés SOREA au quotidien.</p>

          <div style={{ maxWidth: 900, margin: "0 auto 48px", display: "flex", position: "relative" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#E2DDF5" }} />
            {TABS.map(({ key, label }) => {
              const isActive = tab === key;
              return (
                <button key={key} className={`sorea-tab-btn${isActive ? " active-tab" : ""}`} onClick={() => setTab(key)} style={{ flex: 1, padding: "16px 0", background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 800, letterSpacing: 0.3, color: C.purple, borderBottom: isActive ? `3px solid ${C.teal}` : "3px solid transparent", zIndex: 1 }}>{label}</button>
              );
            })}
          </div>

          {tab === "news" ? <NewsContent weatherData={weatherData} onOpenWeather={() => setShowWeather(true)} /> : <NowContent />}

          <div style={{ textAlign: "center", marginTop: 64 }}>
            <button className="sorea-cta" onClick={handleMagazine}>Recevoir mon magazine</button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
