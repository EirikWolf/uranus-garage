// Simple in-memory rate limiter for serverless functions.
// Each Vercel function instance has its own memory, so this provides
// per-instance limiting. Good enough to prevent abuse from a single
// client hammering one function instance.

const store = new Map<string, { count: number; resetTime: number }>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export function rateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60_000,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // Clean up expired entries periodically
  if (store.size > 10_000) {
    for (const [k, v] of store) {
      if (v.resetTime < now) store.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}
