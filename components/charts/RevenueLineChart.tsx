"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "@/lib/types";
import { formatCurrency, formatDateShort } from "@/lib/format";

export function RevenueLineChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.25)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => formatDateShort(v)}
            tick={{ fontSize: 12, fill: "rgba(100, 116, 139, 0.95)" }}
            axisLine={false}
            tickLine={false}
            minTickGap={18}
          />
          <YAxis
            tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
            tick={{ fontSize: 12, fill: "rgba(100, 116, 139, 0.95)" }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid rgba(148, 163, 184, 0.25)",
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 10px 25px rgba(2, 6, 23, 0.12)",
            }}
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => formatDateShort(String(label))}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="rgb(99, 102, 241)"
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

