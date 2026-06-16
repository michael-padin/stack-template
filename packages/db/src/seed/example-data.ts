import type { Item, ItemStatus } from "@repo/types";

// Canonical example dataset. Used two ways:
//  1. `pnpm db:seed` upserts these into Postgres (idempotent).
//  2. The public web app falls back to these when DATABASE_URL is unset, so
//     the template boots and demos with zero database setup.

export interface ExampleItemSeed {
  title: string;
  description: string;
  status: ItemStatus;
}

export const exampleItems: ExampleItemSeed[] = [
  {
    title: "Welcome to your internal tool",
    description:
      "This is a seeded example record. Replace the Item model with your real domain and reseed.",
    status: "active",
  },
  {
    title: "Draft record",
    description: "Items default to draft until you publish them.",
    status: "draft",
  },
  {
    title: "Archived record",
    description: "Archived items are hidden from the active list but retained.",
    status: "archived",
  },
];

/** Synthetic `Item[]` for the DB-less fallback in apps/web/lib/db.ts. */
export function fallbackItems(): Item[] {
  const now = new Date("2026-01-01T00:00:00.000Z").toISOString();
  return exampleItems.map((item, index) => ({
    id: `example-${index + 1}`,
    title: item.title,
    description: item.description,
    status: item.status,
    ownerId: null,
    ownerName: null,
    createdAt: now,
    updatedAt: now,
  }));
}
