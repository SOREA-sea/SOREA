import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";

// Vérifier si la clé API existe
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Double vérification de l'authentification (sécurité)
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session invalide ou expirée" }, { status: 401 });
    }

    // Rate Limiting : 10 messages par minute
    const rateLimitResult = checkRateLimit(`chat_${sessionId}`, 10, 60_000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Trop de messages. Veuillez réessayer dans ${Math.ceil(rateLimitResult.retryAfterMs! / 1000)}s.` },
        { status: 429 }
      );
    }

    // 2. Récupérer l'historique et le message du body
    const body = await req.json();
    const messages = body.messages || [];
    
    if (messages.length === 0) {
      return NextResponse.json({ error: "Aucun message fourni" }, { status: 400 });
    }

    // Le dernier message de l'utilisateur
    const lastUserMessage = messages[messages.length - 1];

    if (!process.env.GEMINI_API_KEY) {
      // Fallback si pas de clé API dans l'environnement (pour le dev)
      return NextResponse.json({ 
        text: "L'API Gemini n'est pas configurée (GEMINI_API_KEY manquante dans .env)." 
      });
    }

    // 3. Initialiser le modèle Gemini
    const systemInstructionContent = `Tu es l'assistant virtuel de SOREA, une plateforme de bien-être qui propose des outils interactifs via un espace digital (jeux, défis, suivi, contenu interactif), divers produits et accessoires en lien avec le bien-être à travers une boutique en ligne et un accompagnement humain sous forme de coaching proposé en ligne et en présentiel. Réponds de manière douce, bienveillante, courtoise et concise. Ne donne pas de réponses excessivement longues. Ton rôle est d'aider les utilisateurs de SOREA.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstructionContent
    });

    // Formater l'historique pour Gemini
    // Gemini attend: { role: "user" | "model", parts: [{ text: "..." }] }
    const history = [];

    // Ajouter l'historique précédent (sauf le dernier message en cours d'envoi et on ignore le premier messge du bot front)
    for (let i = 1; i < messages.length - 1; i++) {
      const msg = messages[i];
      history.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    }

    // Démarrer la conversation (Chat Session)
    const chat = model.startChat({
      history: history
    });

    // Envoyer le dernier message au LLM
    const result = await chat.sendMessage(lastUserMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Erreur Gemini API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la réponse" },
      { status: 500 }
    );
  }
}
