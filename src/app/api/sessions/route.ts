import { NextResponse } from "next/server";
import { requireAuth } from "../middleware/auth";
import prisma from "@/lib/prisma";

/**
 * API Sessions - Gestion des séances de coaching
 *
 * GET - Récupérer toutes les sessions publiées (PUBLIC)
 *       Retourne une liste de sessions depuis la DB (fallback: données statiques si DB indisponible)
 *
 * POST - Créer une nouvelle session (PROTECTED - coach only)
 *        Body: { title, description, sessionType, startsAt, durationMinutes, capacity, price }
 */

// GET - Récupérer toutes les sessions publiées (PUBLIC)
export async function GET() {
  try {
    // Récupérer toutes les sessions publiées depuis la base de données
    const sessions = await prisma.coachSession.findMany({
      where: { isPublished: true },
      include: {
        coach: {
          select: {
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
      orderBy: { startsAt: 'asc' },
    });

    // Formater les données pour la réponse
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      sessionType: session.sessionType,
      startsAt: session.startsAt,
      durationMinutes: session.durationMinutes,
      capacity: session.capacity,
      price: session.price,
      // Generate placeholder image based on session id
      imageUrl: `/images/session_${(session.id % 2) + 1}.webp`,
      coach: session.coach?.user,
    }));

    return NextResponse.json({
      data: formattedSessions,
      message: "Sessions récupérées avec succès",
    }, { status: 200 });

  } catch (error) {
    console.error("[GET /api/sessions] Erreur:", error);

    // Fallback: données statiques pour le développement si la DB est indisponible
    const seed = [
      { id: 1, title: 'Pilates', price: 45, imageUrl: '/images/session_1.webp', sessionType: 'Pilates session' },
      { id: 2, title: 'Méditation', price: 40, imageUrl: '/images/session_2.webp', sessionType: 'Meditation session' },
      { id: 3, title: 'Yoga', price: 50, imageUrl: '/images/yoga.webp', sessionType: 'Yoga session' },
    ];

    return NextResponse.json({
      data: seed,
      message: "Sessions récupérées (fallback static)",
    }, { status: 200 });
  }
}

// POST - Créer une nouvelle session (PROTECTED - coach only)
export async function POST(request: Request) {
  try {
    // Require coach authentication
    const auth = await requireAuth("coach");
    if (!("id" in auth)) return auth; // auth returned a NextResponse error

    const user = auth;
    const body = await request.json();
    const { title, description, sessionType, startsAt, durationMinutes, capacity, price } = body;

    // Validation des champs obligatoires
    if (!title || !price) {
      return NextResponse.json(
        { error: "Les champs 'title' et 'price' sont obligatoires" },
        { status: 400 }
      );
    }

    // Validation du prix
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: "Le prix doit être un nombre positif" },
        { status: 400 }
      );
    }

    // Get coach profile
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: user.id },
    });

    if (!coachProfile) {
      return NextResponse.json(
        { error: "Coach profile not found" },
        { status: 404 }
      );
    }

    // Création de la session
    const newSession = await prisma.coachSession.create({
      data: {
        coachId: coachProfile.id,
        title,
        description: description || null,
        sessionType: sessionType || null,
        startsAt: startsAt ? new Date(startsAt) : null,
        durationMinutes: durationMinutes || 60,
        capacity: capacity || 10,
        price,
        isPublished: false, // Default: unpublished until approved
      },
    });

    return NextResponse.json({
      data: newSession,
      message: "Session créée avec succès",
    }, { status: 201 });

  } catch (error) {
    console.error("[POST /api/sessions] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une session
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, sessionType, startsAt, durationMinutes, capacity, price, imageUrl, isPublished } = body;

    // Validation de l'ID
    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la session est requis" },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    // Vérifier que la session existe
    const existingSession = await prisma.coachSession.findUnique({
      where: { id: parsedId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404 }
      );
    }

    // Mise à jour de la session
    const updatedSession = await prisma.coachSession.update({
      where: { id: parsedId },
      data: {
        title: title ?? existingSession.title,
        description: description ?? existingSession.description,
        sessionType: sessionType ?? existingSession.sessionType,
        startsAt: startsAt !== undefined ? (startsAt ? new Date(startsAt) : null) : existingSession.startsAt,
        durationMinutes: durationMinutes ?? existingSession.durationMinutes,
        capacity: capacity ?? existingSession.capacity,
        price: price ?? existingSession.price,
        imageUrl: imageUrl ?? existingSession.imageUrl,
        isPublished: isPublished ?? existingSession.isPublished,
      },
    });

    return NextResponse.json({
      data: updatedSession,
      message: "Session mise à jour avec succès",
    }, { status: 200 });

  } catch (error) {
    console.error("[PUT /api/sessions] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Désactiver une session (soft delete via isPublished)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    // Validation de l'ID
    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la session est requis" },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    // Vérifier que la session existe
    const existingSession = await prisma.coachSession.findUnique({
      where: { id: parsedId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404 }
      );
    }

    // Soft delete : dépublier la session au lieu de la supprimer
    // Cela préserve l'historique des réservations
    await prisma.coachSession.update({
      where: { id: parsedId },
      data: { isPublished: false },
    });

    return NextResponse.json({
      message: "Session dépubliée avec succès",
    }, { status: 200 });

  } catch (error) {
    console.error("[DELETE /api/sessions] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
