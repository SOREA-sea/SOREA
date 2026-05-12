import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Retourne les 3 listes de favoris du user connecté
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [products, coaches, sessions] = await Promise.all([
      prisma.favoriteProduct.findMany({
        where: { userId: user.id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.favoriteCoach.findMany({
        where: { userId: user.id },
        include: {
          coach: {
            select: {
              id: true,
              bio: true,
              specialty: true,
              averageRating: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.favoriteSession.findMany({
        where: { userId: user.id },
        include: {
          session: {
            select: {
              id: true,
              title: true,
              description: true,
              sessionType: true,
              startsAt: true,
              durationMinutes: true,
              price: true,
              averageRating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ products, coaches, sessions });
  } catch (error) {
    console.error("Erreur dashboard/favorites GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// DELETE — Supprime un favori par type et id
// Query params: ?type=product|coach|session&id=123
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { error: "Les paramètres 'type' et 'id' sont requis" },
        { status: 400 }
      );
    }

    const favoriteId = parseInt(id, 10);
    if (isNaN(favoriteId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    switch (type) {
      case "product":
        await prisma.favoriteProduct.deleteMany({
          where: { id: favoriteId, userId: user.id },
        });
        break;
      case "coach":
        await prisma.favoriteCoach.deleteMany({
          where: { id: favoriteId, userId: user.id },
        });
        break;
      case "session":
        await prisma.favoriteSession.deleteMany({
          where: { id: favoriteId, userId: user.id },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Type invalide. Valeurs acceptées : product, coach, session" },
          { status: 400 }
        );
    }

    return NextResponse.json({ message: "Favori supprimé" });
  } catch (error) {
    console.error("Erreur dashboard/favorites DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// POST — Ajoute ou supprime (toggle) un favori
// Body: { type: "product" | "coach" | "session", targetId: 123 }
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { type, targetId } = body;

    if (!type || !targetId) {
      return NextResponse.json(
        { error: "Les paramètres 'type' et 'targetId' sont requis" },
        { status: 400 }
      );
    }

    const tId = parseInt(targetId, 10);
    if (isNaN(tId)) {
      return NextResponse.json({ error: "Target ID invalide" }, { status: 400 });
    }

    switch (type) {
      case "product": {
        const existing = await prisma.favoriteProduct.findFirst({
          where: { productId: tId, userId: user.id }
        });
        if (existing) {
          await prisma.favoriteProduct.delete({ where: { id: existing.id } });
          return NextResponse.json({ message: "Favori supprimé", status: "removed" });
        } else {
          await prisma.favoriteProduct.create({ data: { productId: tId, userId: user.id } });
          return NextResponse.json({ message: "Favori ajouté", status: "added" });
        }
      }
      case "coach": {
        const existing = await prisma.favoriteCoach.findFirst({
          where: { coachId: tId, userId: user.id }
        });
        if (existing) {
          await prisma.favoriteCoach.delete({ where: { id: existing.id } });
          return NextResponse.json({ message: "Favori supprimé", status: "removed" });
        } else {
          await prisma.favoriteCoach.create({ data: { coachId: tId, userId: user.id } });
          return NextResponse.json({ message: "Favori ajouté", status: "added" });
        }
      }
      case "session": {
        const existing = await prisma.favoriteSession.findFirst({
          where: { sessionId: tId, userId: user.id }
        });
        if (existing) {
          await prisma.favoriteSession.delete({ where: { id: existing.id } });
          return NextResponse.json({ message: "Favori supprimé", status: "removed" });
        } else {
          await prisma.favoriteSession.create({ data: { sessionId: tId, userId: user.id } });
          return NextResponse.json({ message: "Favori ajouté", status: "added" });
        }
      }
      default:
        return NextResponse.json(
          { error: "Type invalide. Valeurs acceptées : product, coach, session" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur dashboard/favorites POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
