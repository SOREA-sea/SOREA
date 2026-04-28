// Environment validation utility
const REQUIRED_ENVS = [
  'JWT_SECRET',
];

export function ensureEnv() {
  const missing: string[] = [];
  for (const key of REQUIRED_ENVS) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    const message = `Missing required env vars: ${missing.join(', ')}`;
    if (process.env.NODE_ENV === 'production') {
      // In production, throw to avoid running with missing secrets
      throw new Error(message);
    } else {
      // In dev, log a warning
      // eslint-disable-next-line no-console
      console.warn('[env] Warning -', message);
    }
  }

  return missing;
}
