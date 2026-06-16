import { prisma } from "@repo/db";
import { env } from "@repo/env/auth";
import { APP_NAME } from "@repo/env/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

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
    admin({
      defaultRole: "admin",
      adminRole: "admin",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
});

export type Auth = typeof auth;
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
