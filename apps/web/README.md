# @repo/web — Public app

Next.js 16 app, port 3000. The public-facing surface: a read-only,
server-rendered list of the example `Item` resource with URL-driven
search/filter/sort.

## What lives here

```
apps/web/
├── app/
│   ├── api/
│   │   └── revalidate/route.ts  Tag-based ISR revalidation (secret-gated)
│   ├── items/
│   │   └── [id]/page.tsx        Item detail page (the list is app/page.tsx)
│   ├── help/page.tsx            About / help page
│   ├── globals.css              Imports @repo/ui/styles.css
│   ├── layout.tsx               Loads the next/font families
│   ├── page.tsx                 Items list + filter bar (the home page)
│   ├── icon.tsx                 Favicon (ImageResponse)
│   ├── opengraph-image.tsx      OG image
│   ├── error.tsx / not-found.tsx / loading.tsx
│   └── ...
├── components/
│   ├── brand-mark.tsx           Abstract SVG brand glyph
│   └── status-badge.tsx         Item status pill (uses @repo/types labels)
├── lib/
│   ├── db.ts                    Data accessor with seed-data fallback + caching
│   └── rate-limit.ts            Simple in-memory limiter for the API route
├── proxy.ts                     Optimistic, cookie-only auth check
└── public/                      Static assets
```

The home page (`app/page.tsx`) renders the catalog. Each card links to
`app/items/[id]/page.tsx`. UI primitives come from `@repo/ui`; the display
name comes from `NEXT_PUBLIC_APP_NAME` (via `@repo/env/client`).

## Run it

```bash
# From repo root:
pnpm dev:web

# Or just:
pnpm --filter @repo/web dev
```

## Dev mode without a database

If `DATABASE_URL` is unset, `lib/db.ts` falls back to the example dataset in
`@repo/db/seed-data` (`fallbackItems()`), applying the same search/status/sort
semantics in memory. So the public app boots and demos with zero database
setup. (Auth-protected routes still need the DB, but this app has none.)

## URL state

Filters and sort are plain URL search params — no client state library. The
list page is a Server Component that parses them with `itemFilterSchema` from
`@repo/types` and the filter bar is a no-JS GET `<form>`:

```
/?search=draft&status=active&sort=title
```

This means a shared link reproduces the exact view. To add a new filter:
extend `itemFilterSchema` in `@repo/types`, then read the new field in
`fetchItems` (`lib/db.ts`) and add a control to the filter bar in `page.tsx`.

## Cache invalidation

`lib/db.ts` tags cached reads (`PUBLIC_ITEMS_TAG` and a per-detail
`item:<id>` tag). The admin app POSTs those tags to
`app/api/revalidate/route.ts` (secret-gated) after a write so the public
pages refresh.
