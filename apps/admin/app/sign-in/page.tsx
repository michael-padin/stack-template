"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent, type KeyboardEvent } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { signIn } from "@repo/auth/client";
import { APP_NAME, env as clientEnv } from "@repo/env/client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { Label } from "@repo/ui/components/label";
import { Spinner } from "@repo/ui/components/spinner";

const SUPPORT_EMAIL = "support@example.com";
const WEB_URL = clientEnv.NEXT_PUBLIC_WEB_URL ?? "/";

export default function AdminSignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn.email({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (error) {
      setError(
        error.message ??
          `That email and password didn't match. Email ${SUPPORT_EMAIL} if you're locked out.`,
      );
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  function handleCapsLock(e: KeyboardEvent<HTMLInputElement>) {
    setCapsLock(e.getModifierState("CapsLock"));
  }

  const passwordDescribedBy =
    [error ? "signin-error" : null, capsLock ? "caps-lock-hint" : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <main className="relative grid min-h-svh lg:h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:overflow-hidden">
      <div className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
        <Link
          href={WEB_URL}
          aria-label={`${APP_NAME} home`}
          className="text-muted-foreground hover:text-foreground absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-medium sm:top-8 sm:left-10 lg:left-14"
        >
          <BrandMark />
          {APP_NAME}
        </Link>
        <div className="w-full max-w-sm">
          <p className="text-muted-foreground flex items-center gap-2 text-[0.68rem] tracking-[0.22em] uppercase">
            <BrandMark />
            {APP_NAME} · Admin
          </p>
          <h1 className="mt-4 text-[2.25rem] leading-[1.05] font-semibold tracking-tight sm:text-[2.5rem]">
            Welcome back.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-[30ch] text-sm leading-relaxed">
            Sign in to manage the dashboard. For invited admins only.{" "}
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              Request access
            </Link>
            .
          </p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-5" aria-busy={submitting}>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={error ? "signin-error" : undefined}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handleCapsLock}
                  onKeyDown={handleCapsLock}
                  aria-describedby={passwordDescribedBy}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOffIcon aria-hidden="true" />
                    ) : (
                      <EyeIcon aria-hidden="true" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {capsLock ? (
                <p id="caps-lock-hint" className="text-muted-foreground text-xs" role="status">
                  Caps Lock is on.
                </p>
              ) : null}
            </div>

            {error ? (
              <p id="signin-error" className="text-destructive text-sm" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? <Spinner data-icon="inline-start" /> : null}
              {submitting ? "Signing in" : "Sign in"}
            </Button>
            <span aria-live="polite" className="sr-only">
              {submitting ? "Signing in" : ""}
            </span>
          </form>

          <div className="border-border/60 mt-10 flex items-center justify-between gap-3 border-t pt-5">
            <p className="text-muted-foreground text-xs">
              Locked out?{" "}
              <Link
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {SUPPORT_EMAIL}
              </Link>
            </p>
            <p className="text-muted-foreground font-mono text-[0.6rem] tracking-[0.18em] uppercase">
              v0.1
            </p>
          </div>
        </div>
      </div>

      <aside
        className="bg-muted/30 border-border/60 relative hidden overflow-hidden lg:flex lg:border-l"
        aria-hidden="true"
      >
        <SignInIllustration />
      </aside>
    </main>
  );
}

function BrandMark() {
  return (
    <svg viewBox="0 0 16 16" className="text-primary h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <line
        x1="8"
        y1="0.5"
        x2="8"
        y2="3"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      <line
        x1="8"
        y1="13"
        x2="8"
        y2="15.5"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      <line
        x1="0.5"
        y1="8"
        x2="3"
        y2="8"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      <line
        x1="13"
        y1="8"
        x2="15.5"
        y2="8"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      <circle cx="8" cy="8" r="2.6" fill="currentColor" />
    </svg>
  );
}

function SignInIllustration() {
  type Station = {
    id: string;
    x: number;
    y: number;
    code: string;
    glyph: "H" | "B" | "G";
    hero?: boolean;
    scale?: number;
  };

  // Asymmetric composition: hero anchored upper-right third (rule of
  // thirds), satellites cascade away in a diagonal flow.
  const stations: Station[] = [
    { id: "a", x: 80, y: 118, code: "HC-204", glyph: "H", scale: 0.7 },
    { id: "b", x: 218, y: 88, code: "BM-118", glyph: "B", scale: 0.85 },
    { id: "c", x: 370, y: 142, code: "GR-031", glyph: "G", scale: 0.8 },
    { id: "d", x: 152, y: 252, code: "HC-076", glyph: "H", scale: 0.9 },
    { id: "e", x: 318, y: 248, code: "BM-002", glyph: "B", hero: true },
    { id: "f", x: 92, y: 396, code: "BM-089", glyph: "B", scale: 0.85 },
    { id: "g", x: 244, y: 422, code: "HC-145", glyph: "H", scale: 0.95 },
    { id: "h", x: 408, y: 388, code: "GR-052", glyph: "G", scale: 0.9 },
    { id: "i", x: 168, y: 562, code: "BM-031", glyph: "B", scale: 0.75 },
    { id: "j", x: 348, y: 596, code: "HC-211", glyph: "H", scale: 0.85 },
  ];
  const stationById = new Map(stations.map((s) => [s.id, s] as const));

  const edges: [string, string][] = [
    ["a", "b"],
    ["b", "c"],
    ["a", "d"],
    ["b", "d"],
    ["b", "e"],
    ["c", "e"],
    ["d", "e"],
    ["d", "f"],
    ["d", "g"],
    ["e", "g"],
    ["e", "h"],
    ["c", "h"],
    ["f", "g"],
    ["g", "h"],
    ["f", "i"],
    ["g", "i"],
    ["g", "j"],
    ["h", "j"],
    ["i", "j"],
  ];

  const hero = stations.find((s) => s.hero)!;

  return (
    <svg viewBox="0 0 480 720" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        {/* Dot grid — more modern than a hairline grid */}
        <pattern id="signin-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.85" fill="currentColor" />
        </pattern>
        {/* Edge gradient for halos */}
        <linearGradient id="signin-edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        {/* Scan-line accent across the canvas */}
        <linearGradient id="signin-scan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="35%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="65%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="signin-vignette" cx="60%" cy="42%" r="80%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="var(--background)" stopOpacity="0.45" />
        </radialGradient>
        <filter id="signin-soft-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* Dot grid background, deliberately faint */}
      <rect
        width="480"
        height="720"
        className="text-muted-foreground"
        fill="url(#signin-dot-grid)"
        opacity="0.22"
      />

      {/* Single sweeping organic contour as background depth */}
      <path
        d="M -20 480 C 80 360, 180 320, 300 340 S 460 460, 520 420"
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.16"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M -20 540 C 100 420, 200 380, 320 396 S 480 500, 520 470"
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.11"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Diagonal scan-line accent — modern data-vis touch */}
      <line x1="0" y1="116" x2="480" y2="244" stroke="url(#signin-scan)" strokeWidth="1.25" />

      {/* Triangulation mesh */}
      <g stroke="var(--foreground)" strokeOpacity="0.16" strokeWidth="0.75">
        {edges.map(([from, to]) => {
          const a = stationById.get(from)!;
          const b = stationById.get(to)!;
          return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
      </g>

      {/* Hero ambient bloom + concentric focus rings */}
      <circle
        cx={hero.x}
        cy={hero.y}
        r="68"
        fill="var(--primary)"
        fillOpacity="0.16"
        filter="url(#signin-soft-bloom)"
      />
      <g transform={`translate(${hero.x} ${hero.y})`}>
        {/* Outer focus ring */}
        <circle r="54" fill="none" stroke="var(--primary)" strokeOpacity="0.22" strokeWidth="0.6" />
        {/* Inner focus ring (dashed, finer) */}
        <circle
          r="34"
          fill="none"
          stroke="var(--primary)"
          strokeOpacity="0.4"
          strokeDasharray="1.5 4"
          strokeWidth="0.75"
        />
        {/* 12 tick marks at 30° intervals — long at cardinals, short at intermediates */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30;
          const major = angle % 90 === 0;
          return (
            <line
              key={`tick-${angle}`}
              transform={`rotate(${angle})`}
              x1="0"
              y1={major ? -58 : -56}
              x2="0"
              y2={major ? -50 : -52}
              stroke="var(--primary)"
              strokeOpacity={major ? 0.7 : 0.35}
              strokeWidth={major ? 1.1 : 0.7}
              strokeLinecap="round"
            />
          );
        })}
        {/* Cardinal labels */}
        <text
          y="-66"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="700"
          fill="var(--primary)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1"
        >
          N
        </text>
        {/* Short crosshair through the centre */}
        <line
          x1="-26"
          y1="0"
          x2="-14"
          y2="0"
          stroke="var(--primary)"
          strokeOpacity="0.5"
          strokeWidth="0.75"
        />
        <line
          x1="14"
          y1="0"
          x2="26"
          y2="0"
          stroke="var(--primary)"
          strokeOpacity="0.5"
          strokeWidth="0.75"
        />
        <line
          x1="0"
          y1="-26"
          x2="0"
          y2="-14"
          stroke="var(--primary)"
          strokeOpacity="0.5"
          strokeWidth="0.75"
        />
        <line
          x1="0"
          y1="14"
          x2="0"
          y2="26"
          stroke="var(--primary)"
          strokeOpacity="0.5"
          strokeWidth="0.75"
        />
      </g>

      {/* Node markers (geometry only — labels rendered above the vignette) */}
      <g>
        {stations.map((p) => {
          const baseScale = p.scale ?? 1;
          const r = p.hero ? 9 : 4.5 * baseScale;
          const haloR = p.hero ? 19 : 10 * baseScale;
          const glyphSize = p.hero ? 9 : 6 * baseScale;
          return (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={haloR}
                fill="var(--primary)"
                fillOpacity={p.hero ? 0.16 : 0.1}
              />
              <circle cx={p.x} cy={p.y} r={r + 1.6} fill="var(--background)" />
              <circle cx={p.x} cy={p.y} r={r} fill="var(--primary)" />
              <text
                x={p.x}
                y={p.y + glyphSize * 0.36}
                textAnchor="middle"
                fontSize={glyphSize}
                fontWeight="700"
                fill="var(--primary-foreground)"
                fontFamily="var(--font-mono, ui-monospace, monospace)"
              >
                {p.glyph}
              </text>
            </g>
          );
        })}
      </g>

      {/* Edge vignette — softens the geometry's perimeter only.
          All readable text is rendered AFTER this so the wash never hides it. */}
      <rect width="480" height="720" fill="url(#signin-vignette)" />

      {/* Node code labels — placed above the vignette so they stay crisp */}
      <g>
        {stations.map((p) => {
          if (p.hero) return null;
          const baseScale = p.scale ?? 1;
          const haloR = 10 * baseScale;
          return (
            <text
              key={`${p.id}-label`}
              x={p.x + haloR + 4}
              y={p.y + 3}
              fontSize="8"
              fill="var(--muted-foreground)"
              fontFamily="var(--font-mono, ui-monospace, monospace)"
              letterSpacing="0.6"
              opacity="0.85"
            >
              {p.code}
            </text>
          );
        })}
      </g>

      {/* Hero callout — leader line + multi-line tag */}
      <g>
        <line
          x1={hero.x + 12}
          y1={hero.y - 12}
          x2={hero.x + 76}
          y2={hero.y - 80}
          stroke="var(--foreground)"
          strokeOpacity="0.45"
          strokeWidth="0.75"
        />
        <circle
          cx={hero.x + 76}
          cy={hero.y - 80}
          r="2"
          fill="var(--foreground)"
          fillOpacity="0.6"
        />
        <line
          x1={hero.x + 76}
          y1={hero.y - 80}
          x2={hero.x + 120}
          y2={hero.y - 80}
          stroke="var(--foreground)"
          strokeOpacity="0.3"
          strokeWidth="0.6"
        />
        <text
          x={hero.x + 80}
          y={hero.y - 84}
          fontSize="9.5"
          fontWeight="700"
          fill="var(--foreground)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1.2"
        >
          {hero.code}
        </text>
        <text
          x={hero.x + 80}
          y={hero.y - 72}
          fontSize="7.5"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1.5"
        >
          TIER 1 · ACTIVE
        </text>
        <text
          x={hero.x + 80}
          y={hero.y - 60}
          fontSize="7.5"
          fill="var(--primary)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1.5"
          opacity="0.85"
        >
          REGION 04 · 24 NODES
        </text>
      </g>

      {/* Compass rose — small, upper-right of the canvas */}
      <g transform="translate(420 108)">
        <circle
          r="22"
          fill="var(--background)"
          fillOpacity="0.6"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.4"
          strokeWidth="0.75"
        />
        <circle
          r="14"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.25"
          strokeWidth="0.6"
        />
        {/* North arrow */}
        <path d="M 0 -16 L 3.5 -2 L 0 -5 L -3.5 -2 Z" fill="var(--primary)" />
        {/* South stub */}
        <path
          d="M 0 16 L 2.5 4 L 0 6 L -2.5 4 Z"
          fill="var(--muted-foreground)"
          fillOpacity="0.55"
        />
        {/* E/W tick marks */}
        <line
          x1="-16"
          y1="0"
          x2="-10"
          y2="0"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.55"
          strokeWidth="0.75"
        />
        <line
          x1="10"
          y1="0"
          x2="16"
          y2="0"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.55"
          strokeWidth="0.75"
        />
        <text
          y="-26"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill="var(--primary)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1.2"
        >
          N
        </text>
      </g>

      {/* Index bar — lower-right of the network */}
      <g transform="translate(308 644)">
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          stroke="var(--foreground)"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        {[0, 25, 50, 75, 100].map((x) => (
          <line
            key={x}
            x1={x}
            y1="-3"
            x2={x}
            y2="3"
            stroke="var(--foreground)"
            strokeOpacity="0.55"
            strokeWidth="0.85"
          />
        ))}
        <text
          x="0"
          y="14"
          fontSize="7"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1"
        >
          0
        </text>
        <text
          x="50"
          y="14"
          textAnchor="middle"
          fontSize="7"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1"
        >
          50
        </text>
        <text
          x="100"
          y="14"
          textAnchor="end"
          fontSize="7"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          letterSpacing="1"
        >
          100
        </text>
      </g>

      {/* Corner brackets — modern editorial touch */}
      <g stroke="var(--muted-foreground)" strokeOpacity="0.45" strokeWidth="1" fill="none">
        <path d="M 32 32 L 32 56 M 32 32 L 56 32" />
        <path d="M 448 32 L 448 56 M 448 32 L 424 32" />
        <path d="M 32 688 L 32 664 M 32 688 L 56 688" />
        <path d="M 448 688 L 448 664 M 448 688 L 424 688" />
      </g>

      {/* Eyebrow */}
      <line
        x1="68"
        y1="46"
        x2="88"
        y2="46"
        stroke="var(--primary)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <text
        x="96"
        y="50"
        fontSize="9.5"
        fontFamily="var(--font-mono, ui-monospace, monospace)"
        fill="var(--foreground)"
        fontWeight="600"
        letterSpacing="3"
      >
        INTERNAL TOOLS NETWORK
      </text>
      <text
        x="68"
        y="64"
        fontSize="8.5"
        fontFamily="var(--font-mono, ui-monospace, monospace)"
        fill="var(--muted-foreground)"
        opacity="0.7"
        letterSpacing="2.2"
      >
        SERVICES · RECORDS · ACCESS
      </text>

      {/* Footer caption */}
      <text
        x="68"
        y="676"
        fontSize="9"
        fontFamily="var(--font-mono, ui-monospace, monospace)"
        fill="var(--muted-foreground)"
        letterSpacing="2"
      >
        STATUS · ALL SYSTEMS OK
      </text>
      <text
        x="412"
        y="676"
        textAnchor="end"
        fontSize="9"
        fontFamily="var(--font-mono, ui-monospace, monospace)"
        fill="var(--muted-foreground)"
        opacity="0.65"
        letterSpacing="2"
      >
        {APP_NAME.toUpperCase()}
      </text>
    </svg>
  );
}
