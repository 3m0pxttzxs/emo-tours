interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
const CLEANUP_INTERVAL_MS = 60_000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.expiresAt) {
        store.delete(key);
      }
    }
    // Stop the timer if the store is empty to avoid leaking
    if (store.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL_MS);
  // Allow the Node.js process to exit even if the timer is active
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Simple in-memory rate limiter.
 * @param request  Incoming request (used to extract client IP)
 * @param limit    Max requests allowed in the window (default 10)
 * @param windowMs Window duration in milliseconds (default 60 000 — 1 minute)
 */
export function rateLimit(
  request: Request,
  limit = 10,
  windowMs = 60_000,
): { success: boolean } {
  ensureCleanup();

  const ip = getClientIp(request);
  const key = ip;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.expiresAt) {
    // First request or window expired — start a new window
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  // Within the current window
  entry.count += 1;

  if (entry.count > limit) {
    return { success: false };
  }

  return { success: true };
}
