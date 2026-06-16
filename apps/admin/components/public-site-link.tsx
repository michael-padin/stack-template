import { ExternalLinkIcon } from "lucide-react";

import { env } from "@repo/env/client";
import { buttonVariants } from "@repo/ui/components/button";

export function PublicSiteLink() {
  const url = env.NEXT_PUBLIC_WEB_URL;
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant: "ghost", size: "sm" })}
      aria-label="Open public site"
    >
      <ExternalLinkIcon size={14} aria-hidden="true" />
      <span className="hidden sm:inline">Public site</span>
    </a>
  );
}
