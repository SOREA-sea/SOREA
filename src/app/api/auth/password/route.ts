import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";
import { validatePassword } from "@/app/api/utils/validation";

/**
 * POST /api/auth/password : changer son mot de passe (rubrique Sécurité de /dashboard/profile).
 * Body : { currentPassword, newPassword }
 * - le mot de passe actuel est vérifié (5 essais par quart d'heure) ;
 * - le nouveau suit les mêmes règles qu'à l'inscription et doit être différent de l'actuel ;
 * - les autres connexions sont fermées : seul cet appareil reste connecté.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;
    if (!sessionId) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!session || session.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }
    const user = session.user;

    const limite = checkRateLimit(`changement-mdp:${user.id}`, 5, 15 * 60_000);
    if (!limite.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Les deux mots de passe sont requis." }, { status: 400 });
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit être différent de l'actuel." },
        { status: 400 }
      );
    }

    const verification = validatePassword(
      newPassword,
      user.firstName,
      user.lastName,
      user.email,
      user.birthDate ? user.birthDate.toISOString().slice(0, 10) : undefined
    );
    if (!verification.valid) {
      return NextResponse.json({ error: verification.message }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });

    // Quelqu'un qui connaîtrait l'ancien mot de passe ne garde pas l'accès : on ferme les autres connexions
    const fermees = await prisma.userSession.deleteMany({
      where: { userId: user.id, id: { not: sessionId } },
    });

    return NextResponse.json({ message: "Mot de passe modifié", autresConnexionsFermees: fermees.count });
  } catch (error) {
    console.error("Erreur changement de mot de passe:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
