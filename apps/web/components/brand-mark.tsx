// Small generic brand mark — a rounded tile with an inner dot. Mirrored in
// apps/web/app/icon.tsx (which hardcodes the fill since ImageResponse can't
// read CSS variables).

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="2.6" fill="currentColor" />
    </svg>
  );
}
