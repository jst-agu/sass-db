"use client";

import * as React from "react";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

export function Topbar() {
  const [search, setSearch] = React.useState("");
  const openMobileSidebar = useAppStore((s) => s.openMobileSidebar);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const theme = useAppStore((s) => s.theme);
  const openNotifications = useAppStore((s) => s.openNotifications);
  const loadNotifications = useAppStore((s) => s.loadNotifications);
  const notifications = useAppStore((s) => s.notifications);
  const notificationsLoading = useAppStore((s) => s.loading.notifications);

  React.useEffect(() => {
    if (notifications.length > 0) return;
    void loadNotifications();
  }, [notifications.length, loadNotifications]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-10 px-0 lg:hidden"
          onClick={openMobileSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search metrics, users, reports…"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-10 px-0"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-muted/70"
            onClick={openNotifications}
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationsLoading ? (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-muted-foreground/60" />
            ) : unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm transition-colors hover:bg-muted/70"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-sm font-semibold">
                  AC
                </div>
                <div className="hidden text-left leading-tight sm:block">
                  <div className="text-sm font-semibold tracking-tight">Ava Chen</div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Account settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-danger focus:text-danger">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
