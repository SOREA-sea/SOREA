import { usersDB } from "../data/inMemoryStore";
import { signToken, verifyToken as verifyJwtToken } from "./jwt";

// Authenticate user by email and password using in-memory users
// Returns user data with JWT token if found, null otherwise
export const authenticateUser = (email: string, password: string) => {
  const user = usersDB.find((u: any) => u.email === email && (u as any).password === password);
  if (!user) return null;

  const token = signToken({ id: user.id, email: user.email, role: user.role || "user" });

  return {
    id: user.id,
    email: user.email,
    name: user.name || null,
    token,
  };
};

// Verify token and return decoded payload or null
export const verifyToken = (token: string) => {
  return verifyJwtToken(token as string);
};
