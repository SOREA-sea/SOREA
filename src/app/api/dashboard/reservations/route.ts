import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../middleware/auth";
import prisma from "@/lib/prisma";

async function getSessionWithCapacity(sessionId: number) {
  return prisma.coachSession.findUnique({
    where: { id: sessionId },
    select: { id: true, isPublished: true, capacity: true, title: true, startsAt: true, price: true },
  });
}

async function countReservedSlots(sessionId: number) {
  return prisma.sessionBooking.count({
    where: { sessionId, status: { in: ["pending", "confirmed"] } },
  });
}

async function confirmReservation(bookingId: number, userId: number) {
  const reservation = await prisma.sessionBooking.findFirst({
    where: { id: bookingId, userId, status: "pending" },
    include: { session: { select: { capacity: true } } },
  });

  if (!reservation) {
    return { ok: false as const, status: 404, error: "Réservation introuvable" };
  }

  const confirmedCount = await prisma.sessionBooking.count({
    where: { sessionId: reservation.sessionId, status: "confirmed" },
  });

  if (reservation.session.capacity && confirmedCount >= reservation.session.capacity) {
    return { ok: false as const, status: 409, error: "Cette séance est complète" };
  }

  const updated = await prisma.sessionBooking.update({
    where: { id: bookingId },
    data: { status: "confirmed" },
  });

  return { ok: true as const, reservation: updated };
}

export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const reservations = await prisma.sessionBooking.findMany({
      where: { userId: user.id, status: "pending" },
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

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Erreur dashboard/reservations GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const sessionId = Number(body?.sessionId);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return NextResponse.json({ error: "sessionId invalide" }, { status: 400 });
    }

    const session = await getSessionWithCapacity(sessionId);
    if (!session || !session.isPublished) {
      return NextResponse.json({ error: "Séance introuvable ou non disponible" }, { status: 404 });
    }

    const existingReservation = await prisma.sessionBooking.findFirst({
      where: { userId: user.id, sessionId, status: { in: ["pending", "confirmed"] } },
    });

    if (existingReservation) {
      return NextResponse.json({ error: "Cette séance est déjà dans vos réservations" }, { status: 409 });
    }

    const reservedCount = await countReservedSlots(sessionId);
    if (session.capacity && reservedCount >= session.capacity) {
      return NextResponse.json({ error: "Cette séance est complète" }, { status: 409 });
    }

    const reservation = await prisma.sessionBooking.create({
      data: {
        userId: user.id,
        sessionId,
        status: "pending",
      },
    });

    return NextResponse.json({ message: "Séance ajoutée à vos réservations", reservation }, { status: 201 });
  } catch (error) {
    console.error("Erreur dashboard/reservations POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const reservationId = body?.reservationId ? Number(body.reservationId) : null;
    const confirmAll = Boolean(body?.confirmAll);

    if (reservationId) {
      const result = await confirmReservation(reservationId, user.id);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }

      return NextResponse.json({ message: "Réservation confirmée", reservation: result.reservation });
    }

    if (!confirmAll) {
      return NextResponse.json({ error: "Aucune action demandée" }, { status: 400 });
    }

    const pendingReservations = await prisma.sessionBooking.findMany({
      where: { userId: user.id, status: "pending" },
      orderBy: { bookedAt: "asc" },
    });

    const confirmed: number[] = [];
    for (const reservation of pendingReservations) {
      const result = await confirmReservation(reservation.id, user.id);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      confirmed.push(reservation.id);
    }

    return NextResponse.json({ message: "Toutes les réservations ont été confirmées", confirmed });
  } catch (error) {
    console.error("Erreur dashboard/reservations PATCH:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reservationIdParam = searchParams.get("reservationId");

    if (reservationIdParam) {
      const reservationId = Number(reservationIdParam);
      if (!Number.isInteger(reservationId) || reservationId <= 0) {
        return NextResponse.json({ error: "reservationId invalide" }, { status: 400 });
      }

      const reservation = await prisma.sessionBooking.findFirst({
        where: { id: reservationId, userId: user.id, status: "pending" },
      });

      if (!reservation) {
        return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
      }

      await prisma.sessionBooking.delete({ where: { id: reservationId } });
      return NextResponse.json({ message: "Réservation supprimée" });
    }

    await prisma.sessionBooking.deleteMany({ where: { userId: user.id, status: "pending" } });
    return NextResponse.json({ message: "Réservations vidées" });
  } catch (error) {
    console.error("Erreur dashboard/reservations DELETE:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}