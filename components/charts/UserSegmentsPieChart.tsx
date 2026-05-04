"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { UserSegment } from "@/lib/types";

const COLORS = ["rgb(99, 102, 241)", "rgb(16, 185, 129)", "rgb(244, 63, 94)"];

export function UserSegmentsPieChart({ data }: { data: UserSegment[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid rgba(148, 163, 184, 0.25)",
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 10px 25px rgba(2, 6, 23, 0.12)",
            }}
            formatter={(value) => `${value}%`}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={88}
            paddingAngle={3}
            stroke="rgba(255,255,255,0.6)"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

