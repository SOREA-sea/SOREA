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
    endpoints: {
      health: "/api/health",
      auth: {
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
      },
    },
  }, { status: 200 });
}