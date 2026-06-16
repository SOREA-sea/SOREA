import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient() as any;

// ─── BANQUE LOCALE DE SECOURS ──────────────────
const LOCAL_FALLBACKS = [
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Pratiquer la gratitude chaque jour réduit le niveau de cortisol et améliore la qualité du sommeil profond.",
      "Avant de dormir ce soir, notez trois petites victoires de votre journée pour apaiser votre esprit.",
      "« La gratitude est la mémoire du cœur. » — Hans Christian Andersen",
    ],
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Écrire ses pensées à la main active des zones cérébrales liées à la régulation émotionnelle que le clavier ne stimule pas.",
      "Prenez cinq minutes aujourd'hui pour poser vos ressentis sur papier sans chercher à vous censurer.",
      "« Écrire, c'est une façon de parler sans être interrompu. » — Jules Renard",
    ],
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Marcher seulement vingt minutes dans un espace vert suffit à faire chuter drastiquement l'hormone du stress.",
      "Profitez de votre prochaine pause pour vous rapprocher de la nature et vous reconnecter à vos sens.",
      "« Regardez profondément dans la nature, et alors vous comprendrez tout mieux. » — Albert Einstein",
    ],
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Sourire, même de manière forcée, envoie un signal positif au cerveau qui libère instantanément de la dopamine.",
      "Relevez les coins de vos lèvres pendant quelques secondes et observez le changement en vous.",
      "« Le sourire que vous envoyez revient vers vous. » — Proverbe hindou",
    ],
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Une sieste de 20 minutes améliore la vigilance et les performances cognitives sans provoquer d'inertie du sommeil.",
      "Si vous sentez un coup de fatigue l'après-midi, accordez-vous une courte pause les yeux fermés.",
      "« Le repos fait partie du travail. » — Proverbe africain",
    ],
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Boire un verre d'eau dès le réveil réhydrate le corps après plusieurs heures de sommeil et booste l'énergie matinale.",
      "Gardez un verre d'eau sur votre table de nuit et buvez-le avant même de regarder votre téléphone.",
      "« L'eau est la force motrice de toute la nature. » — Léonard de Vinci",
    ],
  },
];

// ─── DATE EN HEURE FRANÇAISE 
function getTodayStr(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("-"); // "AAAA-MM-JJ"
}

function pickRandomFallback() {
  const idx = Math.floor(Math.random() * LOCAL_FALLBACKS.length);
  return LOCAL_FALLBACKS[idx];
}

// ─── FIX 2 : Parser défensif — extrait le premier JSON valide ────────────────
function extractJson(raw: string): unknown {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Aucun JSON trouvé dans la réponse Gemini");
  return JSON.parse(match[0]);
}

export async function GET() {
  const todayStr = getTodayStr();
  console.log(" Date Paris :", todayStr);

  // ── ÉTAPE 1 : déjà en base pour aujourd'hui ? 
  try {
    const existing = await prisma.savezVous.findUnique({
      where: { date: todayStr },
    });

    if (existing) {
      console.log(" Trouvé en base, on sert depuis la DB");
      return NextResponse.json({
        title: existing.title,
        paragraphs: [existing.paragraph1, existing.paragraph2, existing.paragraph3],
      });
    }

    console.log(" Pas en base pour aujourd'hui, appel Gemini...");
  } catch (err) {
    console.warn(" Erreur lecture DB :", err);
  }

  // ── ÉTAPE 2 : appel Gemini 
  if (process.env.GEMINI_API_KEY) {
    console.log(" Clé Gemini détectée, appel en cours...");
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        // ─── FIX 3 : désactive le thinking pour économiser les tokens ────────
        systemInstruction:
          "Tu réponds uniquement avec le JSON demandé, sans réflexion préalable ni texte supplémentaire.",
        generationConfig: {
          responseMimeType: "application/json",
          // ─── FIX 1 : tokens suffisants (300 → 1024) ──
          maxOutputTokens: 1024,
        },
      });

      const prompt = `Tu es un rédacteur bien-être. Génère un JSON strict avec un titre et exactement 3 paragraphes.
- Paragraphe 1 : UN fait court sur la psychologie ou la santé (une seule phrase).
- Paragraphe 2 : 1 ou 2 phrases max avec "vous" pour appliquer ce fait aujourd'hui.
- Paragraphe 3 : Une citation avec l'auteur qui est en rapport avec les deux paragraphes précédents.
Format attendu UNIQUEMENT : {"title": "Le saviez-vous ?", "paragraphs": ["P1", "P2"]}`;

      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      console.log(" Gemini a répondu :", raw);

      // ─── FIX 2 : extraction JSON robuste ─────
      const aiResult = extractJson(raw) as { title?: string; paragraphs?: string[] };
      const title = aiResult.title || "Le saviez-vous ?";
      const paragraphs: string[] = Array.isArray(aiResult.paragraphs)
        ? aiResult.paragraphs
        : LOCAL_FALLBACKS[0].paragraphs;

      // ── Sauvegarde en base 
      await prisma.savezVous.create({
        data: {
          date: todayStr,
          title,
          paragraph1: paragraphs[0],
          paragraph2: paragraphs[1],
          paragraph3: paragraphs[2],
        },
      });
      console.log(" Sauvegardé en base !");

      return NextResponse.json({ title, paragraphs });
    } catch (err) {
      console.warn(" Gemini a échoué :", err instanceof Error ? err.message : err);
      console.warn(" Détail :", JSON.stringify(err, null, 2));
      // tombe dans l'étape 3
    }
  } else {
    console.warn(" GEMINI_API_KEY manquante — fallback local.");
  }

  // ── ÉTAPE 3 : fallback local (sauvegardé aussi en base) 
  console.log(" Utilisation du fallback local");
  const fallback = pickRandomFallback();

  try {
    await prisma.savezVous.upsert({
      where: { date: todayStr },
      update: {},
      create: {
        date: todayStr,
        title: fallback.title,
        paragraph1: fallback.paragraphs[0],
        paragraph2: fallback.paragraphs[1],
        paragraph3: fallback.paragraphs[2],
      },
    });
  } catch (err) {
    console.warn(" Erreur écriture fallback en base :", err);
  }

  return NextResponse.json({
    title: fallback.title,
    paragraphs: fallback.paragraphs,
  });
}