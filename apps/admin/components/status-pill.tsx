import { STATUS_LABELS, type ItemStatus } from "@repo/types";

import { cn } from "@repo/ui/lib/utils";

type Tone = "success" | "warning" | "muted";

// Map each domain status to a semantic UI tone. When you replace `Item`,
// repoint this map at your own status enum.
const TONE: Record<ItemStatus, Tone> = {
  active: "success",
  draft: "warning",
  archived: "muted",
};

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-status-success-soft text-status-success border-status-success/30",
  warning: "bg-status-warning-soft text-status-warning border-status-warning/30",
  muted: "bg-status-muted-soft text-status-muted border-status-muted/30",
};

export function StatusPill({ status, className }: { status: ItemStatus; className?: string }) {
  const tone = TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        TONE_CLASS[tone],
        className,
      )}
    >
      <span className={`status-dot status-dot--${tone}`} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
