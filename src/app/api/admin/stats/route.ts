import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Statistiques globales admin
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const [
      totalUsers,
      activeUsers,
      totalCoaches,
      totalProducts,
      activeProducts,
      totalSessions,
      totalBookings,
      totalReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.coachProfile.count(),
      prisma.shopProduct.count(),
      prisma.shopProduct.count({ where: { isActive: true } }),
      prisma.coachSession.count(),
      prisma.sessionBooking.count(),
      prisma.coachReview.count(),
    ]);

    // Revenus estimés (prix des bookings)
    const bookingsWithPrice = await prisma.sessionBooking.findMany({
      include: { session: { select: { price: true } } },
    });
    const totalRevenue = bookingsWithPrice.reduce((sum, b) => sum + b.session.price, 0);

    // Derniers inscrits (5)
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalCoaches,
      totalProducts,
      activeProducts,
      totalSessions,
      totalBookings,
      totalReviews,
      totalRevenue,
      recentUsers,
    });
  } catch (error) {
    console.error("Erreur admin/stats:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
