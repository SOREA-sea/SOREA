import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const notes = await prisma.journalNote.findMany({
    where: { userId: auth.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: notes }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { texte, humeurEmoji, humeurLabel, tag } = await request.json();
  if (!texte || !texte.trim()) {
    return NextResponse.json({ error: "texte requis" }, { status: 400 });
  }

  const note = await prisma.journalNote.create({
    data: {
      userId: auth.id,
      texte: texte.trim(),
      humeurEmoji: humeurEmoji || null,
      humeurLabel: humeurLabel || null,
      tag: tag || null,
    },
  });

  return NextResponse.json({ data: note }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const note = await prisma.journalNote.findUnique({ where: { id: parseInt(id, 10) } });
  if (!note || note.userId !== auth.id) {
    return NextResponse.json({ error: "Note introuvable" }, { status: 404 });
  }

  await prisma.journalNote.delete({ where: { id: note.id } });
  return NextResponse.json({ data: { deleted: true } }, { status: 200 });
}