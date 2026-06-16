import { Badge } from "@repo/ui/components/badge";
import { cn } from "@repo/ui/lib/utils";
import { STATUS_LABELS, type ItemStatus } from "@repo/types";

// Map each item status to a design-token tone. Tokens live in @repo/ui.
const statusStyles: Record<ItemStatus, string> = {
  active: "bg-status-success-soft text-status-success ring-status-success/30",
  draft: "bg-status-warning-soft text-status-warning ring-status-warning/30",
  archived: "bg-status-muted-soft text-status-muted ring-status-muted/30",
};

export function StatusBadge({ status, className }: { status: ItemStatus; className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border border-transparent ring-1", statusStyles[status], className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
