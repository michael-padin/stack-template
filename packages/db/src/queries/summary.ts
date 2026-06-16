import type { ItemStatus } from "@repo/types";

import { prisma } from "../client";

export interface AdminSummary {
  total: number;
  byStatus: Record<ItemStatus, number>;
}

/**
 * Dashboard aggregates — collapses the per-status counts into one grouped
 * query. Cached in the admin app via `unstable_cache` (see lib/cached-data.ts).
 */
export async function getAdminSummary(): Promise<AdminSummary> {
  const grouped = await prisma.item.groupBy({
    by: ["status"],
    where: { deletedAt: null },
    _count: { _all: true },
  });

  const byStatus: Record<ItemStatus, number> = { draft: 0, active: 0, archived: 0 };
  let total = 0;
  for (const group of grouped) {
    byStatus[group.status] = group._count._all;
    total += group._count._all;
  }

  return { total, byStatus };
}
