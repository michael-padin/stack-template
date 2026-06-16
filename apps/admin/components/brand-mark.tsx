// Brand mark — small abstract geometric glyph used by the admin shell header,
// the sign-in eyebrow, and the favicon (apps/admin/app/icon.tsx, which mirrors
// this SVG with a hardcoded fill since ImageResponse can't read CSS variables).

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
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
