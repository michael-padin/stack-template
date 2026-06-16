// Client-side Sentry wiring (Next 16 client instrumentation). Fully optional:
// when NEXT_PUBLIC_SENTRY_DSN is unset, this file does nothing.
//
// We intentionally do NOT wrap next.config.ts with `withSentryConfig` (source
// maps / build rewrite). To enable readable client stack traces, add it in
// apps/web/next.config.ts — see https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { env } from "@repo/env/client";

const dsn = env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}

// To instrument client-side navigations for tracing, also export
// `onRouterTransitionStart = Sentry.captureRouterTransitionStart` here once your
// installed @sentry/nextjs version exposes it (Next 16 client tracing API).
