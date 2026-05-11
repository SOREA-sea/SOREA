import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/app/api/middleware/auth";
import { verifyTwoFactorToken, isValidTotpTokenFormat } from "@/app/api/utils/two-factor";
import bcrypt from "bcrypt";

/**
 * POST /api/auth/2fa/verify
 * Vérifie le code TOTP et active la 2FA
 * Body: { secret: string, code: string, backupCodes: string[] }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();

    if (!("id" in auth)) {
      return auth; // Retourne la réponse d'erreur d'authentification
    }

    const body = await request.json();
    const { secret, code, backupCodes } = body;

    if (!secret || !code || !Array.isArray(backupCodes)) {
      return NextResponse.json(
        { error: "Secret, code et codes de secours sont requis." },
        { status: 400 }
      );
    }

    // Valider le format du code
    if (!isValidTotpTokenFormat(code)) {
      return NextResponse.json(
        { error: "Le code doit être 6 chiffres." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "L'authentification à deux facteurs est déjà activée." },
        { status: 400 }
      );
    }

    // Vérifier le code TOTP
    const tokenValid = verifyTwoFactorToken(secret, code);
    if (!tokenValid) {
      return NextResponse.json(
        { error: "Le code 2FA est incorrect ou expiré." },
        { status: 401 }
      );
    }

    // Hash les codes de secours
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    );

    // Sauvegarder le secret et les codes de secours hashés
    const updatedUser = await prisma.user.update({
      where: { id: auth.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: JSON.stringify(hashedBackupCodes),
      },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    return NextResponse.json(
      {
        message: "Authentification à deux facteurs activée avec succès.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la vérification du code 2FA:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la vérification du code 2FA." },
      { status: 500 }
    );
  }
}
