import Link from "next/link";

import { buttonVariants } from "@repo/ui/components/button";

export default function NotFound() {
  return (
    <main className="bg-background flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md space-y-4">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">404</p>
        <h1 className="text-2xl leading-tight font-semibold">Not found</h1>
        <p className="text-muted-foreground text-sm">
          The page you were looking for isn&rsquo;t here. It may have been moved or the link is out
          of date.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Back to overview
        </Link>
      </div>
    </main>
  );
}
