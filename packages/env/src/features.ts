// Feature flags — server-only, deploy-time toggles. Off by default, so a fresh
// deploy starts lean; flip a flag in the environment to reveal a surface. Adding
// a flag follows the same three-file rule as any env var: declare it here, add it
// to turbo.json's build.env, and document it in .env.example. To make a flag
// owner-facing later, move the source of getFeatureFlags() to a settings table —
// the call sites (nav filters, requireFeature) don't change.

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// Env vars are strings; accept the usual truthy spellings and reject typos rather
// than silently coercing (plain z.coerce.boolean() treats "false" as true).
// Unset → default "false" → the feature stays off.
const flag = z
  .enum(["true", "false", "1", "0", "on", "off"])
  .default("false")
  .transform((value) => value === "true" || value === "1" || value === "on");

export const env = createEnv({
  server: {
    // Example flag — replace with your project's real flags. Off → the gated
    // surface is hidden from nav and unreachable by URL (see requireFeature);
    // on → it's live.
    BETA_FEATURES: flag,
  },
  runtimeEnv: process.env,
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});

export type FeatureEnv = typeof env;

export interface FeatureFlags {
  betaFeatures: boolean;
}

// Coerce to a real boolean. With SKIP_ENV_VALIDATION=1 (set on CI/Vercel builds,
// see docs/08-deployment.md), t3-env returns the RAW string env — the Zod
// .transform() above never runs — so env.BETA_FEATURES is the string "false",
// which is truthy and would leave the surface ON. Normalize here, at the single
// read point, so a flag is on ONLY for the truthy spellings whether the value
// arrives as a parsed boolean (validation ran) or a raw string.
const asFlag = (value: boolean | string | undefined): boolean =>
  value === true || value === "true" || value === "1" || value === "on";

/** The resolved feature flags. Read this in Server Components, route guards, and
 * layouts; pass the plain booleans down to client components as props. */
export function getFeatureFlags(): FeatureFlags {
  return {
    betaFeatures: asFlag(env.BETA_FEATURES),
  };
}
