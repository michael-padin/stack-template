"use client";

import { useEffect } from "react";

import { Button } from "@repo/ui/components/button";

export default function WebError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Digest only — avoids leaking error internals to the client.
    if (error.digest) console.error("[web] route error digest:", error.digest);
  }, [error]);

  return (
    <main className="bg-background relative flex min-h-svh items-center justify-center overflow-hidden px-6">
      <div className="relative max-w-lg space-y-5">
        <p className="text-destructive text-[0.68rem] tracking-[0.22em] uppercase">
          Something went wrong
        </p>
        <h1 className="display text-foreground text-4xl leading-tight tracking-tight">
          This page didn&rsquo;t load.
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Try again in a moment. If it keeps failing, the service might be down for a brief refresh.
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
