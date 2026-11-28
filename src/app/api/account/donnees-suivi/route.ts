import { NextResponse } from "next/server";
import { utilisateurConnecte } from "@/lib/utilisateurConnecte";
import { effacerDonneesSuivi } from "@/lib/donneesSuivi";

/**
 * DELETE /api/account/donnees-suivi : effacer ses données de suivi sans supprimer son compte.
 * Body : { cycle: boolean, carnet: boolean, confirmation: "SUPPRIMER" }
 * Irréversible : la confirmation tapée par l'utilisatrice est exigée.
 */
export async function DELETE(request: Request) {
  try {
    const user = await utilisateurConnecte();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const cycle = body.cycle === true;
    const carnet = body.carnet === true;
    if (!cycle && !carnet) {
      return NextResponse.json({ error: "Choisis au moins un type de données à effacer." }, { status: 400 });
    }
    if (body.confirmation !== "SUPPRIMER") {
      return NextResponse.json({ error: "Tape SUPPRIMER pour confirmer." }, { status: 400 });
    }

    await effacerDonneesSuivi(user.id, { cycle, carnet });
    return NextResponse.json({ cycle, carnet });
  } catch (error) {
    console.error("Erreur effacement données de suivi:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
