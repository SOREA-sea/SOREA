import nodemailer from "nodemailer";

// Envoi d'e-mails (mot de passe oublié...).
// Configuration dans .env : SMTP_HOST, SMTP_PORT (587 par défaut), SMTP_USER, SMTP_PASS, MAIL_FROM.
// Sans SMTP_HOST (développement), l'e-mail n'est pas envoyé : son contenu est écrit dans la console du serveur.

interface Email {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function envoyerEmail({ to, subject, text, html }: Email): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  // Absent ou encore à la valeur d'exemple « ... » : pas d'envoi
  if (!host || /^\.*$/.test(host)) {
    console.log(`\n[e-mail non envoyé : SMTP_HOST absent]\nÀ : ${to}\nObjet : ${subject}\n${text}\n`);
    return false;
  }
  const port = Number(process.env.SMTP_PORT) || 587;
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
  return true;
}
