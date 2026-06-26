import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";
import { getTodayISO } from "@/lib/dateHelpers";

export async function GET() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  // On récupère le fuseau horaire de l'utilisateur (par défaut Europe/Paris dans le schéma)
  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { timezone: true },
  });

  const date = getTodayISO(user?.timezone ?? "Europe/Paris");
  const entry = await prisma.dailyFeeling.findUnique({
    where: { userId_date: { userId: auth.id, date } },
  });

  return NextResponse.json({ data: entry?.moodLabel ?? null }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { moodLabel } = await request.json();
  if (!moodLabel) {
    return NextResponse.json({ error: "moodLabel requis" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { timezone: true },
  });

  const date = getTodayISO(user?.timezone ?? "Europe/Paris");
  const entry = await prisma.dailyFeeling.upsert({
    where: { userId_date: { userId: auth.id, date } },
    update: { moodLabel },
    create: { userId: auth.id, date, moodLabel },
  });

  return NextResponse.json({ data: entry.moodLabel }, { status: 200 });
}