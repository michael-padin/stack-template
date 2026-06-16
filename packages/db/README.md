# @repo/db

Prisma schema + queries + seed for the template. Runs on plain Postgres via
`@prisma/adapter-pg` (the node-postgres driver), so it works against local
Docker, Neon, Supabase, RDS, Railway — anything that speaks Postgres.

## Layout

```
prisma/
├── schema.prisma          # all models + enums in one file
└── migrations/
    └── 00000000000000_init/
        └── migration.sql  # initial schema (Better Auth tables + items)

src/
├── queries/               # Typed query helpers used by both apps
│   ├── items.ts           # Item CRUD + list/paginate (soft-delete aware)
│   └── summary.ts         # Dashboard status aggregates
├── seed/
│   ├── example-data.ts    # Canonical example Item dataset (+ DB-less fallback)
│   └── run.ts             # Idempotent seeder
├── client.ts              # Lazy Prisma singleton (Postgres adapter wired here)
└── index.ts
```

## Schema

Two groups of models live in `schema.prisma`:

- **Better Auth core tables** — `User`, `Session`, `Account`, `Verification`.
  Their `id`s are `text` (Better Auth generates its own) and the column names
  are the contract Better Auth's Prisma adapter expects, so keep them verbatim.
  `User` also carries the `admin` plugin fields (`role`, `banned`, …).
- **The example domain model** — `Item`. A deliberately generic resource that
  demonstrates the full CRUD pattern this template ships:
  - `title` / `description`
  - a `status` enum (`draft | active | archived`)
  - an `owner` relation back to `User`
  - soft-delete via `deletedAt`
  - `createdAt` / `updatedAt` timestamps

  Replace `Item` with your real model(s) when you build on the template.

The spatial/PostGIS variant (the `postgis` extension, `Unsupported()`
geometry columns, and `ST_*` raw-query conventions) lives on the separate
`feat/geo` branch — this base branch is plain Postgres with no spatial types.

## Typed raw queries

For anything Prisma's query builder can't express, use
`prisma.$queryRaw<Row[]>\`...\``with an explicit row-type generic. Tagged
template literals parameterize safely, so don't interpolate values by hand and
don't reach for`any`— declare the`Row`shape. This convention still applies
even without PostGIS (e.g. window functions, custom aggregates,`EXPLAIN`).

```ts
type StatusCount = { status: string; count: bigint };
const rows = await prisma.$queryRaw<StatusCount[]>`
  SELECT status, count(*) AS count
  FROM items
  WHERE deleted_at IS NULL
  GROUP BY status
`;
```

## Migrations

```bash
pnpm db:generate      # prisma generate
pnpm db:migrate       # prisma migrate deploy (production)
pnpm db:migrate:dev   # prisma migrate dev (authors a new migration)
pnpm db:push          # prisma db push (skip migrations — prototyping only)
pnpm db:seed          # tsx src/seed/run.ts (upserts the example items)
```

The seed (`src/seed/run.ts`) reads the canonical dataset from
`src/seed/example-data.ts` and is idempotent — there's no natural unique key
on `Item`, so it finds-or-updates by `title` and re-running never duplicates
rows. `example-data.ts` is also imported by `apps/web` as a DB-less fallback,
so the public app boots and demos with zero database setup.

## Provider notes

- **Local Docker** — point `DATABASE_URL` at the bundled `docker-compose.yml`
  Postgres and you're done; no extensions required.
- **Managed Postgres** (Neon / Supabase / RDS / Railway) — use the connection
  string from the dashboard, typically with `sslmode=require`.
- **Neon serverless / edge runtimes** — swap the adapter in `src/client.ts`
  from `@prisma/adapter-pg` to `@prisma/adapter-neon` for the WebSocket driver.
