import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  { name: "Lecture", icon: "📖", items: ["Finir 'Ikigai'", "10 pages ce soir"] },
  { name: "Musique", icon: "🎵", items: ["Playlist focus 25 min"] },
  { name: "Films & Séries", icon: "🎬", items: ["1 épisode le samedi"] },
  { name: "Jeux", icon: "🎮", items: ["10 min puzzle antistress"] },
];

async function ensureSeeded(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.hobbiesSeeded) return;

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.hobbyCategory.create({
      data: {
        userId,
        name: cat.name,
        icon: cat.icon,
        isDefault: true,
        items: { create: cat.items.map((label) => ({ label })) },
      },
    });
  }

  await prisma.user.update({ where: { id: userId }, data: { hobbiesSeeded: true } });
}

export async function GET() {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  await ensureSeeded(auth.id);

  const categories = await prisma.hobbyCategory.findMany({
    where: { userId: auth.id },
    include: { items: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ data: categories }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const body = await request.json();

  if (body.action === "addCategory") {
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "name requis" }, { status: 400 });
    }
    const category = await prisma.hobbyCategory.create({
      data: { userId: auth.id, name, icon: "⭐", isDefault: false },
      include: { items: true },
    });
    return NextResponse.json({ data: category }, { status: 201 });
  }

  if (body.action === "addItem") {
    const { categoryId, label } = body;
    if (!categoryId || !label?.trim()) {
      return NextResponse.json({ error: "categoryId et label requis" }, { status: 400 });
    }
    const category = await prisma.hobbyCategory.findUnique({ where: { id: categoryId } });
    if (!category || category.userId !== auth.id) {
      return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    }
    const item = await prisma.hobbyItem.create({ data: { categoryId, label: label.trim() } });
    return NextResponse.json({ data: item }, { status: 201 });
  }

  return NextResponse.json({ error: "action invalide" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (!("id" in auth)) return auth;

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const itemId = searchParams.get("itemId");

  if (categoryId) {
    const category = await prisma.hobbyCategory.findUnique({ where: { id: parseInt(categoryId, 10) } });
    if (!category || category.userId !== auth.id) {
      return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    }
    if (category.isDefault) {
      return NextResponse.json({ error: "Impossible de supprimer une catégorie par défaut" }, { status: 403 });
    }
    await prisma.hobbyCategory.delete({ where: { id: category.id } });
    return NextResponse.json({ data: { deleted: true } }, { status: 200 });
  }

  if (itemId) {
    const item = await prisma.hobbyItem.findUnique({
      where: { id: parseInt(itemId, 10) },
      include: { category: true },
    });
    if (!item || item.category.userId !== auth.id) {
      return NextResponse.json({ error: "Item introuvable" }, { status: 404 });
    }
    await prisma.hobbyItem.delete({ where: { id: item.id } });
    return NextResponse.json({ data: { deleted: true } }, { status: 200 });
  }

  return NextResponse.json({ error: "categoryId ou itemId requis" }, { status: 400 });
}