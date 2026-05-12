import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const domain = searchParams.get('domain');
    const query = searchParams.get('query');

    const where: Record<string, unknown> = {};

    if (domain && domain !== 'Tous les domaines') {
      where.specialty = { contains: domain, mode: 'insensitive' };
    }
    if (query) {
      where.OR = [
        { bio: { contains: query, mode: 'insensitive' } },
        { specialty: { contains: query, mode: 'insensitive' } },
        { user: { firstName: { contains: query, mode: 'insensitive' } } },
        { user: { lastName: { contains: query, mode: 'insensitive' } } },
      ];
    }
    if (city && city !== 'Toutes les villes') {
      // filter by related user.city
      where.user = { city };
    }

    const coaches = await prisma.coachProfile.findMany({
      where: where as unknown as object,
      include: {
        user: true,
        _count: { select: { coachReviews: true } },
      },
      orderBy: { averageRating: 'desc' },
      take: 100,
    });

    // map to a minimal shape expected by the frontend
    const payload = coaches.map(c => ({
      id: c.id,
      bio: c.bio,
      specialty: c.specialty,
      hourlyRate: c.hourlyRate,
      averageRating: c.averageRating,
      verified: c.verified,
      user: {
        id: c.user.id,
        firstName: c.user.firstName,
        lastName: c.user.lastName,
        avatarUrl: c.user.avatarUrl,
        city: (c.user as unknown as { city?: string | null }).city ?? null,
      },
      _count: c._count,
    }));

    return NextResponse.json({ coaches: payload });
  } catch (error) {
    console.error('[GET /api/coaches] Erreur', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
