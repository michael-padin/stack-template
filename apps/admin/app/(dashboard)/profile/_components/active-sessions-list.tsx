"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LaptopIcon, SmartphoneIcon, TabletIcon } from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";

import { revokeMySessionAction } from "../_actions";

export interface SessionRow {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  isCurrent: boolean;
}

interface ActiveSessionsListProps {
  sessions: SessionRow[];
}

export function ActiveSessionsList({ sessions }: ActiveSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">No active sessions found.</p>
    );
  }

  return (
    <ul className="divide-border/60 divide-y">
      {sessions.map((session) => (
        <SessionItem key={session.id} session={session} />
      ))}
    </ul>
  );
}

function SessionItem({ session }: { session: SessionRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const parsed = parseUserAgent(session.userAgent);
  const Icon = parsed.deviceIcon;

  function revoke() {
    startTransition(async () => {
      try {
        await revokeMySessionAction(session.token);
        toast.success("Session signed out.");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't sign out");
      }
    });
  }

  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="bg-muted/60 grid size-9 shrink-0 place-items-center rounded-md">
        <Icon size={16} className="text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">
            {parsed.browser} · {parsed.os}
          </p>
          {session.isCurrent ? (
            <Badge variant="secondary" className="text-[10px]">
              This device
            </Badge>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">
          {session.ipAddress ?? "Unknown IP"} · last seen {formatRelative(session.updatedAt)}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={revoke}
        disabled={pending || session.isCurrent}
        title={
          session.isCurrent ? "Use the menu's Sign out to end this session" : "Sign this device out"
        }
      >
        {pending ? <Spinner className="size-3.5" /> : null}
        Sign out
      </Button>
    </li>
  );
}

// Lightweight UA parsing — good enough for "Chrome on macOS". Avoids pulling
// in ua-parser-js for ~70 KB worth of regex tables we don't need.
function parseUserAgent(ua: string | null): {
  browser: string;
  os: string;
  deviceIcon: typeof LaptopIcon;
} {
  if (!ua) return { browser: "Unknown browser", os: "Unknown OS", deviceIcon: LaptopIcon };
  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";

  let os = "Unknown OS";
  let deviceIcon: typeof LaptopIcon = LaptopIcon;
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) {
    os = "Android";
    deviceIcon = SmartphoneIcon;
  } else if (/iPhone|iPod/.test(ua)) {
    os = "iOS";
    deviceIcon = SmartphoneIcon;
  } else if (/iPad/.test(ua)) {
    os = "iPadOS";
    deviceIcon = TabletIcon;
  } else if (/Linux/.test(ua)) os = "Linux";

  return { browser, os, deviceIcon };
}

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
