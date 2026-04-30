import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET — Retourne les réservations de séances du user connecté
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const bookings = await prisma.sessionBooking.findMany({
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
            coach: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
                specialty: true,
              },
            },
          },
        },
      },
      orderBy: { bookedAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Erreur dashboard/bookings GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// POST — Réserve une séance
// Body: { sessionId: number }
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Le champ 'sessionId' est requis" },
        { status: 400 }
      );
    }

    // Vérifier que la session existe et est publiée
    const session = await prisma.coachSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || !session.isPublished) {
      return NextResponse.json(
        { error: "Séance introuvable ou non disponible" },
        { status: 404 }
      );
    }

    // Vérifier que le user n'a pas déjà réservé cette session
    const existingBooking = await prisma.sessionBooking.findFirst({
      where: { userId: user.id, sessionId },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Vous avez déjà réservé cette séance" },
        { status: 409 }
      );
    }

    // Vérifier la capacité
    if (session.capacity) {
      const currentBookings = await prisma.sessionBooking.count({
        where: { sessionId },
      });
      if (currentBookings >= session.capacity) {
        return NextResponse.json(
          { error: "Cette séance est complète" },
          { status: 409 }
        );
      }
    }

    const booking = await prisma.sessionBooking.create({
      data: {
        userId: user.id,
        sessionId,
        status: "confirmed",
      },
    });

    return NextResponse.json({ message: "Séance réservée avec succès", booking }, { status: 201 });
  } catch (error) {
    console.error("Erreur dashboard/bookings POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}