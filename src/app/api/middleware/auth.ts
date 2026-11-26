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

    // Un cookie 2fa_temp_* ne connecte PAS l'utilisateur : il ne sert qu'à
    // /api/auth/2fa/verify-login, qui crée la vraie session une fois le code 2FA validé.
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
  // Normalise la casse et les espaces avant de comparer
  if (role && !user.role?.toLowerCase().trim().split(",").map((r) => r.trim()).includes(role.toLowerCase())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  return user;
}