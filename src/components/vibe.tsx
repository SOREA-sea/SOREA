"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WeatherModal from "@/components/WeatherModal";
import WeatherBadge from "@/app/vibe/WeatherBadge";
import NewsContent from "@/app/vibe/NewsContent";
import { C } from "@/app/vibe/styles";
import { WeatherData as VWeatherData, DayForecast as VDayForecast } from "@/app/vibe/types";
import { reverseGeocode } from "@/app/vibe/helpers";

const OWM_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

interface OpenWeatherCurrentResponse {
  name: string;
  weather: Array<{ id: number }>;
  main: { temp: number };
  wind: { speed: number };
  coord: { lon: number; lat: number };
}

interface OpenWeatherOneCallResponse {
  hourly?: Array<{ dt: number; temp: number }>;
  daily: Array<{
    dt: number;
    temp: { max: number; min: number };
    weather: Array<{ id: number }>;
    pop?: number;
    wind_speed?: number;
  }>;
}

interface OpenMeteoResponse {
  current_weather?: {
    temperature?: number;
    weathercode?: number;
    windspeed?: number;
  };
  hourly?: {
    temperature_2m?: number[];
  };
  daily?: {
    time?: string[];
    weathercode?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    windspeed_10m_max?: number[];
  };
}

interface OpenWeatherReverseGeoItem {
  name: string;
  local_names?: Record<string, string>;
}

interface IpApiResponse {
  latitude?: number;
  longitude?: number;
}

export default function SoreaVibe() {
  const [weatherData, setWeatherData] = useState<VWeatherData | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = false;

  const fetchWeather = useCallback(async (): Promise<boolean> => {
    try {
      // Try navigator geolocation first (client-side) to get exact city
      let lat: number | undefined;
      let lon: number | undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator?.geolocation) return reject(new Error("No geolocation"));
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch {
        // ignore: will fallback to IP coords then city id
      }

      // Fallback without browser permission: approximate IP geolocation
      if (typeof lat !== "number" || typeof lon !== "number") {
        try {
          const ipRes = await fetch("https://ipapi.co/json/");
          if (ipRes.ok) {
            const ipData: IpApiResponse = await ipRes.json();
            if (typeof ipData.latitude === "number" && typeof ipData.longitude === "number") {
              lat = ipData.latitude;
              lon = ipData.longitude;
            }
          }
        } catch {
          // ignore: will fallback to city id
        }
      }

      // No OpenWeather key: fallback to Open-Meteo (no key required) with real coords
      if (!OWM_API_KEY) {
        if (typeof lat !== "number" || typeof lon !== "number") {
          return false;
        }

        const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=auto`;
        const meteoRes = await fetch(meteoUrl);
        if (!meteoRes.ok) {
          throw new Error(`Open-Meteo failed (${meteoRes.status})`);
        }
        const meteo: OpenMeteoResponse = await meteoRes.json();

        const cityFromGeo = await reverseGeocode(lat, lon);
        const cityName = cityFromGeo && cityFromGeo !== "Localité inconnue" ? cityFromGeo : "Ville inconnue";

        const hourlyTemps = (meteo.hourly?.temperature_2m ?? []).slice(0, 24).filter((_, index) => index % 3 === 0);
        const dailyTime = meteo.daily?.time ?? [];
        const dailyCode = meteo.daily?.weathercode ?? [];
        const dailyMax = meteo.daily?.temperature_2m_max ?? [];
        const dailyMin = meteo.daily?.temperature_2m_min ?? [];
        const dailyPrecip = meteo.daily?.precipitation_probability_max ?? [];
        const dailyWind = meteo.daily?.windspeed_10m_max ?? [];

        const days: VDayForecast[] = dailyTime.slice(0, 7).map((dateStr, index) => ({
          date: new Date(dateStr),
          code: dailyCode[index] ?? meteo.current_weather?.weathercode ?? 0,
          maxTemp: Math.round(dailyMax[index] ?? meteo.current_weather?.temperature ?? 0),
          minTemp: Math.round(dailyMin[index] ?? meteo.current_weather?.temperature ?? 0),
          precipProb: Math.round(dailyPrecip[index] ?? 0),
          windMax: Math.round(dailyWind[index] ?? meteo.current_weather?.windspeed ?? 0),
          hourlyTemps: index === 0 ? hourlyTemps : undefined,
        }));

        setWeatherData({
          currentTemp: Math.round(meteo.current_weather?.temperature ?? 0),
          currentCode: meteo.current_weather?.weathercode ?? 0,
          windSpeed: Math.round(meteo.current_weather?.windspeed ?? 0),
          cityName,
          lat,
          lon,
          forecast7: days,
        });
        return true;
      }

      if (typeof lat !== "number" || typeof lon !== "number") {
        return false;
      }

      let current: OpenWeatherCurrentResponse;
      {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=metric&lang=fr`;
        const currentRes = await fetch(currentUrl);
        if (!currentRes.ok) throw new Error(`OpenWeatherMap current weather failed (${currentRes.status})`);
        current = await currentRes.json();

        const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=metric&lang=fr&exclude=minutely,alerts`;
        const oneCallRes = await fetch(oneCallUrl);
        if (!oneCallRes.ok) throw new Error(`OpenWeatherMap forecast failed (${oneCallRes.status})`);
        const forecast: OpenWeatherOneCallResponse = await oneCallRes.json();

        const hourlyTemps = (forecast.hourly ?? []).slice(0, 24).filter((_, index) => index % 3 === 0).map(hour => hour.temp);
        const days: VDayForecast[] = (forecast.daily ?? []).slice(0, 7).map((day, index) => ({
          date: new Date(day.dt * 1000),
          code: day.weather?.[0]?.id ?? current.weather?.[0]?.id ?? 800,
          maxTemp: Math.round(day.temp.max),
          minTemp: Math.round(day.temp.min),
          precipProb: Math.round((day.pop ?? 0) * 100),
          windMax: Math.round(day.wind_speed ?? current.wind.speed),
          hourlyTemps: index === 0 ? hourlyTemps : undefined,
        }));

        let cityName = current.name || "Ville inconnue";
        try {
          const reverseUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_API_KEY}`;
          const reverseRes = await fetch(reverseUrl);
          if (reverseRes.ok) {
            const reverseItems: OpenWeatherReverseGeoItem[] = await reverseRes.json();
            const top = reverseItems?.[0];
            const preferred = top?.local_names?.fr || top?.name;
            if (preferred) cityName = preferred;
          }
        } catch {
          // ignore and fallback below
        }

        if (!cityName || cityName === "Ville inconnue") {
          const geocodedCity = await reverseGeocode(lat, lon);
          if (geocodedCity && geocodedCity !== "Localité inconnue") {
            cityName = geocodedCity;
          }
        }

        setWeatherData({
          currentTemp: Math.round(current.main.temp),
          currentCode: current.weather?.[0]?.id ?? 800,
          windSpeed: Math.round(current.wind.speed),
          cityName,
          lat,
          lon,
          forecast7: days,
        });
        return true;
      }
    } catch { /* fail silently */ }
    return false;
  }, []);

  useEffect(() => {
    (async () => { await fetchWeather(); })();
  }, [fetchWeather]);

  function handleMagazine() {
    window.location.href = isLoggedIn ? "/carnet" : "/login";
  }

  return (
    <>
      <style>{`
        @import url('https://www.dimdams.com/font-awesome/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&display=swap');
        * { box-sizing: border-box; }

        .sorea-navbar-wrapper { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
        .weather-badge-wrapper { position: fixed; top: 54px; right: 24px; z-index: 110; }
        .weather-badge-btn { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.92); border: 1px solid #EDEAF7; border-radius: 30px; padding: 5px 12px; cursor: pointer; backdrop-filter: blur(8px); box-shadow: 0 2px 12px rgba(123,63,228,0.12); transition: border-color 0.18s, box-shadow 0.18s; }
        .weather-badge-btn:hover { border-color: #38D9C0; box-shadow: 0 0 0 3px rgba(56,217,192,0.18); }
        .arrow-btn { background: none; border: none; color: ${C.purple}; font-size: 32px; font-weight: 900; cursor: pointer; padding: 0 6px; line-height: 1; flex-shrink: 0; user-select: none; transition: transform 0.15s, color 0.15s, filter 0.15s; }
        .arrow-btn:hover { transform: scale(1.3); color: #bf80ff; filter: drop-shadow(0 0 8px rgba(123,63,228,0.75)); }
        .sorea-cta { display: inline-block; padding: 14px 52px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; letter-spacing: 0.2px; background: ${C.cardBg}; color: ${C.purple}; box-shadow: 0 3px 0 #D8D3E8, 0 2px 12px rgba(0,0,0,0.06); transition: background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease; }
        .sorea-cta:hover { background: linear-gradient(93.09deg,#8B47FF 0%,#BA98F4 100%); color: #fff; box-shadow: 0 3px 0 #D8D3E8, 0 6px 22px rgba(123,63,228,0.32); }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
        <div ref={navRef} className="sorea-navbar-wrapper"><Navbar /></div>
        <div className="weather-badge-wrapper"><WeatherBadge data={weatherData} onClick={() => setShowWeather(true)} /></div>
        {showWeather && <WeatherModal data={weatherData} onClose={() => setShowWeather(false)} onRetry={fetchWeather} />}

        <main style={{ paddingTop: 80, paddingLeft: 32, paddingRight: 32, paddingBottom: 80 }}>
          <h1 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,46px)", fontWeight: 950, color: C.textDark, margin: "40px 0 12px", letterSpacing: -0.5 }}>SOREA Vibe</h1>
          <p style={{ textAlign: "center", fontSize: 18, color: C.textDark, fontWeight: 400, margin: "0 0 50px", opacity: 0.85 }}>Inspiration, conseils bien-être et nouveautés SOREA au quotidien.</p>

          <NewsContent weatherData={weatherData} onOpenWeather={() => setShowWeather(true)} />

          <div style={{ textAlign: "center", marginTop: 64 }}>
            <button className="sorea-cta" onClick={handleMagazine}>Recevoir mon magazine</button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
