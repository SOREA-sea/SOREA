import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

function getPhase(currentDay: number, cycleLength: number, periodLength: number) {
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
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let currentDay = (((diffDays % cycleLength) + cycleLength) % cycleLength) + 1;
  const daysUntilNext = cycleLength - currentDay + 1;
  const phase = getPhase(currentDay, cycleLength, periodLength);

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
      const defaultInfo = calculateCycleInfo(false, 28, 5, null, session.user.timezone);
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

    const cycleInfo = calculateCycleInfo(
      profile.isActive,
      profile.cycleLength,
      profile.periodLength,
      profile.lastPeriodStartDate,
      session.user.timezone
    );

    return NextResponse.json({ profile, cycleInfo }, { status: 200 });
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
    const { isActive, cycleLength, periodLength, lastPeriodStartDate } = body;

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
          // Add to history
          // @ts-ignore
          await prisma.periodHistory.create({
            data: {
              userId: session.userId,
              startDate: newStartDate,
            }
          });
          
          // Re-calculate cycle length based on history
          // @ts-ignore
          const history = await prisma.periodHistory.findMany({
            where: { userId: session.userId },
            orderBy: { startDate: 'desc' }, // newest first
            take: 6 // last 6 months is enough for average
          });
          
          // If the user explicitly provided a cycleLength (e.g. initial survey), and we don't have enough history, use it.
          if (history.length < 2 && cycleLength !== undefined) {
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
              data.cycleLength = Math.max(21, Math.min(35, average)); // limit to reasonable length
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

    const cycleInfo = calculateCycleInfo(
      profile.isActive,
      profile.cycleLength,
      profile.periodLength,
      profile.lastPeriodStartDate,
      session.user.timezone
    );

    return NextResponse.json({ profile, cycleInfo }, { status: 200 });

  } catch (error) {
    console.error("Erreur menstrual-profile PUT:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
