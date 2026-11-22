import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  addDays,
  clampPeriodLength,
  computeCycleInfo,
  dayDiff,
  entryPeriodLength,
  todayString,
  type PeriodEntry,
} from "@/lib/cycleCalc";

const toDay = (date: Date) => date.toISOString().slice(0, 10);

// Historique des règles de l'utilisatrice, au format jour "AAAA-MM-JJ", du plus ancien au plus récent
async function loadHistory(userId: number, lastPeriodStartDate: Date | null): Promise<PeriodEntry[]> {
  // Date inconnue (« Je ne sais pas ») : pas d'historique, le calcul part d'une valeur par défaut
  if (!lastPeriodStartDate) return [];
  const lastStr = toDay(lastPeriodStartDate);

  // @ts-ignore
  const rows = await prisma.periodHistory.findMany({
    where: { userId },
    orderBy: { startDate: "desc" },
    take: 24,
  });

  // Une seule entrée par date de début (on garde celle qui a une date de fin)
  const byStart = new Map<string, PeriodEntry>();
  for (const row of rows as any[]) {
    const startDate = toDay(row.startDate);
    const endDate = row.endDate ? toDay(row.endDate) : null;
    const existing = byStart.get(startDate);
    if (!existing || (!existing.endDate && endDate)) byStart.set(startDate, { startDate, endDate });
  }

  // Le dernier début de règles du profil doit toujours exister (comptes anciens ou historique vidé)
  if (!byStart.has(lastStr)) byStart.set(lastStr, { startDate: lastStr, endDate: null });

  return Array.from(byStart.values())
    .filter((e) => e.startDate <= lastStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

// Durée moyenne des règles sur les 6 dernières règles terminées (null s'il y en a moins de 2)
async function recomputeAveragePeriodLength(userId: number): Promise<number | null> {
  // @ts-ignore
  const rows = await prisma.periodHistory.findMany({
    where: { userId, endDate: { not: null } },
    orderBy: { startDate: "desc" },
    take: 12,
  });

  const seen = new Set<string>();
  const lengths: number[] = [];
  for (const row of rows as any[]) {
    const startDate = toDay(row.startDate);
    if (seen.has(startDate) || lengths.length >= 6) continue;
    seen.add(startDate);
    lengths.push(entryPeriodLength({ startDate, endDate: toDay(row.endDate) }, 5));
  }

  if (lengths.length < 2) return null;
  return Math.round(lengths.reduce((sum, n) => sum + n, 0) / lengths.length);
}

function getPhase(currentDay: number, cycleLength: number, periodLength: number) {
  // Mêmes bornes et même règle que le calendrier (MenstrualCalendar.tsx)
  const cLength = Math.min(Math.max(Math.round(Number(cycleLength)) || 28, 20), 60);
  const pLength = Math.min(Math.max(Math.round(Number(periodLength)) || 5, 1), 10);

  if (currentDay <= pLength) return "Hiver";

  // Ovulation ≈ 14 jours avant la fin du cycle, avec au moins 2 jours de phase folliculaire
  // et 4 jours de phase lutéale garantis
  let ovulationDay = cLength - 14;
  ovulationDay = Math.max(ovulationDay, pLength + 4);
  ovulationDay = Math.min(ovulationDay, cLength - 5);
  const ovulationStart = ovulationDay - 1;
  const ovulationEnd = ovulationDay + 1;

  if (currentDay < ovulationStart) return "Printemps";
  if (currentDay <= ovulationEnd) return "Été";
  return "Automne";
}

function calculateCycleInfo(
  isActive: boolean,
  cycleLength: number,
  periodLength: number,
  lastPeriodStartDate: Date | null,
  timezone: string = "Europe/Paris"
) {
  let refDate = lastPeriodStartDate;
  
  // Si inactif ou pas de date, on prend le 1er du mois courant par défaut (dans le fuseau horaire de l'utilisateur)
  if (!isActive || !refDate) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
    });
    const parts = formatter.formatToParts(now);
    const month = parseInt(parts.find(p => p.type === 'month')!.value) - 1;
    const year = parseInt(parts.find(p => p.type === 'year')!.value);
    refDate = new Date(year, month, 1);
  }

  // Obtenir la date d'aujourd'hui dans le fuseau horaire de l'utilisateur
  const todayStr = new Date().toLocaleDateString('en-US', { timeZone: timezone });
  const today = new Date(todayStr);
  today.setHours(0, 0, 0, 0);

  const refDateMidnight = new Date(refDate);
  refDateMidnight.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - refDateMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const safeCycleLength = Math.min(Math.max(Math.round(Number(cycleLength)) || 28, 20), 60);
  
  const currentDay = (((diffDays % safeCycleLength) + safeCycleLength) % safeCycleLength) + 1;
  const daysUntilNext = safeCycleLength - currentDay + 1;
  const phase = getPhase(currentDay, safeCycleLength, periodLength);

  return {
    currentDay,
    daysUntilNext,
    phase,
    refDate
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: { select: { timezone: true } } }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    let profile = await prisma.menstrualProfile.findUnique({
      where: { userId: session.userId }
    });

    if (!profile) {
      // Si aucun profil n'existe, on retourne les infos par défaut
      const defaultInfo = computeCycleInfo(false, { cycleLength: 28, periodLength: 5 }, [], session.user.timezone);
      return NextResponse.json({
        profile: {
          isActive: false,
          cycleLength: 28,
          periodLength: 5,
          lastPeriodStartDate: null
        },
        cycleInfo: defaultInfo
      }, { status: 200 });
    }

    const history = await loadHistory(session.userId, profile.lastPeriodStartDate);
    const cycleInfo = computeCycleInfo(
      profile.isActive,
      { cycleLength: profile.cycleLength, periodLength: profile.periodLength },
      history,
      session.user.timezone
    );

    return NextResponse.json({ profile, cycleInfo, history }, { status: 200 });
  } catch (error) {
    console.error("Erreur menstrual-profile GET:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: { select: { timezone: true } } }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const body = await request.json();
    const { isActive, cycleLength: rawCycleLength, periodLength: rawPeriodLength, lastPeriodStartDate } = body;

    // Valeurs validées : entiers dans des bornes réalistes (cycle 20-60 jours, règles 1-10 jours)
    const cycleLength: number | undefined =
      rawCycleLength !== undefined ? Math.min(Math.max(Math.round(Number(rawCycleLength)) || 28, 20), 60) : undefined;
    const periodLength: number | undefined =
      rawPeriodLength !== undefined ? Math.min(Math.max(Math.round(Number(rawPeriodLength)) || 5, 1), 10) : undefined;

    // Actions rapides du calendrier : « Je ne les ai plus » (ended) / « Mes règles continuent » (continues)
    if (body.periodAction === "ended" || body.periodAction === "continues") {
      const currentProfile = await prisma.menstrualProfile.findUnique({
        where: { userId: session.userId }
      });
      if (!currentProfile || !currentProfile.lastPeriodStartDate) {
        return NextResponse.json({ error: "Aucune date de début de règles enregistrée" }, { status: 400 });
      }

      const startStr = toDay(currentProfile.lastPeriodStartDate);
      const daysSinceStart = dayDiff(startStr, todayString(session.user.timezone)); // 0 = 1er jour des règles

      if (daysSinceStart < 0 || daysSinceStart > 14) {
        return NextResponse.json(
          { error: "Ces règles datent de trop longtemps : utilise « Mes règles ont commencé aujourd’hui »." },
          { status: 400 }
        );
      }

      // @ts-ignore
      let entry = await prisma.periodHistory.findFirst({
        where: { userId: session.userId, startDate: currentProfile.lastPeriodStartDate },
        orderBy: { id: "desc" },
      });
      if (!entry) {
        // @ts-ignore
        entry = await prisma.periodHistory.create({
          data: { userId: session.userId, startDate: currentProfile.lastPeriodStartDate },
        });
      }

      // Dernier jour de règles actuellement connu (0 = 1er jour)
      const knownEndOffset = entry.endDate
        ? dayDiff(startStr, toDay(entry.endDate))
        : clampPeriodLength(currentProfile.periodLength) - 1;

      let newEndOffset: number | null = null;
      if (body.periodAction === "ended") {
        // Elle n'a plus ses règles aujourd'hui : le dernier jour de règles est hier (au moins le 1er jour)
        newEndOffset = Math.min(Math.max(daysSinceStart - 1, 0), 9);
      } else if (daysSinceStart > knownEndOffset && daysSinceStart <= 9) {
        // Règles qui continuent au-delà de la durée prévue : on prolonge jusqu'à aujourd'hui (10 jours maximum)
        newEndOffset = daysSinceStart;
      }

      if (newEndOffset !== null) {
        // @ts-ignore
        await prisma.periodHistory.update({
          where: { id: entry.id },
          data: { endDate: new Date(`${addDays(startStr, newEndOffset)}T00:00:00.000Z`) },
        });
      }

      // La durée moyenne des règles se met à jour automatiquement à partir de 2 règles terminées
      const averagePeriodLength = await recomputeAveragePeriodLength(session.userId);
      const updatedProfile =
        averagePeriodLength !== null
          ? await prisma.menstrualProfile.update({
              where: { userId: session.userId },
              data: { periodLength: averagePeriodLength },
            })
          : currentProfile;

      const history = await loadHistory(session.userId, updatedProfile.lastPeriodStartDate);
      const cycleInfo = computeCycleInfo(
        updatedProfile.isActive,
        { cycleLength: updatedProfile.cycleLength, periodLength: updatedProfile.periodLength },
        history,
        session.user.timezone
      );
      return NextResponse.json({ profile: updatedProfile, cycleInfo, history }, { status: 200 });
    }

    const data: any = {};
    if (isActive !== undefined) data.isActive = isActive;
    if (periodLength !== undefined) data.periodLength = periodLength;

    if (lastPeriodStartDate !== undefined) {
      const newStartDate = lastPeriodStartDate ? new Date(lastPeriodStartDate) : null;
      data.lastPeriodStartDate = newStartDate;
      
      if (newStartDate) {
        const currentProfile = await prisma.menstrualProfile.findUnique({
          where: { userId: session.userId }
        });
        
        // Check if the date changed
        const isDifferentDate = !currentProfile?.lastPeriodStartDate || 
          currentProfile.lastPeriodStartDate.toISOString().split("T")[0] !== newStartDate.toISOString().split("T")[0];
          
        if (isDifferentDate) {
          // Correction d'une erreur de saisie : si la nouvelle date est à moins de 15 jours de la dernière
          // date de l'historique, on remplace cette entrée au lieu d'en ajouter une (évite de fausser la moyenne)
          // @ts-ignore
          const latestEntry = await prisma.periodHistory.findFirst({
            where: { userId: session.userId },
            orderBy: { startDate: 'desc' },
          });
          const isCorrection =
            !!latestEntry &&
            Math.abs(Math.round((newStartDate.getTime() - latestEntry.startDate.getTime()) / (1000 * 60 * 60 * 24))) < 15;

          if (isCorrection && latestEntry) {
            // @ts-ignore
            await prisma.periodHistory.updateMany({
              where: { userId: session.userId, startDate: latestEntry.startDate },
              data: { startDate: newStartDate, endDate: null },
            });
          } else {
            // Add to history
            // @ts-ignore
            await prisma.periodHistory.create({
              data: {
                userId: session.userId,
                startDate: newStartDate,
              }
            });
          }
          
          // Re-calculate cycle length based on history
          // @ts-ignore
          const history = await prisma.periodHistory.findMany({
            where: { userId: session.userId },
            orderBy: { startDate: 'desc' }, // newest first
            take: 6 // last 6 months is enough for average
          });
          
          // Si la personne vient de modifier elle-même la durée du cycle, son choix est prioritaire sur la moyenne
          const userChangedCycleLength = cycleLength !== undefined && currentProfile?.cycleLength !== cycleLength;
          if ((history.length < 2 || userChangedCycleLength) && cycleLength !== undefined) {
            data.cycleLength = cycleLength;
          } 
          // Otherwise, if we have enough history, calculate the average automatically
          else if (history.length >= 2) {
            let totalDays = 0;
            let count = 0;
            for (let i = 0; i < history.length - 1; i++) {
              const diffTime = history[i].startDate.getTime() - history[i+1].startDate.getTime();
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
              // only consider valid cycle lengths between 15 and 45 days to avoid outlier errors
              if (diffDays >= 15 && diffDays <= 45) {
                totalDays += diffDays;
                count++;
              }
            }
            if (count > 0) {
              const average = Math.round(totalDays / count);
              data.cycleLength = Math.max(21, Math.min(45, average)); // limit to reasonable length
            } else if (cycleLength !== undefined) {
              data.cycleLength = cycleLength;
            }
          }
        } else if (cycleLength !== undefined) {
          // Date hasn't changed, but maybe they are just updating cycle length via survey
          data.cycleLength = cycleLength;
        }
      } else if (cycleLength !== undefined) {
          data.cycleLength = cycleLength;
      }
    } else if (cycleLength !== undefined) {
      data.cycleLength = cycleLength;
    }

    const profile = await prisma.menstrualProfile.upsert({
      where: { userId: session.userId },
      update: data,
      create: {
        userId: session.userId,
        ...data,
        // Fallbacks if not provided on create
        isActive: data.isActive || false,
        cycleLength: data.cycleLength || 28,
        periodLength: data.periodLength || 5,
      }
    });

    const history = await loadHistory(session.userId, profile.lastPeriodStartDate);
    const cycleInfo = computeCycleInfo(
      profile.isActive,
      { cycleLength: profile.cycleLength, periodLength: profile.periodLength },
      history,
      session.user.timezone
    );

    return NextResponse.json({ profile, cycleInfo, history }, { status: 200 });

  } catch (error) {
    console.error("Erreur menstrual-profile PUT:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
