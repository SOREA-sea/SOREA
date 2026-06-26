import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";
import { getWeekStartISO } from "@/lib/dateHelpers";

// GET - cases cochées de la semaine en cours pour l'utilisateur connecté
export async function GET() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const weekStart = getWeekStartISO(new Date());

  const checks = await prisma.habitCheck.findMany({
    where: { userId: auth.id, weekStart },
  });

  // Format attendu par le front : { "habitId-dayIndex": true }
  const coches: Record<string, boolean> = {};
  for (const c of checks) {
    if (c.checked) coches[`${c.habitId}-${c.dayIndex}`] = true;
  }

  return NextResponse.json({ data: coches }, { status: 200 });
}

// POST - coche/décoche une case { habitId, dayIndex }
export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { habitId, dayIndex } = await request.json();
  if (!habitId || typeof dayIndex !== "number") {
    return NextResponse.json({ error: "habitId et dayIndex requis" }, { status: 400 });
  }

  const weekStart = getWeekStartISO(new Date());

  const existing = await prisma.habitCheck.findUnique({
    where: {
      userId_habitId_weekStart_dayIndex: { userId: auth.id, habitId, weekStart, dayIndex },
    },
  });

  if (existing) {
    await prisma.habitCheck.delete({ where: { id: existing.id } });
    return NextResponse.json({ data: { checked: false } }, { status: 200 });
  }

  await prisma.habitCheck.create({
    data: { userId: auth.id, habitId, weekStart, dayIndex, checked: true },
  });
  return NextResponse.json({ data: { checked: true } }, { status: 200 });
}

// DELETE - réinitialise toutes les cases de la semaine en cours
export async function DELETE() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const weekStart = getWeekStartISO(new Date());
  await prisma.habitCheck.deleteMany({ where: { userId: auth.id, weekStart } });

  return NextResponse.json({ data: { reset: true } }, { status: 200 });
}