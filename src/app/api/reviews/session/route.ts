import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "../../middleware/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = parseInt(url.searchParams.get("sessionId") || "0", 10);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));

    const where: any = {};
    if (sessionId) where.sessionId = sessionId;

    const [total, reviews] = await Promise.all([
      prisma.sessionReview.count({ where }),
      prisma.sessionReview.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    ]);

    return NextResponse.json({ data: reviews, meta: { total, page, limit } }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/reviews/session]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!('id' in user)) return user;

    const body = await request.json();
    const { sessionId, rating, reviewText } = body;
    if (!sessionId || typeof rating !== 'number') return NextResponse.json({ error: 'sessionId et rating requis' }, { status: 400 });

    const existingReview = await prisma.sessionReview.findFirst({
      where: { sessionId, userId: (user as any).id },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'Vous avez déjà laissé un avis pour cette séance.' }, { status: 409 });
    }

    const newReview = await prisma.sessionReview.create({
      data: { sessionId, userId: (user as any).id, rating, reviewText: reviewText || undefined },
    });

    return NextResponse.json({ data: newReview }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reviews/session]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
