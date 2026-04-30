import { NextResponse } from "next/server";
import { requireAuth } from "../../middleware/auth";
import prisma from "@/lib/prisma";

// GET - list sessions for authenticated coach
export async function GET() {
  try {
    const auth = await requireAuth("coach");
    if (!("id" in auth)) return auth; // auth returned a NextResponse error

    const user = auth;
    
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: user.id }
    });

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const coachSessions = await prisma.coachSession.findMany({
      where: { coachId: coachProfile.id }
    });
    
    return NextResponse.json({ success: true, data: coachSessions });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - create a new session (protected - coach only)
// Body: { title, description, startsAt, durationMinutes?, capacity?, price? }
export async function POST(request: Request) {
  try {
    const auth = await requireAuth("coach");
    if (!("id" in auth)) return auth; // auth returned a NextResponse error

    const user = auth;
    const body = await request.json();
    const { title, description, startsAt, durationMinutes, capacity, price } = body;

    // Validate required fields
    if (!title || !startsAt || price === undefined) {
      return NextResponse.json(
        { error: "Title, startsAt, and price are required" },
        { status: 400 }
      );
    }

    // Validate price is positive
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: user.id }
    });

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const newSession = await prisma.coachSession.create({
      data: {
        coachId: coachProfile.id,
        title,
        description: description || null,
        startsAt: new Date(startsAt),
        durationMinutes: durationMinutes || null,
        capacity: capacity || null,
        price,
        isPublished: false, // Default: unpublished until coach confirms
      }
    });

    return NextResponse.json({ success: true, data: newSession }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/coach/sessions] Erreur:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - delete a session (coach only)
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth("coach");
    if (!("id" in auth)) return auth;

    const user = auth;
    const { searchParams } = new URL(request.url);
    const sessionIdParam = searchParams.get("sessionId");

    if (!sessionIdParam) {
      return NextResponse.json({ error: "sessionId requis" }, { status: 400 });
    }

    const sessionId = Number(sessionIdParam);
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return NextResponse.json({ error: "sessionId invalide" }, { status: 400 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
    if (!coachProfile) return NextResponse.json({ error: "Coach introuvable" }, { status: 404 });

    const session = await prisma.coachSession.findUnique({ where: { id: sessionId } });
    if (!session || session.coachId !== coachProfile.id) {
      return NextResponse.json({ error: "Séance introuvable ou non autorisée" }, { status: 404 });
    }

    await prisma.coachSession.delete({ where: { id: sessionId } });
    return NextResponse.json({ message: "Séance supprimée" });
  } catch (error) {
    console.error("[DELETE /api/coach/sessions] Erreur:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}