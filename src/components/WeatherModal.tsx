"use client";
import React from "react";
import { WeatherData } from "@/app/vibe/types";
import { C } from "@/app/vibe/styles";
import { wIcon, wLabel, shortDay } from "@/app/vibe/helpers";

export default function WeatherModal({ data, onClose }:{ data: WeatherData; onClose: () => void }){
  const { forecast7, cityName } = data;
  const today = forecast7[0];
  const hours = today?.hourlyTemps ?? [];
  const labels = ["0h","3h","6h","9h","12h","15h","18h","21h"];
  const hourlyPts = hours.length >= 8 ? hours.slice(0, 8) : [];
  const minT = hourlyPts.length ? Math.min(...hourlyPts) - 2 : 0;
  const maxT = hourlyPts.length ? Math.max(...hourlyPts) + 2 : 30;
  const toY = (t: number) => 10 + (1 - (t - minT) / (maxT - minT)) * 80;
  const pts = hourlyPts.map((t, i) => `${(i / (hourlyPts.length - 1)) * 260 + 20},${toY(t)}`).join(" ");

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(45,34,85,0.4)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(145deg,#F5F0FF,#E8FAF8)",
          borderRadius: 24, padding: "24px 28px", maxWidth: 520, width: "100%",
          boxShadow: "0 24px 64px rgba(123,63,228,0.25)", border: "1.5px solid rgba(56,217,192,0.3)",
          position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16,
            background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.textGray }}>✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 32 }}>{wIcon(data.currentCode)}</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22, color: C.textDark, fontFamily: "'DM Sans', sans-serif" }}>
              {data.currentTemp}°C — {wLabel(data.currentCode)}
            </div>
            <div style={{ fontSize: 13, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>
              📍 {cityName} · Vent {data.windSpeed} km/h
            </div>
          </div>
        </div>

        {hourlyPts.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.75)", borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.textGray, fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Température aujourd'hui
            </div>
            <svg viewBox="0 0 300 110" width="100%" style={{ overflow: "visible" }}>
              {[0,25,50,75,100].map(y => (
                <line key={y} x1="20" y1={10 + y * 0.8} x2="280" y2={10 + y * 0.8}
                  stroke="#EDEAF7" strokeWidth="0.8" />
              ))}
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A87AFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#A87AFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`20,90 ${pts} ${(hourlyPts.length - 1) / (hourlyPts.length - 1) * 260 + 20},90`} fill="url(#tempGrad)" />
              <polyline points={pts} fill="none" stroke="#7B3FE4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {hourlyPts.map((t, i) => {
                const x = (i / (hourlyPts.length - 1)) * 260 + 20;
                const y = toY(t);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3.5" fill="#7B3FE4" />
                    <text x={x} y={y - 7} textAnchor="middle" fontSize="9" fill="#7B3FE4" fontWeight="700">{Math.round(t)}°</text>
                    <text x={x} y="105" textAnchor="middle" fontSize="9" fill={C.textGray}>{labels[i]}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        <div style={{ background: "linear-gradient(145deg,#E8F4FF,#EDE6FF)", borderRadius: 16,
            height: 110, display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, border: "1px dashed #C9A8FF", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 28 }}>🗺️</span>
          <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>
            📍 {cityName} — carte météo locale
          </span>
          <span style={{ fontSize: 10, color: "#C9A8FF", fontFamily: "'DM Sans', sans-serif" }}>
            (intégrer ici : OpenWeatherMap map tiles ou Leaflet)
          </span>
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: C.textGray, fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          Prévisions 7 jours
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {forecast7.map((day, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(255,255,255,0.75)", borderRadius: 12, padding: "9px 14px",
                border: i === 0 ? `1.5px solid ${C.teal}` : "1px solid transparent" }}>
              <div style={{ width: 38, fontWeight: 800, fontSize: 13,
                  color: i === 0 ? C.teal : C.textDark, fontFamily: "'DM Sans', sans-serif" }}>
                {i === 0 ? "Auj." : shortDay(day.date)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, marginLeft: 8 }}>
                <span style={{ fontSize: 22 }}>{wIcon(day.code)}</span>
                <span style={{ fontSize: 12, color: C.textGray, fontFamily: "'DM Sans', sans-serif" }}>{wLabel(day.code)}</span>
              </div>
              <div style={{ textAlign: "center", minWidth: 40 }}>
                <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Pluie</div>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.textDark, fontFamily: "'DM Sans', sans-serif" }}>{day.precipProb}%</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 68 }}>
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
