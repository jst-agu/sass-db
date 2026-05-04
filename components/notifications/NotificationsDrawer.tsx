"use client";

import * as React from "react";
import { CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/Sheet";
import { cn } from "@/lib/cn";
import { formatDateShort } from "@/lib/format";
import { useAppStore } from "@/store/useAppStore";

function sourceLabel(source: string) {
  if (source === "Billing") return "Billing";
  if (source === "Users") return "Users";
  if (source === "Analytics") return "Analytics";
  return "Security";
}

export function NotificationsDrawer() {
  const open = useAppStore((s) => s.isNotificationsOpen);
  const close = useAppStore((s) => s.closeNotifications);
  const load = useAppStore((s) => s.loadNotifications);
  const loading = useAppStore((s) => s.loading.notifications);
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const markRead = useAppStore((s) => s.markNotificationRead);

  React.useEffect(() => {
    if (!open) return;
    if (notifications.length > 0) return;
    void load();
  }, [open, notifications.length, load]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : close())}>
      <SheetContent>
        <SheetHeader className="flex items-start justify-between gap-3">
          <div>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              Updates from billing, analytics, users, and security.
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={markAllRead}
              disabled={notifications.length === 0 || unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={close} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="h-[calc(100vh-74px)] overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="text-sm font-semibold tracking-tight">All caught up</div>
              <div className="mt-1 text-sm text-muted-foreground">
                You’ll see important updates here as they happen.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors",
                    "hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-semibold tracking-tight">
                          {n.title}
                        </div>
                        {!n.read ? (
                          <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500" aria-label="Unread" />
                        ) : null}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {n.message}
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      <div>{sourceLabel(n.source)}</div>
                      <div className="mt-1">{formatDateShort(n.createdAt)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

