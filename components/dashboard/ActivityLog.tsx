"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatDateShort } from "@/lib/format";
import { useAppStore } from "@/store/useAppStore";

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[parts.length - 1]?.[0] ?? "";
  return `${a}${b}`.toUpperCase();
}

export function ActivityLog() {
  const timeRange = useAppStore((s) => s.timeRange);
  const activity = useAppStore((s) => s.activity);
  const loading = useAppStore((s) => s.loading.activity);
  const load = useAppStore((s) => s.loadActivity);

  React.useEffect(() => {
    if (activity) return;
    void load(timeRange);
  }, [activity, load, timeRange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity</CardTitle>
        <div className="text-sm text-muted-foreground">Last {timeRange}</div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading || !activity ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center">
            <div className="text-sm font-semibold tracking-tight">No recent activity</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Workspace actions will appear here.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.slice(0, 10).map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-sm font-semibold")}>
                  {initials(e.actor)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-semibold tracking-tight">{e.actor}</span>{" "}
                    <span className="text-muted-foreground">{e.action}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div className="truncate">{e.meta ?? ""}</div>
                    <div className="shrink-0">{formatDateShort(e.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

