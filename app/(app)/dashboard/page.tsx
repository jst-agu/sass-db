"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { RevenueLineChart } from "@/components/charts/RevenueLineChart";
import { UserGrowthBarChart } from "@/components/charts/UserGrowthBarChart";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { Skeleton } from "@/components/ui/Skeleton";
import { analyticsToCsv, downloadCsv } from "@/lib/csv";
import type { TimeRange } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardPage() {
  const timeRange = useAppStore((s) => s.timeRange);
  const setTimeRange = useAppStore((s) => s.setTimeRange);

  const metrics = useAppStore((s) => s.overviewMetrics);
  const analytics = useAppStore((s) => s.analytics);
  const loadingOverview = useAppStore((s) => s.loading.overview);
  const loadingAnalytics = useAppStore((s) => s.loading.analytics);
  const loadOverview = useAppStore((s) => s.loadOverview);
  const loadAnalytics = useAppStore((s) => s.loadAnalytics);
  const pushToast = useAppStore((s) => s.pushToast);

  React.useEffect(() => {
    if (!metrics) void loadOverview();
    if (!analytics) void loadAnalytics();
  }, [metrics, analytics, loadOverview, loadAnalytics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor revenue, user activity, and conversion performance.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Segmented
            value={timeRange}
            onChange={(v) => setTimeRange(v as TimeRange)}
            options={[
              { value: "7d", label: "7d" },
              { value: "30d", label: "30d" },
              { value: "90d", label: "90d" },
            ]}
          />
          <Button
            variant="secondary"
            onClick={() => {
              if (!analytics) {
                pushToast({
                  title: "Export unavailable",
                  message: "Analytics data is still loading.",
                  variant: "default",
                });
                return;
              }
              downloadCsv(`insightflow-dashboard-${timeRange}.csv`, analyticsToCsv(analytics));
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loadingOverview || !metrics
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-3 h-8 w-36" />
                <Skeleton className="mt-5 h-4 w-32" />
              </Card>
            ))
          : metrics.map((m) => <MetricCard key={m.key} metric={m} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue</CardTitle>
            <div className="text-sm text-muted-foreground">Net MRR</div>
          </CardHeader>
          <CardContent>
            {loadingAnalytics || !analytics ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <RevenueLineChart data={analytics.revenue} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Growth</CardTitle>
            <div className="text-sm text-muted-foreground">Active accounts</div>
          </CardHeader>
          <CardContent>
            {loadingAnalytics || !analytics ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <UserGrowthBarChart data={analytics.userGrowth} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Highlights</CardTitle>
              <div className="text-sm text-muted-foreground">This period</div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Top plan</div>
                <div className="mt-1 text-sm font-semibold">Team • Annual</div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Highest LTV</div>
                <div className="mt-1 text-sm font-semibold">Enterprise segment</div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Support load</div>
                <div className="mt-1 text-sm font-semibold">Stable</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ActivityLog />
      </div>
    </div>
  );
}
