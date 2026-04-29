import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Vérifie si l'utilisateur est authentifié via son cookie de session
export async function getUserFromRequest() {
  try {
    const unparsedCookies = await cookies();
    const sessionId = unparsedCookies.get("sorea_session")?.value;

    if (!sessionId) return null;

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
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
