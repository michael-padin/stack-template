import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { clientKey, rateLimit } from "@/lib/rate-limit";

// Per-IP rate limit for public POST endpoints. GETs are read-only and cached,
// so they don't need this; auth-protected endpoints (revalidate) are gated by
// their bearer-token check instead. The base template ships no public POST
// routes — add yours here to rate-limit them.
const RATE_LIMITED_POST_PATHS = new Set<string>([
  // "/api/public/contact",
]);

const POST_RATE_LIMIT = {
  max: 5, // 5 submissions
  windowSec: 600, // per 10 minutes per IP
};

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (request.method !== "POST" || !RATE_LIMITED_POST_PATHS.has(path)) {
    return NextResponse.next();
  }

  const key = `public:${clientKey(request)}`;
  const result = rateLimit(key, POST_RATE_LIMIT);

  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfterSec),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  return response;
}

export const config = {
  matcher: ["/api/public/:path*"],
};
