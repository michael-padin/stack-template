import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_PATHS = new Set(["/sign-in", "/forbidden"]);

// Optimistic auth gate — server components still call requireAdmin() before reading data.
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (PUBLIC_PATHS.has(path) || path.startsWith("/_next") || path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    // API clients want a JSON 401, not an HTML redirect to /sign-in.
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-icon|icon|sitemap.xml|robots.txt).*)"],
};
