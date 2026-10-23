/**
 * server/utils/rate-limit.ts — in-memory sliding-window rate limiter.
 *
 * Protects public endpoints (like feedback submissions) against spam flooding.
 */

import type { H3Event } from "h3";

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();
const CLEANUP_INTERVAL_MS = 60_000;

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(
  event: H3Event,
  options: { keyPrefix?: string; maxRequests?: number; windowMs?: number } = {}
): void {
  const { keyPrefix = "rl", maxRequests = 10, windowMs = 60_000 } = options;
  cleanup();

  // Extract client identifier from standard proxy headers or fallback
  const ip =
    getHeader(event, "x-forwarded-for")?.split(",")[0]?.trim() ||
    getHeader(event, "cf-connecting-ip") ||
    getHeader(event, "x-real-ip") ||
    "127.0.0.1";

  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  bucket.count++;
  if (bucket.count > maxRequests) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    setHeader(event, "Retry-After", retryAfter);
    throw createError({
      statusCode: 429,
      statusMessage: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    });
  }
}
