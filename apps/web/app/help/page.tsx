import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { APP_NAME } from "@repo/env/client";
import { STATUS_DESCRIPTIONS, type ItemStatus } from "@repo/types";
import { Separator } from "@repo/ui/components/separator";

import { StatusBadge } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "About",
  description: `What ${APP_NAME} is and how the catalog works.`,
};

const STATUSES: ItemStatus[] = ["active", "draft", "archived"];

export default function HelpPage() {
  return (
    <main className="bg-background min-h-svh">
      <header className="border-border/60 border-b px-6 py-3 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-[0.68rem] tracking-[0.22em] uppercase transition-colors"
          >
            <ArrowLeftIcon size={14} aria-hidden="true" />
            Back to items
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
        <p className="text-muted-foreground text-[0.68rem] tracking-[0.22em] uppercase">About</p>
        <h1 className="display mt-2 text-3xl leading-tight sm:text-4xl">{APP_NAME}</h1>
        <p className="text-muted-foreground mt-4 max-w-prose text-lg leading-relaxed">
          {APP_NAME} is a starter template for internal tools. The public view lists items from a
          shared database — search by title, filter by status, sort, and open any record for the
          full detail.
        </p>

        <Separator className="my-10" />

        <h2 className="display text-xl leading-tight">What the statuses mean</h2>
        <ul className="mt-5 grid gap-3">
          {STATUSES.map((status) => (
            <li key={status} className="flex items-start gap-3">
              <StatusBadge status={status} />
              <p className="text-muted-foreground text-sm">{STATUS_DESCRIPTIONS[status]}</p>
            </li>
          ))}
        </ul>

        <Separator className="my-10" />

        <h2 className="display text-xl leading-tight">Make it yours</h2>
        <p className="text-muted-foreground mt-4 max-w-prose text-base leading-relaxed">
          Replace the <code className="font-mono text-sm">Item</code> model with your real domain,
          reseed the database, and set <code className="font-mono text-sm">APP_NAME</code> to your
          project. The public app reads everything from{" "}
          <code className="font-mono text-sm">@repo/db</code> and falls back to seed data when no
          database is configured.
        </p>
      </article>
    </main>
  );
}
