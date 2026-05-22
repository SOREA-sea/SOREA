"use client";
import React, { useState } from "react";
import { C } from "./styles";

export interface VibeCardProps { children: React.ReactNode; variant?: "purple"|"teal"; style?: React.CSSProperties }
export function VibeCard({ children, variant = "purple", style = {} }: VibeCardProps) {
  const [hovered, setHovered] = useState(false);
  const gb = variant === "purple"
    ? "linear-gradient(135deg,#E879F9 0%,#38D9C0 100%)"
    : "linear-gradient(135deg,#38D9C0 0%,#E879F9 100%)";
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 18, padding: hovered ? 2 : 1.5, background: hovered ? gb : C.border,
        boxShadow: hovered ? "0 0 0 4px rgba(56,217,192,0.18),0 16px 56px rgba(123,63,228,0.18)" : "0 2px 16px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(.175,.885,.32,1.275)", ...style }}>
      <div style={{ background: C.cardBg, borderRadius: 16, overflow: "hidden", height: "100%", minHeight: (style as any).minHeight }}>
        {children}
      </div>
    </div>
  );
}

export function Dots({ count, current }: { count: number; current: number }) {
  return (
    <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 99,
          background: i === current ? C.purple : "#D8D3F0", transition: "all 0.3s" }} />
      ))}
    </div>
  );
}
