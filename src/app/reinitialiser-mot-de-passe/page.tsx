import crypto from "crypto";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import FormulaireReinitialisation from "./FormulaireReinitialisation";

// Lien reçu par e-mail (« Mot de passe oublié ») : /reinitialiser-mot-de-passe?token=...
// L'heure d'expiration réelle du lien est lue en base pour le compte à rebours (null : lien inconnu, expiré ou déjà utilisé).
export default async function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const jeton = typeof token === "string" && /^[a-f0-9]{64}$/.test(token) ? token : "";

  let expireLe: number | null = null;
  if (jeton) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: crypto.createHash("sha256").update(jeton).digest("hex"),
        passwordResetExpiry: { gt: new Date() },
      },
      select: { passwordResetExpiry: true },
    });
    expireLe = user?.passwordResetExpiry?.getTime() ?? null;
  }

  return (
    <div className="relative min-h-screen flex flex-col text-gray-800">
      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pt-8">
        <Navbar />
      </div>
      <main className="flex-1 flex items-start justify-center px-4 py-20">
        <FormulaireReinitialisation token={jeton} expireLe={expireLe} />
      </main>
    </div>
  );
}
