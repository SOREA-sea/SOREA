import { successResponse } from "../utils/response";
import { ensureEnv } from "../utils/env";
import { info } from "../utils/logger";

// Health check endpoint - returns server status
export async function GET() {
  // Validate envs and log if missing
  const missing = ensureEnv();
  if (missing.length > 0) info(`Missing env vars: ${missing.join(', ')}`);

  return successResponse(
    { status: "online", timestamp: new Date().toISOString() },
    "Server is running"
  );
}
