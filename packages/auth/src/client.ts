"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

/**
 * Browser-side Better Auth client. Use in client components for sign-in,
 * sign-out, useSession, and admin operations (when current user is admin).
 *
 * Each app should re-export this from its own `lib/auth-client.ts` if it
 * needs to set a different baseURL — by default we infer it from the
 * current origin.
 */
export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const { signIn, signOut } = authClient;
