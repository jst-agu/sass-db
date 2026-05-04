export type TimeRange = "7d" | "30d" | "90d";

export type MetricKey =
  | "totalRevenue"
  | "activeUsers"
  | "conversionRate"
  | "monthlyGrowth";

export type Metric = {
  key: MetricKey;
  label: string;
  value: number;
  valueLabel: string;
  changePct: number;
};

export type RevenuePoint = {
  date: string;
  revenue: number;
};

export type UserGrowthPoint = {
  date: string;
  users: number;
};

export type UserSegment = {
  name: string;
  value: number;
};

export type AnalyticsResponse = {
  revenue: RevenuePoint[];
  userGrowth: UserGrowthPoint[];
  segments: UserSegment[];
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  source: "Billing" | "Users" | "Analytics" | "Security";
  createdAt: string;
  read: boolean;
};

export type ActivityEvent = {
  id: string;
  actor: string;
  action: string;
  meta?: string;
  createdAt: string;
};

export type UserRole = "Owner" | "Admin" | "Analyst" | "Support";
export type UserStatus = "Active" | "Suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActiveAt: string;
  createdAt: string;
};

export type UsersQuery = {
  search: string;
  role: UserRole | "All";
  status: UserStatus | "All";
  page: number;
  pageSize: number;
};

export type UsersResponse = {
  users: User[];
  total: number;
};
