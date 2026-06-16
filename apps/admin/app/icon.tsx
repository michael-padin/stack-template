import { ImageResponse } from "next/og";

// Same brand mark as the web app (apps/web/app/icon.tsx) so an admin tab
// is visually a sibling of the public one. No OG image because admin is
// invite-only — sharing the URL isn't a social-preview scenario.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <svg viewBox="0 0 16 16" width="32" height="32">
        <circle
          cx="8"
          cy="8"
          r="6.5"
          fill="none"
          stroke="#a35d24"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <line x1="8" y1="0.5" x2="8" y2="3" stroke="#a35d24" strokeWidth="1" />
        <line x1="8" y1="13" x2="8" y2="15.5" stroke="#a35d24" strokeWidth="1" />
        <line x1="0.5" y1="8" x2="3" y2="8" stroke="#a35d24" strokeWidth="1" />
        <line x1="13" y1="8" x2="15.5" y2="8" stroke="#a35d24" strokeWidth="1" />
        <circle cx="8" cy="8" r="2.8" fill="#a35d24" />
      </svg>
    </div>,
    { ...size },
  );
}
