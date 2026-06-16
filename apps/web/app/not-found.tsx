import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@repo/ui/components/button";

export default function NotFound() {
  return (
    <main className="bg-background relative flex min-h-svh items-center justify-center overflow-hidden px-6">
      <div className="bg-survey-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative max-w-lg space-y-5">
        <p className="text-muted-foreground text-[0.68rem] tracking-[0.22em] uppercase">
          404 · not found
        </p>
        <h1 className="display text-foreground text-4xl leading-tight tracking-tight">
          We couldn&rsquo;t find that page.
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The link may be stale, or the page was retired. Head back to browse the catalog.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <ArrowLeftIcon size={14} aria-hidden="true" />
          Back to items
        </Link>
      </div>
    </main>
  );
}
