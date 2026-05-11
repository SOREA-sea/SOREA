import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, isPostRegistration } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "L'email et le mot de passe sont requis" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        password: true,
        isActive: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Si c'est un auto-login post-inscription OU si 2FA est activée, créer une session temporaire
    if (isPostRegistration || user.twoFactorEnabled) {
      const tempSessionId = crypto.randomBytes(16).toString('hex');
      const tempSessionData = JSON.stringify({ userId: user.id });

      // Sauvegarder les données de session temporaire dans un cookie sécurisé (expire dans 10 minutes)
      const cookieStore = await cookies();
      cookieStore.set(`2fa_temp_${tempSessionId}`, tempSessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600, // 10 minutes
        path: "/",
      });

      return NextResponse.json(
        {
          message: "Authentification à deux facteurs requise",
          requiresTwoFactor: true,
          tempSessionId,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
        { status: 206 } // 206 = Partial Content
      );
    }

    // Créer la session en base de données (expire dans 7 jours)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    // Définir le cookie sécurisé "sorea_session"
    const cookieStore = await cookies();
    cookieStore.set("sorea_session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

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
    console.error("Erreur login:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}