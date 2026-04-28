import { successResponse, errorResponse } from "../../utils/response";
import { requireAuth } from "../../middleware/auth";

// Simulated sessions DB
const sessionsDB: any[] = [];

// GET - list sessions for authenticated coach
export async function GET(request: Request) {
  try {
    const auth = requireAuth(request, "coach");
    if ((auth as any).success === false) return auth; // auth returned a Response (error)

    const user = auth as any;
    const coachSessions = sessionsDB.filter((s) => s.coachId === user.id);
    return successResponse(coachSessions, "Coach sessions retrieved");
  } catch (error) {
    return errorResponse("Internal server error", 500, error);
  }
}

// POST - create a new session (protected)
// Body: { title, description, startAt }
export async function POST(request: Request) {
  try {
    const auth = requireAuth(request, "coach");
    if ((auth as any).success === false) return auth;

    const user = auth as any;
    const body = await request.json();
    const { title, description, startAt } = body;

    if (!title || !startAt) return errorResponse("Title and startAt are required", 400);

    const newSession = {
      id: sessionsDB.length + 1,
      coachId: user.id,
      title,
      description: description || "",
      startAt,
    };

    sessionsDB.push(newSession);
    return successResponse(newSession, "Session created", 201);
  } catch (error) {
    return errorResponse("Internal server error", 500, error);
  }
}
