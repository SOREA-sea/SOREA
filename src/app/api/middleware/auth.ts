import { errorResponse } from "../utils/response";
import { verifyToken } from "../utils/jwt";

// Extract user from Authorization header (Bearer token)
export const getUserFromRequest = (request: Request) => {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  if (!token) return null;

  const decoded = verifyToken(token as string);
  return decoded;
};

// Require authentication and optional role check
// If not authenticated or not authorized, return a Response (error)
// Otherwise return the decoded user object
export const requireAuth = (request: Request, role?: string) => {
  const user = getUserFromRequest(request);
  if (!user) return errorResponse("Unauthorized", 401);
  if (role && (user as any).role !== role) return errorResponse("Forbidden", 403);
  return user;
};
