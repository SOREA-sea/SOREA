import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const categoryLabels: Record<string, string> = {
  "bien-etre": "Bien-être",
  mindset: "Mindset",
  methode: "Méthode",
};

export async function GET() {
  try {
    const news = await prisma.vibeNews.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
      },
    });

    const articles = news.map((item) => {
      const words = item.content.trim().split(/\s+/).length;
      return {
        id: `admin-${item.id}`,
        img: null,
        imgAlt: item.title,
        emoji: "📰",
        date: item.createdAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        dateSort: item.createdAt.getTime(),
        title: item.title,
        desc: item.content,
        cat: item.category,
        catLabel: categoryLabels[item.category] ?? "Actualité",
        likes: 0,
        readMin: Math.max(1, Math.ceil(words / 220)),
        paragraphs: item.content
          .split(/\n\s*\n/)
          .map((text) => ({ text: text.trim() }))
          .filter((paragraph) => paragraph.text),
      };
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Erreur vibe-news GET:", error);
    return NextResponse.json({ error: "Impossible de charger les actualités" }, { status: 500 });
  }
}
