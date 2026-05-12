// src/lib/auth.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Vérifie si l'utilisateur est authentifié via son cookie de session
export async function getUserFromRequest() {
  try {
    const cookieStore = await cookies();

    // 1. Chercher la session principale
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (sessionId) {
      const session = await prisma.userSession.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (session && session.expiresAt >= new Date()) {
        return session.user;
      }
    }

    // 2. Chercher une session temporaire 2FA (2fa_temp_*)
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      if (cookie.name.startsWith("2fa_temp_")) {
        try {
          const tempSessionData = JSON.parse(cookie.value);
          if (tempSessionData.userId) {
            const user = await prisma.user.findUnique({
              where: { id: tempSessionData.userId },
            });
            if (user) return user;
          }
        } catch {
          // Ignorer les cookies corrompus
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Erreur getUserFromRequest:", error);
    return null;
  }
}

// Sécuriser les routes API — retourne NextResponse (erreur) ou l'utilisateur
export async function requireAuth(role?: string) {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (role && user.role !== role) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  return user;
}