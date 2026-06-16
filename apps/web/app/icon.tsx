import { ImageResponse } from "next/og";

// Generated favicon — replaces the static favicon.ico shipped by `create-next-app`.
// Mirrors the BrandMark SVG: a rounded tile with a solid center dot. The fill
// is hardcoded because ImageResponse can't read CSS variables.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const COLOR = "#171717";

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
        <rect
          x="1.5"
          y="1.5"
          width="13"
          height="13"
          rx="3.5"
          fill="none"
          stroke={COLOR}
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <circle cx="8" cy="8" r="2.8" fill={COLOR} />
      </svg>
    </div>,
    { ...size },
  );
}
