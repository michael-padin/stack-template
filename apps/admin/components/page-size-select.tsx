"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

interface PageSizeSelectProps {
  /** Current per-page value. */
  value: number;
  /** Available choices. */
  options: number[];
  /** Pathname (e.g. `/points`). */
  basePath: string;
  /** Other params to preserve (everything except `page` and `per_page`). */
  baseQuery: Record<string, string | undefined>;
}

export function PageSizeSelect({ value, options, basePath, baseQuery }: PageSizeSelectProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(next: string | null) {
    if (!next) return;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(baseQuery)) {
      if (v) params.set(k, v);
    }
    params.set("per_page", next);
    // Reset to page 1 — changing size invalidates the current offset.
    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`);
    });
  }

  return (
    <Select value={String(value)} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger aria-label="Rows per page" size="sm" className="h-8 w-[5.5rem] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={String(opt)}>
            {opt} / page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
