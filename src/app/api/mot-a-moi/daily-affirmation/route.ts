import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
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

function getPhase(
  currentDay: number,
  cycleLength: number,
  periodLength: number,
) {
  if (currentDay <= periodLength) return "Hiver";
  const ovulationStart = cycleLength - 14;
  const ovulationEnd = cycleLength - 12;

  if (currentDay < ovulationStart) return "Printemps";
  if (currentDay >= ovulationStart && currentDay <= ovulationEnd) return "Été";
  return "Automne";
}

function calculateCycleInfo(
  isActive: boolean,
  cycleLength: number,
  periodLength: number,
  lastPeriodStartDate: Date | null,
  timezone = "Europe/Paris",
) {
  if (!isActive || !lastPeriodStartDate) {
    return { phase: null };
  }

  const todayTz = new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone }),
  );
  todayTz.setHours(0, 0, 0, 0);

  const refDate = new Date(lastPeriodStartDate);
  refDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (todayTz.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const currentDay =
    (((diffDays % cycleLength) + cycleLength) % cycleLength) + 1;

  return { phase: getPhase(currentDay, cycleLength, periodLength) };
}

export async function GET() {
  const todayStr = getTodayStr();
  const prismaClient = prisma as PrismaClientWithSavezVous;

  try {
    const existing = await prismaClient.savezVous.findUnique({
      where: { date: todayStr },
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
  let phase: string | null = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const user = await getUserFromRequest();
      let phaseNote = "";

      if (user?.timezone) {
        const profile = await prisma.menstrualProfile.findUnique({
          where: { userId: user.id },
        });
        if (profile) {
          const cycleInfo = calculateCycleInfo(
            profile.isActive,
            profile.cycleLength,
            profile.periodLength,
            profile.lastPeriodStartDate,
            user.timezone,
          );
          phase = cycleInfo.phase;
          if (phase) {
            phaseNote = `La personne a activé le suivi du cycle menstruel et est en phase ${phase}. Adapte l'affirmation à cette phase avec bienveillance.`;
          }
        }
      }

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
      where: { date: todayStr },
      update: {
        title: "Affirmation du jour",
        paragraph1: affirmation,
        paragraph2: phase || "",
        paragraph3: null,
      },
      create: {
        date: todayStr,
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
