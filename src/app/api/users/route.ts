import { successResponse, errorResponse } from "../utils/response";
import { usersDB } from "../data/inMemoryStore";

// GET - Retrieve all users or single user by ID
// Query params: id (optional) - Can pass ?id=1 to get specific user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Get user by ID if provided
    if (id) {
      const user = usersDB.find((u) => u.id === parseInt(id));
      if (!user) {
        return errorResponse("User not found", 404);
      }
      return successResponse(user, "User found");
    }

    // Return all users
    return successResponse(usersDB, "All users retrieved");
  } catch (error) {
    return errorResponse("Internal server error", 500, error);
  }
}

// POST - Create new user
// Body: { name: string, email: string, role?: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    // Validate required fields
    if (!name || !email) {
      return errorResponse("Name and email are required", 400);
    }

    // Create new user object
    const newUser = {
      id: usersDB.length + 1,
      name,
      email,
      role: role || "user",
    };

    // Add to in-memory store (no DB required)
    usersDB.push(newUser);
    return successResponse(newUser, "User created successfully", 201);
  } catch (error) {
    return errorResponse("Internal server error", 500, error);
  }
}
