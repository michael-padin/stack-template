export default function ForbiddenPage() {
  return (
    <main className="grid min-h-svh place-items-center px-4">
      <div className="text-center">
        <p className="text-muted-foreground text-[0.68rem] tracking-[0.22em] uppercase">403</p>
        <h1 className="display mt-2 text-4xl">Not enough access.</h1>
        <p className="text-muted-foreground mt-3 max-w-md text-sm">
          Your account is signed in but doesn&apos;t have a role that can manage the registry. Ask
          an admin to upgrade your role.
        </p>
      </div>
    </main>
  );
}
