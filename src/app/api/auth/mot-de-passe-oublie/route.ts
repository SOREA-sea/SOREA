import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";
import { envoyerEmail } from "@/lib/email";

/**
 * POST /api/auth/mot-de-passe-oublie : { email }
 * Envoie un lien de réinitialisation, valable 1 heure et utilisable une seule fois.
 * La réponse est toujours la même, que le compte existe ou non : on ne révèle pas quelles adresses sont inscrites.
 * Seule l'empreinte du lien est enregistrée en base.
 */

const REPONSE = {
  message: "Si un compte existe avec cette adresse, un e-mail vient de t'être envoyé. Pense à regarder dans tes courriers indésirables.",
};

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!checkRateLimit(`mdp-oublie-ip:${ip}`, 5, 15 * 60_000).allowed) {
      return NextResponse.json({ error: "Trop de demandes. Réessaie dans quelques minutes." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }

    // 3 e-mails par heure au plus pour une même adresse (on répond pareil, sans rien envoyer)
    if (!checkRateLimit(`mdp-oublie-email:${email}`, 3, 60 * 60_000).allowed) {
      return NextResponse.json(REPONSE);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return NextResponse.json(REPONSE);

    const jeton = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: crypto.createHash("sha256").update(jeton).digest("hex"),
        passwordResetExpiry: new Date(Date.now() + 60 * 60_000),
      },
    });

    const origine = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const lien = `${origine}/reinitialiser-mot-de-passe?token=${jeton}`;

    await envoyerEmail({
      to: user.email,
      subject: "SOREA : choisis un nouveau mot de passe",
      text:
        `Bonjour ${user.firstName},\n\n` +
        `Tu as demandé à changer ton mot de passe SOREA. Clique sur ce lien pour en choisir un nouveau (valable 1 heure) :\n${lien}\n\n` +
        `Si ce n'est pas toi, ignore cet e-mail : ton mot de passe actuel reste valable.\n\nL'équipe SOREA`,
      html:
        `<p>Bonjour ${user.firstName.replace(/[<>&"]/g, "")},</p>` +
        `<p>Tu as demandé à changer ton mot de passe SOREA. Clique sur le lien ci-dessous pour en choisir un nouveau (valable 1 heure) :</p>` +
        `<p><a href="${lien}">Choisir un nouveau mot de passe</a></p>` +
        `<p>Si ce n'est pas toi, ignore cet e-mail : ton mot de passe actuel reste valable.</p><p>L'équipe SOREA</p>`,
    });

    return NextResponse.json(REPONSE);
  } catch (error) {
    console.error("Erreur mot de passe oublié:", error);
    return NextResponse.json({ error: "Impossible d'envoyer l'e-mail pour le moment. Réessaie plus tard." }, { status: 500 });
  }
}
