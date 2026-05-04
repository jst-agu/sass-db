import type { AnalyticsResponse, User } from "@/lib/types";

function csvEscape(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function usersToCsv(users: User[]) {
  const header = ["Name", "Email", "Role", "Status", "Last Active", "Created At"];
  const rows = users.map((u) => [
    u.name,
    u.email,
    u.role,
    u.status,
    u.lastActiveAt,
    u.createdAt,
  ]);
  return [header, ...rows]
    .map((row) => row.map((v) => csvEscape(String(v))).join(","))
    .join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function analyticsToCsv(analytics: AnalyticsResponse) {
  const byDate = new Map<string, { revenue?: number; users?: number }>();
  for (const p of analytics.revenue) {
    byDate.set(p.date, { ...(byDate.get(p.date) ?? {}), revenue: p.revenue });
  }
  for (const p of analytics.userGrowth) {
    byDate.set(p.date, { ...(byDate.get(p.date) ?? {}), users: p.users });
  }

  const dates = [...byDate.keys()].sort((a, b) => (a < b ? -1 : 1));
  const header = ["Date", "Revenue", "Active Users"];
  const rows = dates.map((d) => {
    const v = byDate.get(d) ?? {};
    return [d, v.revenue ?? "", v.users ?? ""];
  });

  return [header, ...rows]
    .map((row) => row.map((v) => csvEscape(String(v))).join(","))
    .join("\n");
}
