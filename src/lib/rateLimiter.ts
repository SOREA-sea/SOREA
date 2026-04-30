type Entry = { count: number; firstAt: number };

const store = new Map<string, Entry>();

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const cur = store.get(key);
  if (!cur) {
    store.set(key, { count: 1, firstAt: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (now - cur.firstAt > windowMs) {
    store.set(key, { count: 1, firstAt: now });
    return { allowed: true, remaining: limit - 1 };
  }

  cur.count += 1;
  store.set(key, cur);
  if (cur.count > limit) return { allowed: false, retryAfterMs: windowMs - (now - cur.firstAt) };
  return { allowed: true, remaining: limit - cur.count };
}

// For tests/debugging
export function resetRateLimit() {
  store.clear();
}
