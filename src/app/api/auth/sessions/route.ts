import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { decrireAppareil } from "@/lib/appareil";

/**
 * Connexions actives de l'utilisatrice (rubrique Sécurité de /dashboard/profile).
 * L'identifiant d'une session est la valeur du cookie de connexion : il n'est JAMAIS renvoyé au navigateur.
 * Chaque connexion est désignée par une empreinte (« cle ») qui ne permet pas de se connecter.
 *
 * GET    : liste des connexions ouvertes, la connexion en cours en premier.
 * DELETE : { cle } ferme une autre connexion ; { autres: true } ferme toutes les autres.
 *          La connexion en cours se ferme avec « Se déconnecter » (/api/auth/logout).
 */

const empreinte = (id: string) => crypto.createHash("sha256").update(id).digest("hex").slice(0, 24);

async function sessionEnCours() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;
  if (!sessionId) return null;
  const session = await prisma.userSession.findUnique({ where: { id: sessionId } });
  if (!session || session.expiresAt <= new Date()) return null;
  return session;
}

export async function GET() {
  try {
    const actuelle = await sessionEnCours();
    if (!actuelle) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    // Ménage : les connexions expirées ne servent plus à rien
    await prisma.userSession.deleteMany({ where: { userId: actuelle.userId, expiresAt: { lte: new Date() } } });

    const sessions = await prisma.userSession.findMany({
      where: { userId: actuelle.userId },
      orderBy: { createdAt: "desc" },
    });

    const liste = sessions
      .map((s) => ({
        cle: empreinte(s.id),
        appareil: decrireAppareil(s.userAgent),
        connecteeLe: s.createdAt.toISOString(),
        actuelle: s.id === actuelle.id,
      }))
      .sort((a, b) => Number(b.actuelle) - Number(a.actuelle));

    return NextResponse.json({ sessions: liste });
  } catch (error) {
    console.error("Erreur liste des connexions:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const actuelle = await sessionEnCours();
    if (!actuelle) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const body = await request.json().catch(() => ({}));

    if (body.autres === true) {
      const fermees = await prisma.userSession.deleteMany({
        where: { userId: actuelle.userId, id: { not: actuelle.id } },
      });
      return NextResponse.json({ fermees: fermees.count });
    }

    if (typeof body.cle !== "string" || !body.cle) {
      return NextResponse.json({ error: "Connexion à fermer non précisée" }, { status: 400 });
    }
    if (body.cle === empreinte(actuelle.id)) {
      return NextResponse.json(
        { error: "Pour cet appareil, utilise « Se déconnecter »." },
        { status: 400 }
      );
    }

    // Seules les connexions de l'utilisatrice connectée sont cherchées
    const sessions = await prisma.userSession.findMany({
      where: { userId: actuelle.userId },
      select: { id: true },
    });
    const cible = sessions.find((s) => empreinte(s.id) === body.cle);
    if (!cible) return NextResponse.json({ error: "Connexion introuvable ou déjà fermée" }, { status: 404 });

    await prisma.userSession.delete({ where: { id: cible.id } });
    return NextResponse.json({ fermees: 1 });
  } catch (error) {
    console.error("Erreur fermeture de connexion:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
