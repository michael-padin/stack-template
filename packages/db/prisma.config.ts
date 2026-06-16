import { defineConfig, env } from "prisma/config";

// Env vars are loaded by `pnpm with-env` (dotenv-cli) before this file is
// evaluated, so process.env is already populated. App-side validation lives
// in @repo/env/db.
export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: { path: "./prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
