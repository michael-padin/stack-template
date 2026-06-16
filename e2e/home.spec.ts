import { test, expect } from "@playwright/test";

// Smoke test against the public web app running on the seed-data fallback
// (no DATABASE_URL — see playwright.config.ts webServer). The home page lists
// the seeded example items from @repo/db/seed-data.

test("home page lists a seeded example item", async ({ page }) => {
  await page.goto("/");

  // "Welcome to your internal tool" is the first seeded item (status: active).
  await expect(page.getByText("Welcome to your internal tool").first()).toBeVisible();
});

test("home page renders the catalog heading", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Browse the catalog" })).toBeVisible();
});
