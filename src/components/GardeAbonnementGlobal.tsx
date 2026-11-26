"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FrameAbonnement from "@/components/FrameAbonnement";

// Pages réservées aux abonnés (hors /dashboard, déjà protégé par son propre layout).
// Une adresse protège aussi tout ce qui est en dessous : "/wheel" protège "/wheel/bien-etre".
const PAGES_PROTEGEES = [
  "/Wheel-Spinner", 
  "/Wheel-Spinner/BienEtre",
  "/Wheel-Spinner/Nutrition",
  "/Wheel-Spinner/Sport",
  "/mirror/miroir",
  "/mirror/welcomemirror",
  "/visualization/visualisation",
  "/visualization/welcomevisualization",
  "/suivi",
];

export default function GardeAbonnementGlobal() {
  const pathname = usePathname();
  const [essaiTermine, setEssaiTermine] = useState(false);

  const protegee = PAGES_PROTEGEES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (!protegee) {
      setEssaiTermine(false);
      return;
    }
    let annule = false;
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (annule) return;
        const u = data?.user;
        const fini =
          !!u?.trialEndsAt &&
          new Date(u.trialEndsAt) <= new Date() &&
          u.subscriptionStatus !== "trialing" &&
          u.subscriptionStatus !== "active";
        setEssaiTermine(fini);
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, [protegee, pathname]);

  if (!protegee || !essaiTermine) return null;
  return <FrameAbonnement />;
}