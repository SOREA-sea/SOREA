import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

// Sign a payload and return a token
export const signToken = (payload: object, expiresIn = "7d") => {
  return jwt.sign(payload as any, SECRET, { expiresIn });
};

// Verify token and return decoded payload or null
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch {
    return null;
  }
};
