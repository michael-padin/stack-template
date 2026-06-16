// Server-side Sentry wiring (Next 16 instrumentation hook). Fully optional:
// when NEXT_PUBLIC_SENTRY_DSN is unset, register() does nothing and
// onRequestError forwards nowhere — zero runtime cost, no thrown errors.
//
// We intentionally do NOT wrap next.config.ts with `withSentryConfig` (that's
// what uploads source maps and rewrites the build). If you want readable
// stack traces in the Sentry UI, add `withSentryConfig(nextConfig, {...})`
// in apps/admin/next.config.ts — see https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { env } from "@repo/env/client";

export function register(): void {
  const dsn = env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}

// Next 16 routes server-side request errors here. No-op without a DSN because
// captureRequestError is a safe pass-through when Sentry was never initialized.
export const onRequestError = Sentry.captureRequestError;
