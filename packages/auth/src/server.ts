import { prisma } from "@repo/db";
import { env } from "@repo/env/auth";
import { APP_NAME } from "@repo/env/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { accessControl, accessControlRoles } from "./access-control";

export const auth = betterAuth({
  appName: APP_NAME,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },

  socialProviders:
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    // cookieCache temporarily disabled — with it on, session.user fields
    // (banned, role, email…) snapshot into the cookie and stay stale for the
    // TTL, so admin-driven mutations on a user lag from that user's POV.
    // Re-enable once admin mutations explicitly invalidate the cookie cache.
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 5 * 60,
    // },
  },

  // Brute-force protection. Better Auth tightens the limits on its known
  // sensitive endpoints (sign-in, password reset) on top of these defaults.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },

  // Better Auth's experimental joins flag fuses session+user reads into a
  // single query — important on Neon serverless where every round-trip is
  // a separate WebSocket exchange. Revisit when better-auth marks it stable.
  experimental: { joins: true },

  plugins: [
    // Multi-role RBAC. `roles` lists every assignable role; `adminRoles` is the
    // subset granted access to the admin plugin's API (`/api/auth/admin/*`).
    //
    // `defaultRole` stays `admin` so a fresh clone bootstraps with zero setup —
    // the first sign-up is an admin. Real projects should lower this to
    // `"viewer"` (or `"editor"`) and promote the first admin by hand (see
    // docs/04-authentication.md → "Bootstrapping the first admin").
    admin({
      defaultRole: "admin",
      // `ac` + `roles` teach the admin plugin our `admin | editor | viewer`
      // access-control roles (defined in ./access-control). `adminRoles` is the
      // subset granted access to the admin API (`/api/auth/admin/*`).
      ac: accessControl,
      roles: accessControlRoles,
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
});

export type Auth = typeof auth;
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
