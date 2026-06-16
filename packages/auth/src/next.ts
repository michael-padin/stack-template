import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "./server";

export const { GET, POST } = toNextJsHandler(auth);

async function getServerSession() {
  return auth.api.getSession({ headers: await nextHeaders() });
}

export async function requireAdmin(redirectTo = "/sign-in") {
  const session = await getServerSession();
  if (!session) {
    redirect(redirectTo);
  }
  // Better Auth's admin plugin attaches role/banned/banExpires to user; types
  // aren't re-exported, so we narrow against the documented shape.
  const user = session.user as {
    role?: string;
    banned?: boolean | null;
    banExpires?: Date | string | null;
  };
  if (user.role !== "admin") {
    redirect("/forbidden");
  }
  // Honour the ban flag. banExpires === null means "permanent"; a future date
  // means the ban is still active. Past dates fall through (auto-expiry).
  if (user.banned) {
    const expiresAt = user.banExpires ? new Date(user.banExpires) : null;
    if (!expiresAt || expiresAt.getTime() > Date.now()) {
      redirect("/forbidden");
    }
  }
  return session;
}
