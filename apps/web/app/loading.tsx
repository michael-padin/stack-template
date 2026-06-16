export default function Loading() {
  return (
    <main className="bg-background relative grid min-h-svh place-items-center">
      <div className="bg-survey-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative flex flex-col items-center gap-3">
        <span
          className="border-primary/30 border-t-primary inline-block size-6 animate-spin rounded-full border-2"
          aria-hidden="true"
        />
        <p className="text-muted-foreground text-[0.68rem] tracking-[0.22em] uppercase">Loading</p>
      </div>
    </main>
  );
}
