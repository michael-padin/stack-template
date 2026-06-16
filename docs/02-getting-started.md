# Getting started

This guide takes you from a fresh `git clone` to two running apps with example
data in a local Postgres.

> Starting a real project? Read the [Starter guide](./00-starter-guide.md)
> first — it covers renaming the scope and display name. This page is about
> running the template as it ships.

## Prerequisites

- **Node.js ≥ 24** — `node --version` (an `.nvmrc` pins the exact version)
- **pnpm 9.15** — `corepack enable` or `npm i -g pnpm@9.15.0`
- **Docker** _(recommended)_ — for local Postgres via `docker-compose.yml`.
  Any Postgres (Neon, Supabase, RDS, …) works too.

## 1. Install

```bash
pnpm install
```

This installs all workspaces and links the `@repo/*` packages — they're
importable with no build step. It also installs the lefthook git hooks.

## 2. Start a database (optional for the web app)

The public web app runs **without** a database — it falls back to the example
dataset (`@repo/db/seed-data`). The admin dashboard and any real DB read need
one. Spin up local Postgres with Docker:

```bash
docker compose up -d db
```

This starts `postgres:16` on `localhost:5432` with database `app`, matching the
default `DATABASE_URL` in the `.env.example` files:

```
postgresql://postgres:postgres@localhost:5432/app?schema=public
```

> Prefer a hosted database? Use your provider's connection string instead. The
> Prisma client uses `@prisma/adapter-pg` (node-postgres), which speaks to any
> standard Postgres.

## 3. Configure environment

Each context loads its own env file. Copy the templates:

```bash
cp apps/web/.env.example     apps/web/.env.local
cp apps/admin/.env.example   apps/admin/.env.local
cp packages/db/.env.example  packages/db/.env.local
```

Then fill in the values. The most important keys:

### `apps/admin/.env.local`

```dotenv
# Required — admin reads the DB and stores sessions there.
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public

# Better Auth secret — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=<32+ random bytes>
BETTER_AUTH_URL=http://localhost:3001

# Optional: Google sign-in (both must be set to enable the button)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### `apps/web/.env.local`

```dotenv
# Optional here — unset = falls back to the example dataset.
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public

NEXT_PUBLIC_APP_NAME=Internal Tools
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### `packages/db/.env.local`

```dotenv
# Used by the Prisma CLI (generate / migrate / seed) via dotenv-cli.
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public
```

> Env values are read through `@repo/env/*` (`@t3-oss/env-core` +
> `@t3-oss/env-nextjs`) and validated against a Zod schema at boot. The modules
> are per-concern: `@repo/env/db`, `@repo/env/auth`, `@repo/env/client` (the
> `NEXT_PUBLIC_*` one), `@repo/env/storage`, `@repo/env/revalidate`. Don't read
> `process.env.*` directly.

The full variable reference is the root [`.env.example`](../.env.example).

## 4. Set up the database

You only need this once (or after a schema change):

```bash
# 4a. Generate the Prisma Client from packages/db/prisma/schema.prisma
pnpm db:generate

# 4b. Apply migrations — creates all tables, enums, and indexes.
pnpm db:migrate          # prisma migrate deploy

# 4c. Seed example Item rows (idempotent — re-runnable)
pnpm db:seed
```

## 5. Run the apps

```bash
pnpm dev          # both apps in parallel via Turborepo
pnpm dev:web      # public app only
pnpm dev:admin    # admin dashboard only
```

Open:

- Public app — http://localhost:3000
- Admin dashboard — http://localhost:3001

## 6. Create your first admin user

The admin dashboard requires the `admin` role. New sign-ups default to `admin`
(Better Auth `defaultRole`), so the only manual step is the first sign-up:

```
Open http://localhost:3001/sign-in → "Create one" → done. You're an admin.
```

If you ever need to promote an account by hand:

```bash
psql "$DATABASE_URL" -c "UPDATE \"user\" SET role = 'admin' WHERE email = 'you@example.com';"
# Sign out and back in to refresh the session.
```

## Common issues

### `Cannot find module '@repo/...'`

Run `pnpm install` again from the repo root. pnpm workspaces link the packages
on install; if you skipped it, the symlinks are missing.

### `relation "items" does not exist`

You haven't run `pnpm db:migrate` yet, or it failed. Re-run it and look for
errors. Confirm the database is reachable (`docker compose ps`).

### `Can't reach database server at localhost:5432`

The Docker container isn't running. Start it with `docker compose up -d db`, or
point `DATABASE_URL` at a database that is running.

### "Better Auth secret too short"

`BETTER_AUTH_SECRET` must be ≥ 32 bytes. Generate one with
`openssl rand -base64 32` and restart the dev server after editing `.env.local`.

### The public app shows example data even though I set `DATABASE_URL`

`DATABASE_URL` belongs in `apps/web/.env.local` for the web app to read it.
Restart the dev server after editing env files — Next.js loads them at boot.

## Next steps

- Read [Architecture](./01-architecture.md) for the big picture
- Read [Authentication](./04-authentication.md) before adding protected routes
- Read [Database](./03-database.md) before changing the schema
