// Public client-side env. Inlined by Next.js at build time. Add a
// NEXT_PUBLIC_* var here AND in runtimeEnv, then reference via this module —
// never read process.env directly (see CLAUDE.md).

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    // Display name used across both apps (titles, sign-in, auth). The rename
    // script sets this per project; the default keeps the template self-describing.
    NEXT_PUBLIC_APP_NAME: z.string().default("Internal Tools"),
    NEXT_PUBLIC_ADMIN_URL: z.url().optional(),
    NEXT_PUBLIC_WEB_URL: z.url().optional(),
    NEXT_PUBLIC_SITE_URL: z.url().optional(),
    // Set only when the storage package (R2/S3) is in use.
    NEXT_PUBLIC_R2_PUBLIC_URL: z.url().optional(),
    // Sentry DSN — when unset, the instrumentation files no-op (no error
    // reporting). Set per environment to enable @sentry/nextjs.
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});

export type ClientEnv = typeof env;

/** Convenience constant — the app's display name. */
export const APP_NAME = env.NEXT_PUBLIC_APP_NAME;
