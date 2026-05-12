import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validateEmailFormat, validatePassword } from "@/app/api//utils/validation";
import { generateTwoFactorSecret, generateBackupCodes } from "@/app/api//utils/two-factor";

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

    // ── 6. Génération 2FA ────────────────────────────────────────────────────
    const twoFactorSetup = await generateTwoFactorSecret(email);
    const backupCodes = generateBackupCodes(8);

    // ── 7. Cookie temporaire (compte PAS encore créé) ────────────────────────
    const pendingId = crypto.randomUUID();
    const pendingData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: isCoach ? "coach" : "user",
      birthDate: birthDate ?? null,
      totpSecret: twoFactorSetup.manualEntryKey,
      backupCodes,             // en clair ici, hashés dans confirm
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const cookieStore = await cookies();
    cookieStore.set(`pending_register_${pendingId}`, JSON.stringify(pendingData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60, // 10 minutes
      path: "/",
    });

    // ── 8. Retourner QR code (compte non créé, en attente de confirmation) ───
    return NextResponse.json({
      pendingId,
      qrCodeUrl: twoFactorSetup.qrCodeUrl,
      manualEntryKey: twoFactorSetup.manualEntryKey,
      backupCodes,
      message: "Scannez le QR code avec Google Authenticator puis entrez le code.",
    }, { status: 200 });

  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'inscription." },
      { status: 500 }
    );
  }
}