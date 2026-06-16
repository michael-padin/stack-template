# @repo/ui

Shared design tokens, global styles, and (eventually) cross-app components.

For the conceptual design system (color philosophy, typography, anti-patterns),
see [docs/06-design-system.md](../../docs/06-design-system.md).

## Exports

```ts
// Class-merging helper
import { cn } from "@repo/ui";

// Stylesheets (imported once at the app root)
import "@repo/ui/styles.css"; // imports tokens + globals

// Shared components (shadcn primitives + a couple of composed ones)
import { DataTable } from "@repo/ui/components/data-table"; // TanStack Table wrapper
import { Form } from "@repo/ui/components/form"; // react-hook-form bindings
```

## Token files

`src/styles/tokens.css` — color, font, radius CSS variables (light + dark).

`src/styles/globals.css` — imports tokens, maps them via Tailwind 4's
`@theme inline`, and ships base styles: typography, and the semantic status
tokens (`success` / `warning` / `muted`) used by status pills and dots.

## How to consume

In each app's `globals.css`:

```css
@import "@repo/ui/styles.css";
```

Then in the app's `layout.tsx`:

```tsx
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontDisplay = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

<html className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
```

The token CSS reads `var(--font-sans)` etc., so the next/font CSS variables
flow through into Tailwind's font utilities.

## Promoting a component

When a component is identical between `apps/web` and `apps/admin`:

1. Move it to `packages/ui/src/components/<name>.tsx`
2. The `exports` map already wildcards the components directory:
   ```json
   "./components/*": "./src/components/*.tsx"
   ```
   so a new file is importable as `@repo/ui/components/<name>` immediately.
3. Update both apps' imports to use `@repo/ui/components/<name>`
4. Delete the duplicates

The components directory already holds the shared shadcn primitives plus a
couple of composed ones worth knowing about:

- `data-table` — a TanStack Table wrapper used by the admin lists
- `form` — react-hook-form bindings + field primitives
- Status pills / dots — driven by the `success` / `warning` / `muted`
  semantic tokens, used in both apps

## Why so few components are shared right now

The migration prioritized structural correctness — packages, auth, db,
seeding — over component deduplication. Each app has its own copy of the
shadcn primitives so the shape was preserved.

The next refactor pass should:

1. Identify components used identically in both apps
2. Promote them to `@repo/ui/components/`
3. Keep app-specific variants in the app
