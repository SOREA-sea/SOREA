import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialisation avec ton nom de clé personnalisé
const ai = new GoogleGenerativeAI(process.env.MIROIR_API_KEY || "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phase = searchParams.get("phase") || "Printemps"; // Phase par défaut si non fournie

  // Définition de l'énergie physique et émotionnelle en fonction des saisons menstruelles.
  const contextes: Record<string, string> = {
    Hiver: "Phase Menstruelle (Règles). Énergie au plus bas, besoin de repos, d'introspection, d'introspection profonde, de douceur et de ralentissement, besoin de chaleur et de récupération, slow-life (lâcher prise).",
    Printemps: "Phase Pré-Ovulatoire. Retour de l'énergie, énergie montante, renouveau, dynamisme, optimisme, boost de motivation, planification, apprentissage, audace modérée",
    Été: "Phase Ovulatoire. Pic d'énergie, énergie au maximum et élevée, assurance forte, bonne force physique, rayonnement, communication, ouverture aux autres, confiance, action",
    Automne: "Phase Prémenstruelle. Énergie en baisse, syndrome prémenstruel potentiel, retour au calme, retour vers soi et écoute intérieure, sensibilité plus forte, besoin d’organisation, tri, ancrage, gestion émotionnelle, expression créative, ralentissement progressif."
  };

  const prompt = `Tu es le Miroir de SOREA, une IA bienveillante intégrée sous forme de miroir virtuel interactif pour l'accompagnement du cycle féminin. Ton rôle exclusif est de renvoyer des reflets positifs à l'utilisatrice sous forme d'affirmations.
Génère une affirmation positive unique et originale adaptée à la phase actuelle du cycle de l'utilisatrice : "${phase}".
Contexte de l'énergie de cette phase : ${contextes[phase] || contextes["Printemps"]}.

Règles strictes de rédaction :
1. Rédige obligatoirement à la première personne du singulier ("Je").
2. Conjugue les verbes au présent.
3. Évite les négations sous toute leur forme "ne pas", "ne ... pas", "peur", "ne ... jamais", "ne ... plus", "ne ... rien" etc.
4. Évite les répétitions et priorise la diversification des affirmations.
5. La phrase doit être courte (sinon maximum 10 à 12 mots) et fluide, car l'utilisatrice va devoir la répéter à haute voix devant un miroir virtuel.
6. Donne l'impression que l'utilisatrice se parle à elle-même avec une immense bienveillance, douceur et amour propre.
7. Renvoie UNIQUEMENT le texte brut de l'affirmation, sans guillemets, sans tirets, sans introduction ni explications.`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-8b" }); /*-8b est une versionajoutée pour éviter la longue attente des affirmations suivantes*/
    const result = await model.generateContent(prompt);
    const affirmation = result.response.text().trim();

    return NextResponse.json({ affirmation });
  } catch (error) {
    console.error("Erreur Gemini Miroir:", error);
    return NextResponse.json({ error: "Erreur lors de la génération de l'affirmation" }, { status: 500 });
  }
}
