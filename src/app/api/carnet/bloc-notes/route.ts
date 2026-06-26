import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const notes = await prisma.quickNote.findMany({
    where: { userId: auth.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: notes }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { texte } = await request.json();
  if (!texte || !texte.trim()) {
    return NextResponse.json({ error: "texte requis" }, { status: 400 });
  }

  const note = await prisma.quickNote.create({
    data: { userId: auth.id, texte: texte.trim() },
  });

  return NextResponse.json({ data: note }, { status: 201 });
}