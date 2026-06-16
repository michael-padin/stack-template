import { ImageResponse } from "next/og";

import { APP_NAME } from "@repo/env/client";

// 1200×630 social preview. White surface, neutral foreground, a mono eyebrow
// with letter-spacing, a faint dot grid, and corner brackets. ImageResponse
// can't read CSS variables, so the theme tokens are approximated to hex here.

export const alt = `${APP_NAME} — internal tools`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLOR_BG = "#ffffff";
const COLOR_FOREGROUND = "#252525";
const COLOR_MUTED = "#737373";
const COLOR_BORDER = "#e5e5e5";
const COLOR_PRIMARY = "#171717";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLOR_BG,
        color: COLOR_FOREGROUND,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        position: "relative",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Faint dot grid */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1" fill={COLOR_MUTED} opacity="0.18" />
          </pattern>
        </defs>
        <rect width="1200" height="630" fill="url(#dots)" />
      </svg>

      {/* Corner brackets — editorial touch */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", inset: 0 }}
        stroke={COLOR_BORDER}
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M 48 48 L 48 88 M 48 48 L 88 48" />
        <path d="M 1152 48 L 1152 88 M 1152 48 L 1112 48" />
        <path d="M 48 582 L 48 542 M 48 582 L 88 582" />
        <path d="M 1152 582 L 1152 542 M 1152 582 L 1112 582" />
      </svg>

      {/* Eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
        }}
      >
        <svg viewBox="0 0 16 16" width="20" height="20">
          <rect
            x="1.5"
            y="1.5"
            width="13"
            height="13"
            rx="3.5"
            fill="none"
            stroke={COLOR_PRIMARY}
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
          <circle cx="8" cy="8" r="2.8" fill={COLOR_PRIMARY} />
        </svg>
        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.28em",
            color: COLOR_FOREGROUND,
            textTransform: "uppercase",
            fontWeight: 600,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {APP_NAME}
        </div>
      </div>

      {/* Headline + sub */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.04,
            color: COLOR_FOREGROUND,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            maxWidth: 980,
          }}
        >
          Browse and manage your records.
        </div>
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.4,
            color: COLOR_MUTED,
            maxWidth: 820,
          }}
        >
          A clean, searchable catalog — filter, sort, and drill into any item.
        </div>
      </div>

      {/* Footer eyebrow */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
          color: COLOR_PRIMARY,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 500,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 24, height: 1, background: COLOR_PRIMARY, opacity: 0.6 }} />
          {APP_NAME}
        </div>
        <div style={{ color: COLOR_MUTED }}>Internal tools</div>
      </div>
    </div>,
    { ...size },
  );
}
