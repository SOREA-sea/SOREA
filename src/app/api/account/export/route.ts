import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { utilisateurConnecte } from "@/lib/utilisateurConnecte";
import { decrireAppareil } from "@/lib/appareil";

/**
 * GET /api/account/export : télécharger toutes ses données (droits d'accès et de portabilité, RGPD articles 15 et 20).
 * Fichier JSON : compte, suivi, carnet, achats, coaching, favoris, connexions.
 * Disponible même sans consentement aux données de santé : ce sont ses propres données.
 * Jamais exportés : mot de passe (même chiffré), secrets de la double authentification, jetons (session, e-mail,
 * mot de passe oublié) et identifiants techniques des connexions.
 */
export async function GET() {
  try {
    const user = await utilisateurConnecte();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const complet = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        menstrualProfile: true,
        periodHistories: { orderBy: { startDate: "asc" } },
        cycleDays: { orderBy: { day: "asc" } },
        symptomLogs: { orderBy: { date: "asc" } },
        moodEntries: { orderBy: { date: "asc" } },
        dailyFeelings: { orderBy: { date: "asc" } },
        journalNotes: { orderBy: { createdAt: "asc" } },
        quickNotes: { orderBy: { createdAt: "asc" } },
        habitChecks: true,
        challengeItems: { include: { completions: true } },
        hobbyCategories: { include: { items: true } },
        orders: { include: { items: true, gameItems: true } },
        payments: true,
        carts: { include: { items: true, gameItems: true } },
        bookings: true,
        coachReviews: true,
        sessionReviews: true,
        coachComments: true,
        sessionComments: true,
        favoriteProducts: true,
        gameFavoriteProducts: true,
        favoriteCoaches: true,
        favoriteSessions: true,
        purchasedShopProducts: true,
        purchasedGameProducts: true,
        coachProfile: true,
        suppliers: true,
        vibeNews: true,
        sessions: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!complet) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

    // Secrets retirés du fichier
    const { sessions, ...donnees } = complet;
    const SECRETS = ["password", "twoFactorSecret", "twoFactorBackupCodes", "emailVerificationToken", "passwordResetTokenHash"] as const;
    for (const cle of SECRETS) delete (donnees as Partial<typeof donnees>)[cle];

    const fichier = {
      export: {
        application: "SOREA",
        genereLe: new Date().toISOString(),
        contenu:
          "Toutes les données liées à ton compte. Le mot de passe, les secrets de la double authentification et les jetons de connexion ne sont jamais exportés.",
      },
      ...donnees,
      connexions: sessions.map((s) => ({
        appareil: decrireAppareil(s.userAgent),
        connecteeLe: s.createdAt,
      })),
    };

    const jour = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(fichier, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="SOREA_mes_donnees_${jour}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erreur export des données:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
