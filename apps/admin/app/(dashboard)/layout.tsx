import { cookies } from "next/headers";

import { requireAdmin } from "@repo/auth/next";

import { AdminShell } from "@/components/admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const cookieStore = await cookies();

  const user = {
    name: session.user.name,
    email: session.user.email,
    role: "admin",
  };
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <AdminShell user={user} defaultOpen={defaultOpen}>
      {children}
    </AdminShell>
  );
}
