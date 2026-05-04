"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Metric } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

export function MetricCard({ metric }: { metric: Metric }) {
  const positive = metric.changePct >= 0;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">
              {metric.valueLabel}
            </div>
          </div>

          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              positive
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
                : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(metric.changePct).toFixed(1)}%
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          vs previous period
        </div>
      </Card>
    </motion.div>
  );
}

