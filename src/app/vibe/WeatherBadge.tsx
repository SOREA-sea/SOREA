"use client";
import React from "react";
import { WeatherData } from "./types";
import { wIcon } from "./helpers";
import { C } from "./styles";

export default function WeatherBadge({ data, onClick }: { data: WeatherData | null; onClick: () => void }) {
  return (
    <button onClick={onClick} className="weather-badge-btn" title="Météo — cliquer pour les prévisions">
      <span style={{ fontSize: 20 }}>{data ? wIcon(data.currentCode) : "🌡️"}</span>
      {data && (
        <span style={{ fontSize: 13, fontWeight: 800, color: C.textDark, fontFamily: "'DM Sans', sans-serif" }}>
          {data.currentTemp}°
        </span>
      )}
    </button>
  );
}
