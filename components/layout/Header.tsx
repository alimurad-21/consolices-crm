"use client";

import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/clients": "Clients",
  "/dashboard/clients/new": "Add Client",
  "/dashboard/projects": "Projects",
  "/dashboard/projects/new": "Add Project",
  "/dashboard/invoices": "Invoices",
  "/dashboard/invoices/new": "Create Invoice",
  "/dashboard/payments": "Payments",
  "/dashboard/reports": "Reports",
};

function getTitle(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname];
  if (pathname.match(/\/dashboard\/clients\/[^/]+\/edit$/)) return "Edit Client";
  if (pathname.match(/\/dashboard\/clients\/[^/]+$/)) return "Client Details";
  if (pathname.match(/\/dashboard\/projects\/[^/]+\/edit$/)) return "Edit Project";
  if (pathname.match(/\/dashboard\/projects\/[^/]+$/)) return "Project Details";
  if (pathname.match(/\/dashboard\/invoices\/[^/]+$/)) return "Invoice Details";
  return "Dashboard";
}

export function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b bg-background px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
