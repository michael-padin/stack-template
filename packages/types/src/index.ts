import { z } from "zod";

// ── Enums ─────────────────────────────────────────────────────────────────
export const itemStatusSchema = z.enum(["draft", "active", "archived"]);
export const appRoleSchema = z.enum(["admin"]);

// ── Item (the example resource) ───────────────────────────────────────────
// Serialized shape returned to the apps. Dates are ISO strings so the payload
// crosses the server/client boundary without Date-instance hydration issues.
export const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: itemStatusSchema,
  ownerId: z.string().nullable(),
  ownerName: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Input shape for create/edit — validated in server actions and API routes.
export const itemInputSchema = z.object({
  title: z.string().min(2, "Title is required.").max(200, "Title is too long."),
  description: z.string().max(2000, "Description is too long.").nullable().optional(),
  status: itemStatusSchema.default("draft"),
});

// Filter/sort state — parsed from URL search params (see finder-state pattern).
export const itemFilterSchema = z.object({
  search: z.string().default(""),
  status: itemStatusSchema.or(z.literal("all")).default("all"),
  sort: z.enum(["recent", "title"]).default("recent"),
});

// Generic pagination query, reused across every admin list.
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ItemStatus = z.infer<typeof itemStatusSchema>;
export type AppRole = z.infer<typeof appRoleSchema>;
export type Item = z.infer<typeof itemSchema>;
export type ItemInput = z.infer<typeof itemInputSchema>;
export type ItemFilters = z.infer<typeof itemFilterSchema>;
export type PageQuery = z.infer<typeof pageQuerySchema>;

/** Envelope for any paginated list. */
export interface Paginated<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

// ── Presentation helpers — single source of truth for labels and UI tone. ──
export const STATUS_LABELS: Record<ItemStatus, string> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
};

export const STATUS_DESCRIPTIONS: Record<ItemStatus, string> = {
  draft: "Not yet published.",
  active: "Live and visible to users.",
  archived: "Retired from active use.",
};
