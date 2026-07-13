import { redirect } from "next/navigation";

import { type FeatureFlags, getFeatureFlags } from "@repo/env/features";

// Route-level companion to nav filtering. A hidden route must not be reachable by
// URL, so gated pages call this at the top of their Server Component. It redirects
// to /forbidden (same convention as requireAdmin / requireCapability) when the
// flag is off.
//
//   requireFeature("betaFeatures");
export function requireFeature(flag: keyof FeatureFlags): void {
  if (!getFeatureFlags()[flag]) {
    redirect("/forbidden");
  }
}
