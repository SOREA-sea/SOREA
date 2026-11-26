"use client";

import FrameAbonnement from "@/components/FrameAbonnement";

// Affiche la frame d'abonnement quand l'essai est terminé et qu'il n'y a pas d'abonnement actif.
// La croix la ferme jusqu'au prochain rechargement de la page.
export default function GardeAbonnement({ essaiTermine }: { essaiTermine: boolean }) {
  if (!essaiTermine) return null;
  return <FrameAbonnement />;
}