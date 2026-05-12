import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyTwoFactorToken } from "@/app/api/utils/two-factor";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { pendingId, totpCode } = await req.json();

    if (!pendingId || !totpCode) {
      return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
    }

    // 1. Récupérer le cookie temporaire
    const cookieStore = await cookies();
    const raw = cookieStore.get(`pending_register_${pendingId}`)?.value;
    if (!raw) {
      return NextResponse.json(
        { error: "Session expirée. Recommencez l'inscription." },
        { status: 400 }
      );
    }

    const pending = JSON.parse(raw);

    // 2. Vérifier expiration
    if (Date.now() > pending.expiresAt) {
      cookieStore.delete(`pending_register_${pendingId}`);
      return NextResponse.json(
        { error: "Session expirée. Recommencez l'inscription." },
        { status: 400 }
      );
    }

    // 3. Vérifier le code TOTP
    const isValid = verifyTwoFactorToken(pending.totpSecret, totpCode);
    if (!isValid) {
      return NextResponse.json(
        { error: "Code incorrect. Vérifiez l'heure de votre téléphone et réessayez." },
        { status: 400 }
      );
    }

    // 4. Hasher les backup codes
    const hashedBackupCodes = pending.backupCodes.map((code: string) =>
      crypto.createHash("sha256").update(code).digest("hex")
    );

    // 5. Créer le compte maintenant
    // ↓ twoFactorBackupCodes est String? dans ton schéma → JSON.stringify
    const user = await prisma.user.create({
      data: {
        firstName: pending.firstName,
        lastName: pending.lastName,
        email: pending.email,
        password: pending.passwordHash,
        role: pending.role,
        twoFactorEnabled: true,
        twoFactorSecret: pending.totpSecret,
        twoFactorBackupCodes: JSON.stringify(hashedBackupCodes),
      },
    });

    // 6. Créer un CoachProfile si c'est un coach
    if (pending.role === "coach") {
      await prisma.coachProfile.create({
        data: { userId: user.id },
      });
    }

    // 7. Supprimer le cookie temporaire
    cookieStore.delete(`pending_register_${pendingId}`);

    // 8. Créer la session
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    cookieStore.set("sorea_session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Erreur confirm:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}