"use client";

import { useEffect } from "react";

import { Button } from "@repo/ui/components/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log only the digest — Next sends the full error to the server-side
    // reporter via this id, and we don't want to leak stack frames or
    // SQL text into the client console.
    if (error.digest) console.error("[admin] route error digest:", error.digest);
  }, [error]);

  return (
    <main className="bg-background flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md space-y-4">
        <p className="text-destructive text-xs tracking-wide uppercase">Error</p>
        <h1 className="text-2xl leading-tight font-semibold">Something went wrong on this page</h1>
        <p className="text-muted-foreground text-sm">
          The admin couldn&rsquo;t load this view. Try again or refresh the page; if it keeps
          failing, the database or session may be the cause.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground font-mono text-xs">ref: {error.digest}</p>
        ) : null}
        <Button type="button" variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
