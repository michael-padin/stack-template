export const DEFAULT_PAGE_SIZE = 15;
export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50] as const;

/**
 * Clamps `page` to `[1, pageCount]` and returns `[start, end)` slice indices.
 */
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    page: safePage,
    pageCount,
    total,
  };
}

/** Validates a raw `?per_page=` value against the allowed options. */
export function resolvePageSize(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if ((PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)) {
    return parsed;
  }
  return DEFAULT_PAGE_SIZE;
}
