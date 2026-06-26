import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";
import { getTodayISO } from "@/lib/dateHelpers";

const DEFAULT_CHALLENGES: Record<string, string[]> = {
  "Anti-stress": [
    "Respiration 5-5-5 (3 cycles)",
    "Balade 10 minutes sans écran",
    "Note de gratitude",
  ],
  Sommeil: ["Écran off 1h avant dodo", "Étirements doux 5 min", "Lecture 10 pages"],
  Mouvement: ["Pilates 10 minutes", "20 squats / 20 fentes", "Marche 3 000 pas"],
  Autre: ["Manger un fruit"],
};

async function ensureSeeded(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.challengesSeeded) return;

  const data: { userId: number; theme: string; label: string; isDefault: boolean }[] = [];
  for (const theme of Object.keys(DEFAULT_CHALLENGES)) {
    for (const label of DEFAULT_CHALLENGES[theme]) {
      data.push({ userId, theme, label, isDefault: true });
    }
  }

  await prisma.$transaction([
    prisma.challengeItem.createMany({ data }),
    prisma.user.update({ where: { id: userId }, data: { challengesSeeded: true } }),
  ]);
}

export async function GET() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  await ensureSeeded(auth.id);

  const today = getTodayISO();

  const items = await prisma.challengeItem.findMany({
    where: { userId: auth.id },
    include: { completions: { where: { date: today } } },
    orderBy: { createdAt: "asc" },
  });

  const grouped: Record<string, { id: number; label: string; checked: boolean }[]> = {};
  for (const item of items) {
    if (!grouped[item.theme]) grouped[item.theme] = [];
    grouped[item.theme].push({
      id: item.id,
      label: item.label,
      checked: item.completions.length > 0,
    });
  }

  return NextResponse.json({ data: grouped }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { theme, label } = await request.json();
  if (!theme || !label?.trim()) {
    return NextResponse.json({ error: "theme et label requis" }, { status: 400 });
  }

  const item = await prisma.challengeItem.create({
    data: { userId: auth.id, theme, label: label.trim(), isDefault: false },
  });

  return NextResponse.json({ data: { id: item.id, label: item.label, checked: false } }, { status: 201 });
}

// Coche/décoche un item POUR AUJOURD'HUI uniquement
export async function PATCH(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const item = await prisma.challengeItem.findUnique({ where: { id } });
  if (!item || item.userId !== auth.id) {
    return NextResponse.json({ error: "Item introuvable" }, { status: 404 });
  }

  const today = getTodayISO();
  const existing = await prisma.challengeCompletion.findUnique({
    where: { challengeItemId_date: { challengeItemId: id, date: today } },
  });

  if (existing) {
    await prisma.challengeCompletion.delete({ where: { id: existing.id } });
    return NextResponse.json({ data: { checked: false } }, { status: 200 });
  }

  await prisma.challengeCompletion.create({ data: { challengeItemId: id, date: today } });
  return NextResponse.json({ data: { checked: true } }, { status: 200 });
}

// Supprime carrément les items du thème (le bouton "Réinitialiser la liste")
export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme");
  if (!theme) {
    return NextResponse.json({ error: "theme requis" }, { status: 400 });
  }

  await prisma.challengeItem.deleteMany({ where: { userId: auth.id, theme } });

  return NextResponse.json({ data: { reset: true } }, { status: 200 });
}