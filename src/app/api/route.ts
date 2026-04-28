import { successResponse } from "./utils/response";
import { ensureEnv } from "./utils/env";
import { info } from "./utils/logger";

// Main API endpoint - Returns welcome message and list of available endpoints
export async function GET() {
  // Ensure required env vars are present (warn in dev, throw in prod)
  const missing = ensureEnv();
  if (missing.length > 0) info(`Missing env vars: ${missing.join(', ')}`);

  return successResponse(
    {
      message: "API responding <3",
      endpoints: {
        health: "/api/health",
        auth: {
          login: "POST /api/auth/login",
          coach_register: "POST /api/auth/coach/register",
          coach_login: "POST /api/auth/coach/login",
        },
        users: {
          getAll: "GET /api/users",
          getById: "GET /api/users?id=1",
          create: "POST /api/users",
        },
        products: {
          getAll: "GET /api/products",
          getById: "GET /api/products?id=1",
          create: "POST /api/products",
        },
      },
    },
    "Welcome to SOREA API"
  );
}