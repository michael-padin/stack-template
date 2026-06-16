import { defineConfig, devices } from "@playwright/test";

// End-to-end suite for the public web app (apps/web). The webServer below
// starts `@repo/web` WITHOUT a DATABASE_URL, so the app serves the seed-data
// fallback (see apps/web/lib/db.ts → @repo/db/seed-data). Zero database setup
// required — the same property that lets the template demo out of the box.
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm --filter @repo/web dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // No DATABASE_URL → app falls back to @repo/db/seed-data.
    env: {
      NEXT_PUBLIC_APP_NAME: "Internal Tools",
    },
  },
});
