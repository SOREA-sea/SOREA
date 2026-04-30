import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Retourne les stats du user connecté
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [favoriteProducts, favoriteCoaches, favoriteSessions, bookings, cart] =
      await Promise.all([
        prisma.favoriteProduct.count({ where: { userId: user.id } }),
        prisma.favoriteCoach.count({ where: { userId: user.id } }),
        prisma.favoriteSession.count({ where: { userId: user.id } }),
        prisma.sessionBooking.count({ where: { userId: user.id } }),
        prisma.cart.findUnique({
          where: { userId: user.id },
          include: { items: true },
        }),
      ]);

    const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return NextResponse.json({
      favoriteProducts,
      favoriteCoaches,
      favoriteSessions,
      totalFavorites: favoriteProducts + favoriteCoaches + favoriteSessions,
      bookings,
      cartItems: cartItemsCount,
    });
  } catch (error) {
    console.error("Erreur dashboard/stats:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
