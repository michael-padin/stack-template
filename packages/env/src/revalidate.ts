// Revalidation env. Shared server secret that admin Server Actions use
// to authenticate POSTs to the public web's /api/revalidate endpoint
// when invalidating the public-points / public-reports caches.

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    REVALIDATE_SECRET: z.string().min(16, "REVALIDATE_SECRET must be ≥ 16 chars").optional(),
  },
  runtimeEnv: process.env,
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});

export type RevalidateEnv = typeof env;
