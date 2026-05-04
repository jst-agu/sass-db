"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { RevenueLineChart } from "@/components/charts/RevenueLineChart";
import { UserGrowthBarChart } from "@/components/charts/UserGrowthBarChart";
import { UserSegmentsPieChart } from "@/components/charts/UserSegmentsPieChart";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { Skeleton } from "@/components/ui/Skeleton";
import { analyticsToCsv, downloadCsv } from "@/lib/csv";
import type { TimeRange } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export default function AnalyticsPage() {
  const timeRange = useAppStore((s) => s.timeRange);
  const setTimeRange = useAppStore((s) => s.setTimeRange);
  const analytics = useAppStore((s) => s.analytics);
  const loading = useAppStore((s) => s.loading.analytics);
  const loadAnalytics = useAppStore((s) => s.loadAnalytics);
  const pushToast = useAppStore((s) => s.pushToast);

  React.useEffect(() => {
    if (!analytics) void loadAnalytics();
  }, [analytics, loadAnalytics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trends and segmentation across your revenue and users.
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
              downloadCsv(`insightflow-analytics-${timeRange}.csv`, analyticsToCsv(analytics));
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue over time</CardTitle>
            <div className="text-sm text-muted-foreground">USD</div>
          </CardHeader>
          <CardContent>
            {loading || !analytics ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <RevenueLineChart data={analytics.revenue} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User growth</CardTitle>
            <div className="text-sm text-muted-foreground">Accounts</div>
          </CardHeader>
          <CardContent>
            {loading || !analytics ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <UserGrowthBarChart data={analytics.userGrowth} />
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Top channel</div>
                <div className="mt-1 text-sm font-semibold">Direct + Referrals</div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Best day</div>
                <div className="mt-1 text-sm font-semibold">Wednesday</div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Churn risk</div>
                <div className="mt-1 text-sm font-semibold">Low</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Insights are computed from your last {timeRange} performance and updated automatically.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Segments</CardTitle>
            <div className="text-sm text-muted-foreground">Users</div>
          </CardHeader>
          <CardContent>
            {loading || !analytics ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <UserSegmentsPieChart data={analytics.segments} />
            )}
            {analytics ? (
              <div className="mt-4 space-y-2 text-sm">
                {analytics.segments.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="text-muted-foreground">{s.name}</div>
                    <div className="font-semibold">{s.value}%</div>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
