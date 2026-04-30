import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Liste de tous les utilisateurs (admin only)
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            favoriteProducts: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erreur admin/users GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// PATCH — Modifier un utilisateur (activer/désactiver, changer le rôle)
// Body: { userId: number, isActive?: boolean, role?: string }
export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, isActive, role } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId est requis" }, { status: 400 });
    }

    // Empêcher l'admin de se désactiver lui-même
    if (userId === user.id && isActive === false) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas désactiver votre propre compte" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (role && ["user", "coach", "admin"].includes(role)) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Au moins un champ à modifier est requis (isActive, role)" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ message: "Utilisateur mis à jour", user: updatedUser });
  } catch (error) {
    console.error("Erreur admin/users PATCH:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// DELETE — Supprimer un utilisateur
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "Le paramètre 'id' est requis" }, { status: 400 });
    }

    const targetId = parseInt(userId, 10);
    if (isNaN(targetId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Empêcher l'admin de se supprimer
    if (targetId === user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: targetId } });

    return NextResponse.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur admin/users DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
