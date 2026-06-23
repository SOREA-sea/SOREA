import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sorea_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    
    if (!dateParam) {
      return NextResponse.json({ error: "Date requise" }, { status: 400 });
    }

    const date = new Date(dateParam);
    date.setHours(0, 0, 0, 0);

    // @ts-ignore
    const log = await prisma.symptomLog.findUnique({
      where: {
        userId_date: {
          userId: session.userId,
          date: date,
        }
      }
    });

    return NextResponse.json({ log: log || null }, { status: 200 });
  } catch (error) {
    console.error("Erreur symptoms GET:", error);
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
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const body = await request.json();
    const { date: dateStr, flow, mood, physicalSymptoms } = body;

    if (!dateStr) {
      return NextResponse.json({ error: "Date requise" }, { status: 400 });
    }

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    // @ts-ignore
    const log = await prisma.symptomLog.upsert({
      where: {
        userId_date: {
          userId: session.userId,
          date: date,
        }
      },
      update: {
        flow,
        mood,
        physicalSymptoms
      },
      create: {
        userId: session.userId,
        date: date,
        flow,
        mood,
        physicalSymptoms
      }
    });

    return NextResponse.json({ log }, { status: 200 });

  } catch (error) {
    console.error("Erreur symptoms PUT:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
