import { successResponse, errorResponse } from "../../utils/response";
import { authenticateUser } from "../../utils/auth";

// Login endpoint - POST request with email and password
// Returns user data and token if successful
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    // Authenticate user
    const user = authenticateUser(email, password);
    if (!user) {
      return errorResponse("Invalid credentials", 401);
    }

    return successResponse(user, "Login successful", 200);
  } catch (error) {
    return errorResponse("Internal server error", 500, error);
  }
}
