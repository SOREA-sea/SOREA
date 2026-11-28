import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Utilisatrice de la session en cours (cookie « sorea_session »), ou null si personne n'est connecté.
export async function utilisateurConnecte() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;
  if (!sessionId) return null;
  const session = await prisma.userSession.findUnique({ where: { id: sessionId }, include: { user: true } });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}
