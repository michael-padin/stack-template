import type { AuditLog, AuditLogFilters, PageQuery, Paginated } from "@repo/types";

import { Prisma } from "../../generated/client";
import { prisma } from "../client";

// Stable column set — keeps the serialized shape in one place.
const auditSelect = {
  id: true,
  actorId: true,
  actorEmail: true,
  action: true,
  entity: true,
  entityId: true,
  summary: true,
  metadata: true,
  before: true,
  after: true,
  ipAddress: true,
  createdAt: true,
} satisfies Prisma.AuditLogSelect;

type AuditRow = Prisma.AuditLogGetPayload<{ select: typeof auditSelect }>;

// Prisma serializes JSON columns as `Prisma.JsonValue`; surface it as `unknown`
// at the boundary so callers narrow before use (never `any`).
function serialize(row: AuditRow): AuditLog {
  return {
    id: row.id,
    actorId: row.actorId,
    actorEmail: row.actorEmail,
    action: row.action,
    entity: row.entity,
    entityId: row.entityId,
    summary: row.summary,
    metadata: (row.metadata ?? null) as unknown,
    before: (row.before ?? null) as unknown,
    after: (row.after ?? null) as unknown,
    ipAddress: row.ipAddress,
    createdAt: row.createdAt.toISOString(),
  };
}

// Input for recording an audit entry. JSON fields accept any serializable value.
export interface RecordAuditInput {
  action: string;
  entity: string;
  actorId?: string | null;
  actorEmail?: string | null;
  entityId?: string | null;
  summary?: string | null;
  metadata?: Prisma.InputJsonValue | null;
  before?: Prisma.InputJsonValue | null;
  after?: Prisma.InputJsonValue | null;
  ipAddress?: string | null;
}

// `null` is distinct from "absent" for JSON columns in Prisma — use DbNull so
// the column is written as SQL NULL rather than JSON `null`.
function toJsonInput(
  value: Prisma.InputJsonValue | null | undefined,
): Prisma.InputJsonValue | typeof Prisma.DbNull {
  return value === null || value === undefined ? Prisma.DbNull : value;
}

/** Append an audit-log entry. Fire-and-forget from Server Actions. */
export async function recordAudit(input: RecordAuditInput): Promise<{ id: string }> {
  const created = await prisma.auditLog.create({
    data: {
      action: input.action,
      entity: input.entity,
      actorId: input.actorId ?? null,
      actorEmail: input.actorEmail ?? null,
      entityId: input.entityId ?? null,
      summary: input.summary ?? null,
      ipAddress: input.ipAddress ?? null,
      metadata: toJsonInput(input.metadata),
      before: toJsonInput(input.before),
      after: toJsonInput(input.after),
    },
    select: { id: true },
  });
  return created;
}

function buildWhere(filters: Partial<AuditLogFilters>): Prisma.AuditLogWhereInput {
  return {
    ...(filters.entity ? { entity: filters.entity } : {}),
    ...(filters.action ? { action: filters.action } : {}),
    ...(filters.actorId ? { actorId: filters.actorId } : {}),
    ...(filters.search
      ? {
          OR: [
            { summary: { contains: filters.search, mode: "insensitive" } },
            { actorEmail: { contains: filters.search, mode: "insensitive" } },
            { entityId: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

/** Admin list reads — paginated, newest first. */
export async function listAuditLogs(
  filters: Partial<AuditLogFilters>,
  page: PageQuery,
): Promise<Paginated<AuditLog>> {
  const where = buildWhere(filters);
  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: auditSelect,
      skip: (page.page - 1) * page.pageSize,
      take: page.pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);
  return {
    rows: rows.map(serialize),
    total,
    page: page.page,
    pageSize: page.pageSize,
    pageCount: Math.max(1, Math.ceil(total / page.pageSize)),
  };
}
