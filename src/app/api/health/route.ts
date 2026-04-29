import { NextResponse } from "next/server";
import { ensureEnv } from "../utils/env";
import { info } from "../utils/logger";

// Health check endpoint - returns server status
export async function GET() {
  // Validate envs and log if missing
  const missing = ensureEnv();
  if (missing.length > 0) info(`Missing env vars: ${missing.join(', ')}`);

  return NextResponse.json({
    status: "online", 
    timestamp: new Date().toISOString(),
    message: "Server is running"
  }, { status: 200 });
}
