import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

const STAT_KEYS = ["stat-1", "stat-2", "stat-3"] as const;
const ROW_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"] as const;

export default function OverviewLoading() {
  return (
    <>
      <header className="border-border/60 border-b">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-9 w-56" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8">
        <section>
          <Skeleton className="h-9 w-72" />
          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {STAT_KEYS.map((key) => (
              <div key={key} className="grid gap-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="grid min-w-0 flex-1 gap-1.5">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>

          <ul className="divide-border/60 mt-6 divide-y overflow-hidden rounded-xl border">
            {ROW_KEYS.map((key) => (
              <li
                key={key}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3"
              >
                <Skeleton className="size-2 rounded-full" />
                <div className="grid gap-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="size-4" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
