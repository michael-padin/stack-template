// In-memory IP rate limiter for public endpoints.
//
// LIMITATION: state lives in the function instance's memory. On Vercel each
// serverless instance has its own bucket map, so a determined attacker can
// scale past the cap by fanning out across instances. Adequate for casual
// spam, NOT for adversarial abuse. Upgrade path is @upstash/ratelimit
// (or Vercel KV) once traffic justifies the dependency.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically prune expired buckets so a long-lived instance doesn't
// accumulate one entry per IP forever.
let lastSweepAt = 0;
const SWEEP_INTERVAL_MS = 60_000;

function sweep(now: number) {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return;
  lastSweepAt = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  /** Cap of allowed requests per window. */
  max: number;
  /** Window length in seconds. */
  windowSec: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the bucket resets — feed to a Retry-After header. */
  retryAfterSec: number;
  /** Cap, for X-RateLimit-Limit. */
  limit: number;
  /** Requests remaining in the current window. */
  remaining: number;
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const windowMs = opts.windowSec * 1000;
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      ok: true,
      retryAfterSec: 0,
      limit: opts.max,
      remaining: opts.max - 1,
    };
  }
  if (existing.count >= opts.max) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
      limit: opts.max,
      remaining: 0,
    };
  }
  existing.count += 1;
  return {
    ok: true,
    retryAfterSec: 0,
    limit: opts.max,
    remaining: Math.max(0, opts.max - existing.count),
  };
}

/**
 * Best-effort client identifier from request headers. Trusts the first IP in
 * X-Forwarded-For (Vercel / standard reverse-proxy convention), falls back
 * to X-Real-IP, and finally to a shared "unknown" bucket — which means
 * unidentified clients share one bucket together (effectively a global cap).
 */
export function clientKey(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
