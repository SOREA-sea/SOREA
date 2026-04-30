import { NextResponse } from "next/server";
import { ensureEnv } from "./utils/env";
import { info } from "./utils/logger";

// Main API endpoint - Returns welcome message and list of available endpoints
export async function GET() {
  // Ensure required env vars are present (warn in dev, throw in prod)
  const missing = ensureEnv();
  if (missing.length > 0) info(`Missing env vars: ${missing.join(', ')}`);

  return NextResponse.json({
    message: "API responding <3",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (protected)",
        logout: "POST /api/auth/logout (protected)",
      },
      users: {
        list: "GET /api/users (protected - admin)",
        create: "POST /api/users (public with validation)",
      },
      products: {
        list: "GET /api/products (public)",
        create: "POST /api/products (protected - admin)",
      },
      sessions: {
        list: "GET /api/sessions (public)",
        create: "POST /api/sessions (protected - coach)",
      },
      coach: {
        sessions_list: "GET /api/coach/sessions (protected - coach)",
        sessions_create: "POST /api/coach/sessions (protected - coach)",
      },
      testimonials: {
        list: "GET /api/testimonials (public)",
      },
    },
  }, { status: 200 });
}