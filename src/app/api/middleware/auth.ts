import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Vérifie si l'utilisateur est authentifié via son cookie de session
export async function getUserFromRequest() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;
    
    if (!sessionId) return null; // ← plus de fallback 2fa_temp_*

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) return null;

    return session.user;
  } catch (error) {
    console.error("Erreur getUserFromRequest:", error);
    return null;
  }
}

    // 2. Chercher une session temporaire 2FA (2fa_temp_*)
    // Les cookies 2FA temp sont stockés avec le pattern: 2fa_temp_${tempSessionId}
    const allCookies = unparsedCookies.getAll();
    for (const cookie of allCookies) {
      if (cookie.name.startsWith("2fa_temp_")) {
        try {
          const tempSessionData = JSON.parse(cookie.value);
          if (tempSessionData.userId) {
            // Valider que l'utilisateur existe
            const user = await prisma.user.findUnique({
              where: { id: tempSessionData.userId },
            });
            if (user) {
              return user;
            }
          }
        } catch (parseError) {
          // Ignorer les cookies corrompus
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Erreur lors de l'extraction de l'utilisateur:", error);
    return null;
  }
}

// Helper pour sécuriser les routes API, retourne Response (NextResponse) ou User
export async function requireAuth(role?: string) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (role && user.role !== role) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  return user;
}
