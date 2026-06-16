// Structured JSON logger shared by both apps.
//
// We use PLAIN pino with no `transport` option: pino transports spin up a
// worker thread, and worker-thread transports break under Next.js bundling
// (the worker entrypoint can't be resolved at runtime). Emitting raw JSON to
// stdout keeps it bundler-safe and lets the platform's log collector parse it.
//
// For human-readable output in dev, pipe the process through pino-pretty:
//   pnpm dev | pino-pretty

import { pino } from "pino";
import type { Bindings, Logger } from "pino";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Shared application logger. Level resolves from `LOG_LEVEL`, falling back to
 * `info` in production and `debug` everywhere else. Zero-config: works with no
 * env vars set.
 */
export const logger: Logger = pino({
  level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
});

/**
 * Create a request-scoped child logger with fixed bindings (e.g. a requestId,
 * route, or userId) merged into every line it emits.
 */
export function createLogger(bindings: Bindings): Logger {
  return logger.child(bindings);
}

export type { Bindings, Logger } from "pino";
