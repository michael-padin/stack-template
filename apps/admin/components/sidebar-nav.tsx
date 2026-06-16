"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GaugeIcon, HelpCircleIcon, LayersIcon, UsersIcon } from "lucide-react";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ui/components/sidebar";

// Data-driven navigation — add a resource by appending one entry. Each new
// admin section should have a matching route under app/(dashboard)/.
const NAV: Array<{ href: string; label: string; icon: typeof GaugeIcon }> = [
  { href: "/", label: "Overview", icon: GaugeIcon },
  { href: "/items", label: "Items", icon: LayersIcon },
  { href: "/users", label: "Admins", icon: UsersIcon },
  { href: "/help", label: "Help & docs", icon: HelpCircleIcon },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname() ?? "/";
  return (
    <SidebarMenu>
      {NAV.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            isActive={isActive(pathname, href)}
            tooltip={label}
            render={<Link href={href} />}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
