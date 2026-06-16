# scripts

## `rename-template.ts`

Turns this neutral starter template into a new project in one pass: rewrites the
package scope `@repo` → `@<scope>`, the root workspace name
`internal-stack-template` → `<slug>`, and the `NEXT_PUBLIC_APP_NAME` default
(`"Internal Tools"` in `packages/env/src/client.ts`) → your display name.

```bash
pnpm rename                                   # interactive prompts
pnpm rename @acme acme-tools "Acme Tools"     # from CLI args
pnpm rename @acme acme-tools "Acme Tools" --yes      # skip confirmation
pnpm rename @acme acme-tools "Acme Tools" --install  # + run `pnpm install`
```

It is idempotent (re-running with the same scope is a no-op), reports how many
files changed, and **never touches `pnpm-lock.yaml`** — run `pnpm install`
afterward to regenerate it. Node built-ins only; needs `tsx`. A post-rename
checklist (auth secret, `DATABASE_URL`, migrate/seed/dev) prints when it's done.
