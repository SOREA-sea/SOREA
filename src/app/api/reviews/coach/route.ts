import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "../../middleware/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const coachId = parseInt(url.searchParams.get("coachId") || "0", 10);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));

    const where: any = {};
    if (coachId) where.coachId = coachId;

    const [total, reviews] = await Promise.all([
      prisma.coachReview.count({ where }),
      prisma.coachReview.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    ]);

    return NextResponse.json({ data: reviews, meta: { total, page, limit } }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/reviews/coach]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!('id' in user)) return user;

    const body = await request.json();
    const { coachId, rating, reviewText } = body;
    if (!coachId || typeof rating !== 'number') return NextResponse.json({ error: 'coachId et rating requis' }, { status: 400 });

    const newReview = await prisma.coachReview.create({
      data: { coachId, userId: (user as any).id, rating, reviewText: reviewText || undefined },
    });

    return NextResponse.json({ data: newReview }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reviews/coach]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
