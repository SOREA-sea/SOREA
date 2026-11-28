import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";
import { validatePassword } from "@/app/api/utils/validation";

/**
 * POST /api/auth/reinitialiser : { token, newPassword }
 * Termine « Mot de passe oublié » : le lien reçu par e-mail (valable 1 heure, une seule fois) permet de choisir
 * un nouveau mot de passe. Toutes les connexions ouvertes sont fermées : il faut se reconnecter partout.
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!checkRateLimit(`reinitialiser-ip:${ip}`, 10, 15 * 60_000).allowed) {
      return NextResponse.json({ error: "Trop de tentatives. Réessaie dans quelques minutes." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const token = typeof body.token === "string" ? body.token : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json({ error: "Ce lien n'est pas valide. Refais une demande." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: crypto.createHash("sha256").update(token).digest("hex"),
        passwordResetExpiry: { gt: new Date() },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Ce lien a expiré ou a déjà servi. Refais une demande." }, { status: 400 });
    }

    const verification = validatePassword(
      newPassword,
      user.firstName,
      user.lastName,
      user.email,
      user.birthDate ? user.birthDate.toISOString().slice(0, 10) : undefined
    );
    if (!verification.valid) return NextResponse.json({ error: verification.message }, { status: 400 });

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: await bcrypt.hash(newPassword, 12),
          passwordResetTokenHash: null,
          passwordResetExpiry: null,
        },
      }),
      prisma.userSession.deleteMany({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({ message: "Mot de passe modifié" });
  } catch (error) {
    console.error("Erreur réinitialisation du mot de passe:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
