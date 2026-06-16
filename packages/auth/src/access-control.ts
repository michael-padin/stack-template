import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// ── Better Auth access control ──────────────────────────────────────────────
// This wires our `admin | editor | viewer` roles into Better Auth's own
// access-control system so the admin plugin's API (`/api/auth/admin/*`) and
// `auth.api.userHasPermission(...)` understand them.
//
// It extends the admin plugin's `defaultStatements` (the `user`/`session`
// permissions the admin API checks) with the app's own resources. The
// app-facing capability checks still live in `permissions.ts` (used by the
// `requireCapability` / `hasPermission` helpers) — this file is the Better
// Auth-side mirror, kept in lockstep.

const statement = {
  ...defaultStatements,
  item: ["read", "create", "update", "delete"],
  audit: ["read"],
} as const;

export const accessControl = createAccessControl(statement);

// `admin` inherits the admin plugin's full user/session permissions (via
// `adminAc.statements`) plus full access to the app resources.
export const adminRole = accessControl.newRole({
  ...adminAc.statements,
  item: ["read", "create", "update", "delete"],
  audit: ["read"],
});

// `editor` can work with items but cannot manage users/sessions or read audit.
export const editorRole = accessControl.newRole({
  item: ["read", "create", "update", "delete"],
});

// `viewer` is read-only.
export const viewerRole = accessControl.newRole({
  item: ["read"],
});

export const accessControlRoles = {
  admin: adminRole,
  editor: editorRole,
  viewer: viewerRole,
};
