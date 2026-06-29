import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";
import { getTodayISO } from "@/lib/dateHelpers";

export async function GET() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const date = getTodayISO();
  const entry = await prisma.moodEntry.findUnique({
    where: { userId_date: { userId: auth.id, date } },
  });

  return NextResponse.json({ data: entry?.moodId ?? null }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { moodId } = await request.json();
  if (!moodId) {
    return NextResponse.json({ error: "moodId requis" }, { status: 400 });
  }

  const date = getTodayISO();
  const entry = await prisma.moodEntry.upsert({
    where: { userId_date: { userId: auth.id, date } },
    update: { moodId },
    create: { userId: auth.id, date, moodId },
  });

  return NextResponse.json({ data: entry.moodId }, { status: 200 });
}