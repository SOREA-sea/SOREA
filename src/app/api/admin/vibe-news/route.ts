import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "../../middleware/auth";

const allowedCategories = ["bien-etre", "mindset", "methode"];

async function getAdmin() {
  const user = await getUserFromRequest();
  if (!user) return { error: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) };
  if (!user.role.split(",").map((role) => role.trim()).includes("admin")) {
    return { error: NextResponse.json({ error: "Accès refusé" }, { status: 403 }) };
  }
  return { user };
}

export async function GET() {
  try {
    const auth = await getAdmin();
    if (auth.error) return auth.error;

    const news = await prisma.vibeNews.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
    return NextResponse.json({ news });
  } catch (error) {
    console.error("Erreur admin/vibe-news GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAdmin();
    if (auth.error || !auth.user) return auth.error;

    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    const category = allowedCategories.includes(body.category) ? body.category : "bien-etre";

    if (title.length < 3 || title.length > 140) {
      return NextResponse.json({ error: "Le titre doit contenir entre 3 et 140 caractères" }, { status: 400 });
    }
    if (content.length < 10 || content.length > 10000) {
      return NextResponse.json({ error: "Le texte doit contenir entre 10 et 10 000 caractères" }, { status: 400 });
    }

    const news = await prisma.vibeNews.create({
      data: { title, content, category, authorId: auth.user.id, isPublished: true },
    });
    return NextResponse.json({ message: "Actualité publiée", news }, { status: 201 });
  } catch (error) {
    console.error("Erreur admin/vibe-news POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await getAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    const news = await prisma.vibeNews.update({
      where: { id },
      data: { isPublished: Boolean(body.isPublished) },
    });
    return NextResponse.json({ message: "Actualité mise à jour", news });
  } catch (error) {
    console.error("Erreur admin/vibe-news PATCH:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await getAdmin();
    if (auth.error) return auth.error;

    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }
    await prisma.vibeNews.delete({ where: { id } });
    return NextResponse.json({ message: "Actualité supprimée" });
  } catch (error) {
    console.error("Erreur admin/vibe-news DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
