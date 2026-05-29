import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validateEmailFormat, validatePassword } from "@/app/api//utils/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, isCoach, birthDate } = body;

    // ── 1. Champs obligatoires ───────────────────────────────────────────────
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

   // --- 2. Validation Email (Renvoie un boolean) ---
    // On n'utilise pas .valid ici car c'est un simple boolean
    const isEmailOk = validateEmailFormat(email); 
    if (!isEmailOk) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // --- 3. Validation Password (Renvoie un objet) ---
    const passwordCheck = validatePassword(password, firstName, lastName, email, birthDate);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 });
    }

    // ── 4. Email déjà utilisé ────────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      );
    }

    // ── 5. Hash du mot de passe ──────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the user directly (registration does not force 2FA)

    // If 2FA not requested, create the user directly (2FA optional)
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: passwordHash,
        role: isCoach ? "coach" : "user",
        birthDate: birthDate ?? null,
        twoFactorEnabled: false,
      },
    });

    // create CoachProfile if needed
    if (isCoach) {
      await prisma.coachProfile.create({ data: { userId: user.id } });
    }

    // create session
    const session = await prisma.userSession.create({
      data: { userId: user.id, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });

    const cookieStore2 = await cookies();
    cookieStore2.set("sorea_session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'inscription." },
      { status: 500 }
    );
  }
}