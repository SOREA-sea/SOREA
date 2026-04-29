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

// POST - create a new session (protected)
// Body: { title, description, startAt }
export async function POST(request: Request) {
  try {
    const auth = await requireAuth("coach");
    if (!("id" in auth)) return auth; // auth returned a NextResponse error

    const user = auth;
    const body = await request.json();
    const { title, description, startAt } = body;

    if (!title || !startAt) return NextResponse.json({ error: "Title and startAt are required" }, { status: 400 });

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
        description: description || "",
        startsAt: new Date(startAt),
        price: 45 // Default price
      }
    });

    return NextResponse.json({ success: true, data: newSession }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
