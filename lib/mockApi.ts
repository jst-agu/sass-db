import type {
  ActivityEvent,
  AnalyticsResponse,
  Metric,
  Notification,
  TimeRange,
  User,
  UserRole,
  UserStatus,
  UsersQuery,
  UsersResponse,
} from "@/lib/types";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "@/lib/format";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function daysForRange(range: TimeRange) {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  return 90;
}

function isoDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

function buildTimeSeries(days: number, seed: number) {
  const rand = seededRandom(seed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const revenue: { date: string; revenue: number }[] = [];
  const userGrowth: { date: string; users: number }[] = [];

  let rev = 68000;
  let users = 14600;

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weekly = Math.sin(((days - i) / 7) * Math.PI * 2) * 1800;
    const revNoise = (rand() - 0.5) * 3200;
    const revTrend = 240 + rand() * 120;
    rev = clamp(rev + revTrend + weekly + revNoise, 24000, 220000);

    const userNoise = (rand() - 0.5) * 80;
    const userTrend = 22 + rand() * 18;
    users = clamp(users + userTrend + userNoise, 8000, 52000);

    revenue.push({ date: isoDay(d), revenue: Math.round(rev) });
    userGrowth.push({ date: isoDay(d), users: Math.round(users) });
  }

  return { revenue, userGrowth };
}

const allUsers: User[] = [
  {
    id: "usr_9q1w4",
    name: "Ava Chen",
    email: "ava.chen@insightflow.io",
    role: "Owner",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 420).toISOString(),
  },
  {
    id: "usr_k2m7r",
    name: "Noah Martinez",
    email: "noah.martinez@northwind.co",
    role: "Admin",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 210).toISOString(),
  },
  {
    id: "usr_a8p3n",
    name: "Priya Nair",
    email: "priya.nair@vaultpay.com",
    role: "Analyst",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 165).toISOString(),
  },
  {
    id: "usr_f4t0x",
    name: "Ethan Brooks",
    email: "ethan.brooks@atlascrm.com",
    role: "Support",
    status: "Suspended",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 92).toISOString(),
  },
  {
    id: "usr_d1v6c",
    name: "Sofia Laurent",
    email: "sofia.laurent@paperstack.io",
    role: "Admin",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 320).toISOString(),
  },
  {
    id: "usr_m5e2j",
    name: "Liam O'Connor",
    email: "liam.oconnor@greenleaf.ai",
    role: "Support",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 130).toISOString(),
  },
  {
    id: "usr_u8s2b",
    name: "Maya Patel",
    email: "maya.patel@opticsuite.com",
    role: "Analyst",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 240).toISOString(),
  },
  {
    id: "usr_z0h9q",
    name: "Jackson Reed",
    email: "jackson.reed@finchlabs.io",
    role: "Support",
    status: "Suspended",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 41).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 75).toISOString(),
  },
  {
    id: "usr_p7x6y",
    name: "Isabella Rossi",
    email: "isabella.rossi@stellarops.com",
    role: "Admin",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 260).toISOString(),
  },
  {
    id: "usr_b3n1l",
    name: "Oliver Kim",
    email: "oliver.kim@zenledger.io",
    role: "Analyst",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
  },
  {
    id: "usr_q4r8t",
    name: "Hannah Weber",
    email: "hannah.weber@syncgrid.com",
    role: "Support",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 58).toISOString(),
  },
  {
    id: "usr_v6c7s",
    name: "Mateo Alvarez",
    email: "mateo.alvarez@octanehq.com",
    role: "Admin",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 112).toISOString(),
  },
];

let usersDb: User[] = [...allUsers];

const notificationsDb: Notification[] = [
  {
    id: "ntf_4c2p0",
    title: "Revenue anomaly detected",
    message: "Yesterday’s MRR dipped 8% below the 30d baseline. Check billing and churn signals.",
    source: "Billing",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    read: false,
  },
  {
    id: "ntf_7a1k9",
    title: "New admin invited",
    message: "Noah Martinez was granted Admin access to the workspace.",
    source: "Users",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: "ntf_9m8q3",
    title: "Weekly analytics report ready",
    message: "Your weekly snapshot is generated. Review top channels and conversion trends.",
    source: "Analytics",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    read: true,
  },
  {
    id: "ntf_2f6s1",
    title: "Security policy updated",
    message: "Session expiry and password requirements were updated for your org.",
    source: "Security",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    read: true,
  },
];

function buildActivityLog(days: number) {
  const rand = seededRandom(2025 + days);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const actors = ["Ava Chen", "Noah Martinez", "Priya Nair", "Sofia Laurent", "Mateo Alvarez"];
  const actions = [
    { action: "exported analytics", meta: "CSV • Revenue + Users" },
    { action: "updated a user role", meta: "Users • Admin" },
    { action: "reviewed churn signals", meta: "Billing • Cohorts" },
    { action: "created a dashboard alert", meta: "Analytics • Revenue" },
    { action: "changed workspace settings", meta: "Security • Session policy" },
  ];

  const events: ActivityEvent[] = [];
  const count = Math.max(10, Math.min(26, Math.round(days / 4) + 12));

  for (let i = 0; i < count; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(rand() * days));
    d.setHours(9 + Math.floor(rand() * 9), Math.floor(rand() * 60), 0, 0);
    const actor = actors[Math.floor(rand() * actors.length)]!;
    const pick = actions[Math.floor(rand() * actions.length)]!;
    events.push({
      id: `act_${days}_${i}`,
      actor,
      action: pick.action,
      meta: pick.meta,
      createdAt: d.toISOString(),
    });
  }

  return events.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getOverview(range: TimeRange): Promise<{ metrics: Metric[] }> {
  await sleep(550);
  const days = daysForRange(range);
  const { revenue, userGrowth } = buildTimeSeries(days, 42);

  const totalRevenue = revenue.reduce((sum, p) => sum + p.revenue, 0);
  const activeUsers = userGrowth[userGrowth.length - 1]?.users ?? 0;
  const conversionRate = 3.4 + (range === "7d" ? 0.3 : range === "30d" ? 0.1 : -0.05);
  const monthlyGrowth = range === "7d" ? 4.8 : range === "30d" ? 9.6 : 14.2;

  const metrics: Metric[] = [
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: totalRevenue,
      valueLabel: formatCurrency(totalRevenue),
      changePct: range === "7d" ? 6.2 : range === "30d" ? 12.8 : 18.4,
    },
    {
      key: "activeUsers",
      label: "Active Users",
      value: activeUsers,
      valueLabel: formatCompactNumber(activeUsers),
      changePct: range === "7d" ? 2.4 : range === "30d" ? 5.1 : 8.9,
    },
    {
      key: "conversionRate",
      label: "Conversion Rate",
      value: conversionRate,
      valueLabel: formatPercent(conversionRate, 1),
      changePct: range === "7d" ? -0.8 : range === "30d" ? 1.1 : 2.0,
    },
    {
      key: "monthlyGrowth",
      label: "Monthly Growth",
      value: monthlyGrowth,
      valueLabel: formatPercent(monthlyGrowth, 1),
      changePct: range === "7d" ? 1.5 : range === "30d" ? 3.4 : 5.2,
    },
  ];

  return { metrics };
}

export async function getAnalytics(range: TimeRange): Promise<AnalyticsResponse> {
  await sleep(650);
  const days = daysForRange(range);
  const { revenue, userGrowth } = buildTimeSeries(days, 1337);

  const segments = [
    { name: "Self-serve", value: 52 },
    { name: "SMB", value: 31 },
    { name: "Enterprise", value: 17 },
  ];

  return { revenue, userGrowth, segments };
}

function applyUsersQuery(q: UsersQuery) {
  const search = q.search.trim().toLowerCase();
  return usersDb.filter((u) => {
    const matchesSearch =
      search.length === 0 ||
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search);
    const matchesRole = q.role === "All" || u.role === q.role;
    const matchesStatus = q.status === "All" || u.status === q.status;
    return matchesSearch && matchesRole && matchesStatus;
  });
}

export async function getUsers(q: UsersQuery): Promise<UsersResponse> {
  await sleep(500);
  const filtered = applyUsersQuery(q);
  const total = filtered.length;
  const start = (q.page - 1) * q.pageSize;
  const users = filtered.slice(start, start + q.pageSize);
  return { users, total };
}

export async function updateUser(input: {
  id: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}): Promise<User> {
  await sleep(520);
  const idx = usersDb.findIndex((u) => u.id === input.id);
  if (idx === -1) throw new Error("User not found");
  const current = usersDb[idx]!;
  const updated: User = {
    ...current,
    name: input.name.trim(),
    role: input.role,
    status: input.status,
    lastActiveAt: current.lastActiveAt,
    createdAt: current.createdAt,
  };
  usersDb = [...usersDb.slice(0, idx), updated, ...usersDb.slice(idx + 1)];
  return updated;
}

export async function deleteUser(id: string): Promise<void> {
  await sleep(520);
  const before = usersDb.length;
  usersDb = usersDb.filter((u) => u.id !== id);
  if (usersDb.length === before) throw new Error("User not found");
}

export async function getNotifications(): Promise<Notification[]> {
  await sleep(420);
  return notificationsDb.map((n) => ({ ...n }));
}

export async function getActivityLog(range: TimeRange): Promise<ActivityEvent[]> {
  await sleep(520);
  return buildActivityLog(daysForRange(range));
}
