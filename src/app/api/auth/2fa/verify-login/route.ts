import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { verifyTwoFactorToken, isValidTotpTokenFormat } from "@/app/api/utils/two-factor";

/**
 * POST /api/auth/2fa/verify-login
 * Vérifie le code TOTP lors de la connexion
 * Body: { tempSessionId: string, code: string, backupCode?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tempSessionId, code, backupCode } = body;

    if (!tempSessionId) {
      return NextResponse.json(
        { error: "ID de session temporaire requis." },
        { status: 400 }
      );
    }

    if (!code && !backupCode) {
      return NextResponse.json(
        { error: "Code TOTP ou code de secours requis." },
        { status: 400 }
      );
    }

    // Valider le format du code TOTP si fourni
    if (code && !isValidTotpTokenFormat(code)) {
      return NextResponse.json(
        { error: "Le code TOTP doit être 6 chiffres." },
        { status: 400 }
      );
    }

    // Récupérer les données de session temporaire depuis Redis/Cache
    // Pour cette implémentation, on utilise un cookie sécurisé
    const cookieStore = await cookies();
    const tempSessionData = cookieStore.get(`2fa_temp_${tempSessionId}`)?.value;

    if (!tempSessionData) {
      return NextResponse.json(
        { error: "Session temporaire expirée. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }

    const { userId } = JSON.parse(tempSessionData);

    // Récupérer l'utilisateur avec le secret 2FA
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé ou inactif" },
        { status: 401 }
      );
    }

    let tokenValid = false;

    // Vérifier le code TOTP
    if (code && user.twoFactorSecret) {
      tokenValid = verifyTwoFactorToken(user.twoFactorSecret, code);
    }

    // Vérifier le code de secours si fourni
    if (backupCode && !tokenValid && user.twoFactorBackupCodes) {
      try {
        const hashedBackupCodes = JSON.parse(user.twoFactorBackupCodes);
        for (const hashedCode of hashedBackupCodes) {
          const codeMatch = await bcrypt.compare(backupCode, hashedCode);
          if (codeMatch) {
            tokenValid = true;
            // Supprimer le code de secours utilisé (optionnel)
            // await prisma.user.update({
            //   where: { id: userId },
            //   data: {
            //     twoFactorBackupCodes: JSON.stringify(
            //       hashedBackupCodes.filter((h: string) => h !== hashedCode)
            //     ),
            //   },
            // });
            break;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du code de secours:", error);
      }
    }

    if (!tokenValid) {
      return NextResponse.json(
        { error: "Code 2FA incorrect ou expiré." },
        { status: 401 }
      );
    }

    // Créer la session complète en base de données
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    // Définir le cookie sécurisé "sorea_session"
    const cookies_store = await cookies();
    cookies_store.set("sorea_session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    // Supprimer le cookie de session temporaire
    cookies_store.delete(`2fa_temp_${tempSessionId}`);

    return NextResponse.json(
      {
        message: "Connexion réussie",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la vérification 2FA du login:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la vérification 2FA." },
      { status: 500 }
    );
  }
}
