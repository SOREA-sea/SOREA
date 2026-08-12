import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer la session et vérifier l'expiration
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          }
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      // Session invalide ou expirée, nettoyer la BDD et le cookie
      if (session) {
        await prisma.userSession.delete({ where: { id: sessionId } });
      }
      cookieStore.delete("sorea_session");
      return NextResponse.json(
        { error: "Session expirée" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: session.user }, { status: 200 });

  } catch (error) {
    console.error("Erreur auth/me:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}