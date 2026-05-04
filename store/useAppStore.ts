import { create } from "zustand";
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
} from "@/lib/types";
import {
  deleteUser,
  getActivityLog,
  getAnalytics,
  getNotifications,
  getOverview,
  getUsers,
  updateUser,
} from "@/lib/mockApi";

type ThemeMode = "light" | "dark";

type ToastVariant = "default" | "success" | "danger";

export type Toast = {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
};

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const defaultUsersQuery: UsersQuery = {
  search: "",
  role: "All",
  status: "All",
  page: 1,
  pageSize: 8,
};

type AppState = {
  theme: ThemeMode;
  isMobileSidebarOpen: boolean;
  timeRange: TimeRange;

  overviewMetrics: Metric[] | null;
  analytics: AnalyticsResponse | null;
  activity: ActivityEvent[] | null;

  notifications: Notification[];
  isNotificationsOpen: boolean;

  users: User[];
  usersTotal: number;
  usersQuery: UsersQuery;

  editingUserId: string | null;
  deletingUserId: string | null;

  toasts: Toast[];

  loading: {
    overview: boolean;
    analytics: boolean;
    activity: boolean;
    notifications: boolean;
    users: boolean;
    userMutation: boolean;
  };

  initTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;

  setTimeRange: (range: TimeRange) => void;
  loadOverview: (range?: TimeRange) => Promise<void>;
  loadAnalytics: (range?: TimeRange) => Promise<void>;
  loadActivity: (range?: TimeRange) => Promise<void>;
  loadNotifications: () => Promise<void>;
  openNotifications: () => void;
  closeNotifications: () => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  loadUsers: (partial?: Partial<UsersQuery>) => Promise<void>;

  setUsersSearch: (search: string) => void;
  setUsersRole: (role: UserRole | "All") => void;
  setUsersStatus: (status: UserStatus | "All") => void;
  setUsersPage: (page: number) => void;
  resetUsersFilters: () => void;

  openEditUser: (id: string) => void;
  closeEditUser: () => void;
  openDeleteUser: (id: string) => void;
  closeDeleteUser: () => void;

  saveUserEdits: (input: { id: string; name: string; role: UserRole; status: UserStatus }) => Promise<void>;
  confirmDeleteUser: (id: string) => Promise<void>;

  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  theme: "light",
  isMobileSidebarOpen: false,
  timeRange: "30d",

  overviewMetrics: null,
  analytics: null,
  activity: null,

  notifications: [],
  isNotificationsOpen: false,

  users: [],
  usersTotal: 0,
  usersQuery: defaultUsersQuery,

  editingUserId: null,
  deletingUserId: null,

  toasts: [],

  loading: {
    overview: false,
    analytics: false,
    activity: false,
    notifications: false,
    users: false,
    userMutation: false,
  },

  initTheme: () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("insightflow.theme");
    const mode = stored === "dark" ? "dark" : "light";
    set({ theme: mode });
    document.documentElement.classList.toggle("dark", mode === "dark");
  },

  setTheme: (mode) => {
    set({ theme: mode });
    if (typeof window === "undefined") return;
    window.localStorage.setItem("insightflow.theme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  },

  toggleTheme: () => {
    const current = get().theme;
    get().setTheme(current === "dark" ? "light" : "dark");
  },

  openMobileSidebar: () => set({ isMobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),

  setTimeRange: (range) => {
    set({ timeRange: range });
    void get().loadOverview(range);
    void get().loadAnalytics(range);
    void get().loadActivity(range);
  },

  loadOverview: async (range) => {
    const r = range ?? get().timeRange;
    set((s) => ({ loading: { ...s.loading, overview: true } }));
    try {
      const res = await getOverview(r);
      set({ overviewMetrics: res.metrics });
    } finally {
      set((s) => ({ loading: { ...s.loading, overview: false } }));
    }
  },

  loadAnalytics: async (range) => {
    const r = range ?? get().timeRange;
    set((s) => ({ loading: { ...s.loading, analytics: true } }));
    try {
      const res = await getAnalytics(r);
      set({ analytics: res });
    } finally {
      set((s) => ({ loading: { ...s.loading, analytics: false } }));
    }
  },

  loadActivity: async (range) => {
    const r = range ?? get().timeRange;
    set((s) => ({ loading: { ...s.loading, activity: true } }));
    try {
      const res = await getActivityLog(r);
      set({ activity: res });
    } finally {
      set((s) => ({ loading: { ...s.loading, activity: false } }));
    }
  },

  loadNotifications: async () => {
    set((s) => ({ loading: { ...s.loading, notifications: true } }));
    try {
      const res = await getNotifications();
      set({ notifications: res });
    } finally {
      set((s) => ({ loading: { ...s.loading, notifications: false } }));
    }
  },

  openNotifications: () => set({ isNotificationsOpen: true }),
  closeNotifications: () => set({ isNotificationsOpen: false }),
  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  loadUsers: async (partial) => {
    const q: UsersQuery = { ...get().usersQuery, ...(partial ?? {}) };
    set({ usersQuery: q });
    set((s) => ({ loading: { ...s.loading, users: true } }));
    try {
      const res = await getUsers(q);
      set({ users: res.users, usersTotal: res.total });
    } finally {
      set((s) => ({ loading: { ...s.loading, users: false } }));
    }
  },

  setUsersSearch: (search) => {
    set((s) => ({ usersQuery: { ...s.usersQuery, search, page: 1 } }));
  },
  setUsersRole: (role) => {
    set((s) => ({ usersQuery: { ...s.usersQuery, role, page: 1 } }));
  },
  setUsersStatus: (status) => {
    set((s) => ({ usersQuery: { ...s.usersQuery, status, page: 1 } }));
  },
  setUsersPage: (page) => set((s) => ({ usersQuery: { ...s.usersQuery, page } })),
  resetUsersFilters: () => set({ usersQuery: defaultUsersQuery }),

  openEditUser: (id) => set({ editingUserId: id }),
  closeEditUser: () => set({ editingUserId: null }),
  openDeleteUser: (id) => set({ deletingUserId: id }),
  closeDeleteUser: () => set({ deletingUserId: null }),

  saveUserEdits: async (input) => {
    set((s) => ({ loading: { ...s.loading, userMutation: true } }));
    try {
      const updated = await updateUser(input);
      set((s) => ({
        users: s.users.map((u) => (u.id === updated.id ? updated : u)),
        editingUserId: null,
      }));
      get().pushToast({
        title: "User updated",
        message: `${updated.name} was saved successfully.`,
        variant: "success",
      });
    } catch (e) {
      get().pushToast({
        title: "Update failed",
        message: e instanceof Error ? e.message : "Unable to update user.",
        variant: "danger",
      });
    } finally {
      set((s) => ({ loading: { ...s.loading, userMutation: false } }));
    }
  },

  confirmDeleteUser: async (id) => {
    set((s) => ({ loading: { ...s.loading, userMutation: true } }));
    try {
      await deleteUser(id);
      const { usersQuery, usersTotal } = get();
      const nextTotal = Math.max(0, usersTotal - 1);
      const maxPage = Math.max(1, Math.ceil(nextTotal / usersQuery.pageSize));
      const nextPage = Math.min(usersQuery.page, maxPage);
      set({ deletingUserId: null, usersTotal: nextTotal, usersQuery: { ...usersQuery, page: nextPage } });
      await get().loadUsers({ page: nextPage });
      get().pushToast({
        title: "User deleted",
        message: "The account has been removed.",
        variant: "default",
      });
    } catch (e) {
      get().pushToast({
        title: "Delete failed",
        message: e instanceof Error ? e.message : "Unable to delete user.",
        variant: "danger",
      });
    } finally {
      set((s) => ({ loading: { ...s.loading, userMutation: false } }));
    }
  },

  pushToast: (toast) => {
    const id = uid();
    set((s) => ({ toasts: [{ id, ...toast }, ...s.toasts].slice(0, 4) }));
    globalThis.setTimeout?.(() => get().dismissToast(id), 4200);
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));
