"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-[280px] flex-col border-r border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">InsightFlow</div>
          <div className="text-xs text-muted-foreground">Analytics Suite</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-sm font-semibold tracking-tight">Team Plan</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Unlock advanced alerts and exports.
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-muted">
            <div className="h-2 w-[62%] rounded-full bg-primary" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            62% of monthly usage
          </div>
        </div>
      </div>
    </aside>
  );
}

