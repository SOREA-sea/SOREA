import { successResponse, errorResponse } from "../../../utils/response";
import { hashPassword } from "../../../utils/hash";
import { coachesDB } from "../../../data/inMemoryStore";

// Coach registration endpoint
// Body: { name, email, password }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return errorResponse("Name, email and password are required", 400);
    }

    // Prevent duplicate emails
    const exists = coachesDB.find((c) => c.email === email);
    if (exists) return errorResponse("Coach with this email already exists", 409);

    const hashed = await hashPassword(password);
    const coach = {
      id: coachesDB.length + 1,
      name,
      email,
      password: hashed,
      role: "coach",
    };

    coachesDB.push(coach);

    // Don't return password
    const { password: _p, ...safe } = coach;
    return successResponse(safe, "Coach registered", 201);
  } catch (error) {
    return errorResponse("Internal server error", 500, error);
  }
}
