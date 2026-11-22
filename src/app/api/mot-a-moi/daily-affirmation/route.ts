import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import { computeCycleInfo, type PeriodEntry } from "@/lib/cycleCalc";
import { getUserFromRequest } from "../../middleware/auth";

type SavezVousClient = {
  savezVous: {
    findUnique: (args: {
      where: { date: string };
    }) => Promise<{ paragraph1: string; paragraph2?: string } | null>;
    upsert: (args: {
      where: { date: string };
      update: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        paragraph3: null;
      };
      create: {
        date: string;
        title: string;
        paragraph1: string;
        paragraph2: string;
        paragraph3: null;
      };
    }) => Promise<unknown>;
  };
};

type PrismaClientWithSavezVous = PrismaClient & SavezVousClient;

const LOCAL_FALLBACKS = [
  "Je choisis chaque jour d'être ancrée dans ma force intérieure.",
  "Je nourris ma routine avec douceur et confiance.",
  "J'accueille ma clarté et je reste alignée avec mes valeurs.",
  "Je me fais du bien en prenant soin de moi avec bienveillance.",
  "Je suis capable de créer un espace apaisant pour mon corps et mon'esprit.",
];

function getTodayStr(timezone = "Europe/Paris"): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("-");
}

export async function GET() {
  const prismaClient = prisma as PrismaClientWithSavezVous;

  // Phase du cycle de la personne connectée (null sans suivi activé ou sans compte connecté)
  let phase: string | null = null;
  let timezone = "Europe/Paris";

  try {
    const user = await getUserFromRequest();
    if (user) {
      timezone = user.timezone || timezone;
      const profile = await prisma.menstrualProfile.findUnique({
        where: { userId: user.id },
      });

      if (profile && profile.isActive && profile.lastPeriodStartDate) {
        // @ts-ignore
        const entry = await prisma.periodHistory.findFirst({
          where: { userId: user.id, startDate: profile.lastPeriodStartDate },
          orderBy: { id: "desc" },
        });
        const history: PeriodEntry[] = [
          {
            startDate: profile.lastPeriodStartDate.toISOString().slice(0, 10),
            endDate: entry?.endDate ? entry.endDate.toISOString().slice(0, 10) : null,
          },
        ];
        phase = computeCycleInfo(
          profile.isActive,
          { cycleLength: profile.cycleLength, periodLength: profile.periodLength },
          history,
          timezone,
        ).phase;
      }
    }
  } catch (error) {
    console.warn("Erreur lecture du profil de cycle :", error);
  }

  const todayStr = getTodayStr(timezone);
  // Une affirmation par jour ET par phase : chaque personne reçoit une affirmation adaptée à sa phase
  const cacheKey = phase ? `${todayStr}-${phase}` : `${todayStr}-neutre`;

  try {
    const existing = await prismaClient.savezVous.findUnique({
      where: { date: cacheKey },
    });

    if (existing) {
      return NextResponse.json({
        affirmation: existing.paragraph1,
        phase: existing.paragraph2 || null,
      });
    }
  } catch (error) {
    console.warn("Erreur lecture DB affirmations journalières :", error);
  }

  let affirmation =
    LOCAL_FALLBACKS[Math.floor(Math.random() * LOCAL_FALLBACKS.length)];

  if (process.env.GEMINI_API_KEY) {
    try {
      const phaseNote = phase
        ? `La personne a activé le suivi du cycle menstruel et est en phase ${phase}. Adapte l'affirmation à cette phase avec bienveillance.`
        : "";

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction:
          "Tu es un rédacteur bien-être doux et positif. Donne une seule phrase, en première personne du singulier, au présent de l'indicatif, sans vocabulaire négatif.",
      });

      const prompt = `Génère une affirmation positive journalière. Ne contient pas de conjonctions négatives ni de vocabulaire négatif. N'utilise pas le mot 'rituel' ; utilise 'routine'. ${phaseNote}`;
      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim();

      if (raw) {
        affirmation = raw;
      }
    } catch (error) {
      console.warn("Gemini daily affirmation failed:", error);
    }
  }

  try {
    await prismaClient.savezVous.upsert({
      where: { date: cacheKey },
      update: {
        title: "Affirmation du jour",
        paragraph1: affirmation,
        paragraph2: phase || "",
        paragraph3: null,
      },
      create: {
        date: cacheKey,
        title: "Affirmation du jour",
        paragraph1: affirmation,
        paragraph2: phase || "",
        paragraph3: null,
      },
    });
  } catch (error) {
    console.warn("Erreur sauvegarde affirmation journalière :", error);
  }

  return NextResponse.json({ affirmation, phase });
}
