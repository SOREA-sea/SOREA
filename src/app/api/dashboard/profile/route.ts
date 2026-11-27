import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Retourne les infos profil du user connecté
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      twoFactorEnabled: user.twoFactorEnabled,
      role: user.role,
      createdAt: user.createdAt,
      timezone: user.timezone,
    });
  } catch (error) {
    console.error("Erreur dashboard/profile GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// PATCH — Met à jour le profil du user connecté
export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const texte = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const firstName = texte(body.firstName);
    const lastName = texte(body.lastName);
    const email = texte(body.email).toLowerCase();
    const timezone = texte(body.timezone);

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }
    if (timezone) {
      try {
        new Intl.DateTimeFormat("fr-FR", { timeZone: timezone });
      } catch {
        return NextResponse.json({ error: "Fuseau horaire invalide" }, { status: 400 });
      }
    }
    if (firstName.length > 60 || lastName.length > 60) {
      return NextResponse.json({ error: "Prénom ou nom trop long (60 caractères au maximum)" }, { status: 400 });
    }

    // Validation basique
    if (!firstName && !lastName && !email && !timezone) {
      return NextResponse.json(
        { error: "Au moins un champ à modifier est requis (firstName, lastName, email, timezone)" },
        { status: 400 }
      );
    }

    // Vérifier l'unicité de l'email si modifié
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé par un autre compte" },
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, string> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (timezone) updateData.timezone = timezone;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        timezone: true,
        twoFactorEnabled: true,
      },
    });

    return NextResponse.json({ message: "Profil mis à jour", user: updatedUser });
  } catch (error) {
    console.error("Erreur dashboard/profile PATCH:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}