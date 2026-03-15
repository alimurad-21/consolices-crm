"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="glass-sidebar fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/[0.06]">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-white/[0.06] px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            CONSOLICES
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/80 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive && "drop-shadow-sm")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.06] px-3 py-3">
        {userEmail ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-xs font-semibold uppercase text-slate-300">
              {userEmail[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs text-slate-300">{userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">Consolices CRM</p>
        )}
      </div>
    </aside>
  );
}
