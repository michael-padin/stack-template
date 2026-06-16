import { Skeleton } from "@repo/ui/components/skeleton";

export default function UsersLoading() {
  return (
    <>
      <header className="border-border/60 border-b">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-6">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-5 w-48 sm:h-6" />
            <Skeleton className="h-3 w-72 max-w-full" />
          </div>
          <Skeleton className="h-9 w-20 sm:w-32" />
        </div>
      </header>
    </>
  );
}
