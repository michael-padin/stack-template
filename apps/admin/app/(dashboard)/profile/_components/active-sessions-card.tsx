import { headers } from "next/headers";
import { ShieldCheckIcon } from "lucide-react";

import { auth } from "@repo/auth/server";

import { Card } from "@repo/ui/components/card";

import { ActiveSessionsList, type SessionRow } from "./active-sessions-list";

/**
 * Async server component — wrapped in <Suspense> by the page so the rest
 * of the profile (header + form) renders without waiting on the session
 * lookup. The query goes through Better Auth which round-trips to Neon.
 */
export async function ActiveSessionsCard() {
  const reqHeaders = await headers();
  // listSessions returns ALL active sessions for the *currently* authenticated
  // user — no userId argument needed, the API resolves the caller from cookies.
  const sessions = await auth.api.listSessions({ headers: reqHeaders });

  // Identify which row corresponds to "this device" by matching against the
  // current session token. Better Auth doesn't expose isCurrent directly.
  const current = await auth.api.getSession({ headers: reqHeaders });
  const currentToken = current?.session.token ?? null;

  const rows: SessionRow[] = sessions.map((s) => ({
    id: s.id,
    token: s.token,
    createdAt: new Date(s.createdAt).toISOString(),
    updatedAt: new Date(s.updatedAt).toISOString(),
    expiresAt: new Date(s.expiresAt).toISOString(),
    ipAddress: s.ipAddress ?? null,
    userAgent: s.userAgent ?? null,
    isCurrent: s.token === currentToken,
  }));

  return (
    <Card className="p-5 sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <ShieldCheckIcon size={16} aria-hidden="true" className="text-muted-foreground" />
        <h2 className="text-sm font-semibold">Active sessions</h2>
      </header>
      <ActiveSessionsList sessions={rows} />
    </Card>
  );
}

export function ActiveSessionsCardSkeleton() {
  return (
    <Card className="p-5 sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <ShieldCheckIcon size={16} aria-hidden="true" className="text-muted-foreground" />
        <h2 className="text-sm font-semibold">Active sessions</h2>
      </header>
      <ul className="divide-border/60 divide-y">
        {SKELETON_ROW_KEYS.map((key) => (
          <li key={key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="bg-muted/60 size-9 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="bg-muted/60 h-3.5 w-40 rounded" />
              <div className="bg-muted/40 h-3 w-56 rounded" />
            </div>
            <div className="bg-muted/40 h-7 w-16 shrink-0 rounded-md" />
          </li>
        ))}
      </ul>
    </Card>
  );
}

const SKELETON_ROW_KEYS = ["sk-1", "sk-2"] as const;
