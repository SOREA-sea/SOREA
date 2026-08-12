import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API Testimonials - Gestion des avis clients
 *
 * GET - Récupérer les avis (depuis CoachReview)
 *       Query params: ?limit=X (défaut: 6)
 *
 * POST - Créer un nouvel avis (futur usage)
 *        Body: { coachId, userId, rating, reviewText }
 */

// GET - Récupérer les avis clients
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    // Récupérer les derniers avis depuis la base de données
    const reviews = await prisma.coachReview.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Formater les données pour la réponse
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      author: `${review.user.firstName} ${review.user.lastName.charAt(0)}.`,
      text: review.reviewText || '',
      rating: review.rating,
      createdAt: review.createdAt,
      avatarUrl: review.user.avatarUrl,
    }));

    return NextResponse.json({
      data: formattedReviews,
      message: "Avis récupérés avec succès",
    }, { status: 200 });

  } catch (error) {
    console.error("[GET /api/testimonials] Erreur:", error);

    // Fallback: données statiques pour le développement
    const seed = [
      { id: 1, author: 'Alice', text: 'Expérience très apaisante, a aidé ma routine quotidienne.', rating: 5 },
      { id: 2, author: 'Bob', text: 'Excellent accompagnement et conseils personnalisés.', rating: 4 },
      { id: 3, author: 'Claire', text: "J'ai adoré les kits et les rituels courts.", rating: 5 },
    ];

    return NextResponse.json({
      data: seed,
      message: "Avis récupérés (fallback static)",
    }, { status: 200 });
  }
}

// POST - Créer un nouvel avis
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coachId, userId, rating, reviewText } = body;

    // Validation des champs obligatoires
    if (!coachId || !userId || !rating) {
      return NextResponse.json(
        { error: "Les champs 'coachId', 'userId' et 'rating' sont obligatoires" },
        { status: 400 }
      );
    }

    // Validation de la note (1-5)
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: "La note doit être comprise entre 1 et 5" },
        { status: 400 }
      );
    }

    // Validation des IDs
    const parsedCoachId = parseInt(coachId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedCoachId) || isNaN(parsedUserId)) {
      return NextResponse.json(
        { error: "coachId et userId doivent être des nombres valides" },
        { status: 400 }
      );
    }

    // Vérifier que le coach existe
    const coach = await prisma.coachProfile.findUnique({
      where: { id: parsedCoachId },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: parsedUserId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Création de l'avis
    const newReview = await prisma.coachReview.create({
      data: {
        coachId: parsedCoachId,
        userId: parsedUserId,
        rating: parsedRating,
        reviewText: reviewText || null,
      },
    });

    // Mettre à jour la note moyenne du coach
    const allReviews = await prisma.coachReview.findMany({
      where: { coachId: parsedCoachId },
      select: { rating: true },
    });

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.coachProfile.update({
      where: { id: parsedCoachId },
      data: { averageRating },
    });

    return NextResponse.json({
      data: newReview,
      message: "Avis ajouté avec succès",
    }, { status: 201 });

  } catch (error) {
    console.error("[POST /api/testimonials] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
