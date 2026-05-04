"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UserGrowthPoint } from "@/lib/types";
import { formatCompactNumber, formatDateShort } from "@/lib/format";

export function UserGrowthBarChart({ data }: { data: UserGrowthPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
            tickFormatter={(v) => formatCompactNumber(Number(v))}
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
            formatter={(value) => formatCompactNumber(Number(value))}
            labelFormatter={(label) => formatDateShort(String(label))}
          />
          <Bar dataKey="users" fill="rgba(15, 23, 42, 0.85)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

