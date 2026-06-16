# @repo/types

Single source of truth for domain Zod schemas + TypeScript types. Both apps
and other packages re-export from here.

## Why a dedicated package?

If `apps/web` defines `Item` and `apps/admin` defines its own, they will
drift. Putting the schemas in a shared package means a Zod validation in
apps/web is automatically the same Zod validation in apps/admin and in
`@repo/db` query helpers.

## Exports

```ts
import {
  // Enums
  itemStatusSchema,
  appRoleSchema,

  // Record (the serialized Item shape sent to the apps)
  itemSchema,

  // Inputs
  itemInputSchema, // create/edit payload
  itemFilterSchema, // filter/sort state parsed from URL search params
  pageQuerySchema, // generic pagination query, reused across admin lists

  // Types
  type ItemStatus,
  type AppRole,
  type Item,
  type ItemInput,
  type ItemFilters,
  type PageQuery,
  type Paginated, // envelope for any paginated list

  // Presentation helpers — single source of truth for labels/copy
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
} from "@repo/types";
```

## When to add a schema

Add it here if:

- Two or more packages/apps will use the same shape
- It corresponds to an entity in `@repo/db`
- It's an input to a public API endpoint

Don't add it here if:

- It's a UI-only props type (keep it next to the component)
- It's a private internal shape used by one function

## Validation pattern

```ts
import { itemInputSchema } from "@repo/types";

const parsed = itemInputSchema.safeParse(payload);
if (!parsed.success) {
  return Response.json(
    { error: "Invalid payload", issues: parsed.error.flatten() },
    { status: 400 },
  );
}
// parsed.data is fully typed
```

Filter/list inputs follow the same pattern — `apps/web/app/page.tsx` parses
the URL search params straight through `itemFilterSchema.parse(...)`.

## Versioning

This package is unversioned (always `workspace:*`). Breaking changes
propagate immediately to consumers. If a downstream system depends on a
stable wire format, add a separate `@repo/api-contracts` package with
versioned shapes.
