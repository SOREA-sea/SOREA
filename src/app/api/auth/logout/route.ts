import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (sessionId) {
      // Supprimer la session de la base de données
      await prisma.userSession.deleteMany({
        where: { id: sessionId },
      });
    }

    // Supprimer le cookie
    cookieStore.delete("sorea_session");

    return NextResponse.json({ message: "Déconnexion réussie" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur lors de la déconnexion" },
      { status: 500 }
    );
  }
}