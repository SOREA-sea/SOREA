import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/app/api/middleware/auth";
import { generateTwoFactorSecret } from "@/app/api/utils/two-factor";

/**
 * GET /api/auth/2fa/setup
 * Génère un secret 2FA et un QR code pour l'utilisateur
 * Nécessite une authentification
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth();

    if (!("id" in auth)) {
      return auth; // Retourne la réponse d'erreur d'authentification
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Si 2FA est déjà activé, empêcher la génération d'un nouveau secret
    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "L'authentification à deux facteurs est déjà activée." },
        { status: 400 }
      );
    }

    // Générer le secret et le QR code
    const { secret, qrCode, backupCodes } = await generateTwoFactorSecret(
      user.email,
      "SOREA"
    );

    return NextResponse.json(
      {
        message: "Secret 2FA généré avec succès",
        secret,
        qrCode,
        backupCodes,
        instructions: [
          "1. Téléchargez Google Authenticator, Microsoft Authenticator, ou Authy",
          "2. Scannez le QR code avec votre application d'authentification",
          "3. Conservez les codes de secours dans un endroit sûr",
          "4. Vérifiez le code 6 chiffres de votre application",
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la génération du secret 2FA:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la génération du secret 2FA." },
      { status: 500 }
    );
  }
}
