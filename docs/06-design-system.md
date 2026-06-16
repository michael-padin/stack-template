# Design system

The visual baseline is a clean, neutral shadcn theme on an **amber** accent —
deliberately understated so you can re-skin it for your product by editing
tokens, not components.

This document covers the tokens, typography, components, and the rules for
keeping things consistent.

## Token philosophy

**Three rules:**

1. **No literal colors in components.** If you write `text-amber-500`, you've
   broken the system. Use `text-primary`, `text-status-success`, etc.
2. **All tokens are oklch.** Perceptual uniformity means lightness is actually
   lightness, and `color-mix(in oklab, …)` produces predictable results.
3. **Status tones are semantic, not decorative.** `--status-success` means
   "good / live", not "green". Map your domain statuses onto the three tones;
   don't hardcode hues.

## Color tokens

Tokens are defined in `packages/ui/src/styles/globals.css` under `:root` and
`.dark`, and mapped to Tailwind utility classes via `@theme inline` in the same
file. Each app imports them through `@repo/ui/styles.css`.

### Surface

| Token                                | Use                 |
| ------------------------------------ | ------------------- |
| `--background` / `--foreground`      | Page bg / body text |
| `--card` / `--card-foreground`       | Elevated surfaces   |
| `--popover` / `--popover-foreground` | Floating UI         |

### Primary (amber)

| Token                  | Use                                      |
| ---------------------- | ---------------------------------------- |
| `--primary`            | Buttons, links, active states            |
| `--primary-foreground` | Text on `--primary` surfaces             |
| `--primary-soft`       | Subtle backgrounds (chips, tags, hovers) |
| `--primary-strong`     | Hover / pressed primary buttons          |

### Secondary / muted / accent

| Token                                    | Use                                 |
| ---------------------------------------- | ----------------------------------- |
| `--secondary` / `--secondary-foreground` | Light filler surfaces               |
| `--muted` / `--muted-foreground`         | Disabled / meta; captions, metadata |
| `--accent` / `--accent-foreground`       | Hovered list rows                   |
| `--accent-blue`                          | Selection / focus accent            |
| `--destructive`                          | Dangerous actions                   |
| `--border` / `--input` / `--ring`        | Hairlines, inputs, focus rings      |

### Status tones (semantic)

Three functional tones, each with a base color and a `*-soft` background:

| Token                                        | Tone    | Maps to (example `Item`) |
| -------------------------------------------- | ------- | ------------------------ |
| `--status-success` / `--status-success-soft` | success | `active`                 |
| `--status-warning` / `--status-warning-soft` | warning | `draft`                  |
| `--status-muted` / `--status-muted-soft`     | muted   | `archived`               |

Tailwind classes: `bg-status-success-soft`, `text-status-warning`,
`bg-status-muted-soft`, etc. The mapping from a domain status to a tone lives in
one place per app:

- `apps/web/components/status-badge.tsx` — `StatusBadge` (a shadcn `Badge`)
- `apps/admin/components/status-pill.tsx` — `StatusPill` (pill + colored dot)

When you replace `Item`, repoint the `Record<YourStatus, Tone>` map in those two
components and you're done — nothing else hardcodes a status color.

### Sidebar & charts

A separate `--sidebar-*` scale for the admin navigation, and `--chart-1`
through `--chart-5` (amber-toned, chosen to stay distinguishable).

## Typography

Two font families, loaded via `next/font/google` in each app's `layout.tsx`:

| CSS variable  | Family            | Use                      |
| ------------- | ----------------- | ------------------------ |
| `--font-sans` | **IBM Plex Sans** | All UI text              |
| `--font-mono` | **IBM Plex Mono** | Code, IDs, kbd, numerals |

`--font-heading` is aliased to `--font-sans`. To add a display face, load it in
the layout, expose it as a CSS variable, and map it in `@theme inline` — don't
inline a `font-family` in a component.

### Display headings

The `.display` class (in `globals.css`) applies a heavier weight and tighter
tracking:

```html
<h1 class="display text-4xl">Dashboard</h1>
```

### Tabular numerals

`.coord`, `.font-mono`, `code`, `kbd`, `samp`, and `pre` get tabular figures and
slashed zeros (`font-variant-numeric: tabular-nums slashed-zero`) so numbers and
IDs line up in columns.

## Layout primitives

### Status dot

```html
<span class="status-dot status-dot--success"></span>
<span class="status-dot status-dot--warning"></span>
<span class="status-dot status-dot--muted"></span>
```

A small colored circle for lists, meta rows, and pills (used by `StatusPill`).

### Grid background

```html
<div class="bg-survey-grid">...</div>
```

A subtle 24×24px hairline grid. Use sparingly — usually as a hero / sign-in
backdrop.

## Components

Shared shadcn components live in **`packages/ui/src/components/`** and are
imported with the package path:

```tsx
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
```

Each one is registered in the `exports` map of `packages/ui/package.json`
(`"./components/*": "./src/components/*.tsx"`). App-specific components live
under each app's `components/` directory.

### Adding shadcn components

Each app has a `components.json`. Generate from inside an app, or add to
`packages/ui` if both apps will use it:

```bash
cd apps/web
pnpm dlx shadcn@latest add dialog
```

After generating, **rewrite literal colors to tokens** (`bg-primary`, not
`bg-amber-500`) before merging. If a component is used in both apps, move it to
`packages/ui/src/components/` and add it to the `exports` map.

### Component-naming rules

- **PascalCase** for components: `<StatusBadge>`, `<AdminShell>`
- **kebab-case** for files: `status-badge.tsx`, `admin-shell.tsx`
- **Shared primitives** in `packages/ui/src/components/*`
- **App-specific components** in the app's own `components/*`

## Spacing & radius

Default Tailwind spacing scale. The radius scale derives from a single
`--radius` (`0.625rem`) — `--radius-sm/md/lg/xl/2xl/3xl/4xl` are computed
multiples in `@theme inline`. Use the named utilities (`rounded-md`,
`rounded-lg`), not ad-hoc pixel values.

## Dark mode

Both apps ship `.dark` tokens. `next-themes` is wired in the providers — toggle
the `dark` class on `<html>`:

```tsx
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
```

The admin app ships a `<ModeToggle>` component.

## Iconography

**Lucide React** for all icons (SVG, tree-shaken, consistent). Don't mix in
Heroicons or Material Icons.

## Anti-patterns

### Don't use color literals

```tsx
// ❌ Wrong
<div className="bg-amber-500 text-white">...</div>
// ✅ Right
<div className="bg-primary text-primary-foreground">...</div>
```

### Don't apply rounded corners ad-hoc

```tsx
// ❌ Wrong
<div className="rounded-[7px]">...</div>
// ✅ Right
<div className="rounded-md">...</div>
```

### Don't write status-color logic in components

```tsx
// ❌ Wrong
<span className={status === "active" ? "bg-green-500" : "bg-red-500"}>
// ✅ Right — let StatusBadge / StatusPill (and the tone map) decide
<StatusBadge status={status} />
```

### Don't introduce a new font without a token

Add it to the layout + a `@theme inline` mapping; never inline `font-family`.
