"use client";
import React from "react";
import { WeatherData } from "./types";
import { wIcon } from "./helpers";
 

export default function WeatherBadge({ data, onClick }: { data: WeatherData | null; onClick: () => void }) {
  return (
    <button onClick={onClick} className="weather-badge-btn" title="Météo - cliquer pour les prévisions">
      <span style={{ fontSize: 20 }}>{data ? wIcon(data.currentCode) : "🌡️"}</span>
    </button>
  );
}
