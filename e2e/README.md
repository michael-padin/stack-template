# End-to-end tests

Playwright specs for the public web app (`@repo/web`), run against the seed-data
fallback — no database needed. The config's `webServer` starts the app for you.

```bash
pnpm exec playwright install   # one-time: download browsers
pnpm test:e2e                  # runs e2e/*.spec.ts (auto-starts @repo/web on :3000)
```
