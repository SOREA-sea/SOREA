import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/app/api/middleware/auth";
import bcrypt from "bcrypt";

/**
 * POST /api/auth/2fa/disable
 * Désactive la 2FA pour l'utilisateur
 * Body: { password: string } (confirmation du mot de passe)
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();

    if (!("id" in auth)) {
      return auth;
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Le mot de passe est requis pour désactiver la 2FA." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        password: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "La 2FA n'est pas activée pour ce compte." },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Désactiver la 2FA
    const updatedUser = await prisma.user.update({
      where: { id: auth.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    return NextResponse.json(
      {
        message: "Authentification à deux facteurs désactivée avec succès.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la désactivation de la 2FA:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la désactivation de la 2FA." },
      { status: 500 }
    );
  }
}
