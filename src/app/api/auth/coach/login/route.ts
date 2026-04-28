import { successResponse, errorResponse } from "../../../utils/response";
import { comparePassword } from "../../../utils/hash";
import { signToken } from "../../../utils/jwt";
import { coachesDB } from "../../../data/inMemoryStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) return errorResponse("Email and password are required", 400);

    const coach = coachesDB.find((c) => c.email === email);
    if (!coach) return errorResponse("Invalid credentials", 401);

    const ok = await comparePassword(password, coach.password);
    if (!ok) return errorResponse("Invalid credentials", 401);

    // Sign token with coach id, email and role
    const token = signToken({ id: coach.id, email: coach.email, role: "coach", name: coach.name });

    return successResponse({ token, id: coach.id, email: coach.email, name: coach.name }, "Login successful");
  } catch (error) {
    return errorResponse("Internal server error", 500, error);
  }
}
