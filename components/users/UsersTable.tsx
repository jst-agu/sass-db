"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Download, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { cn } from "@/lib/cn";
import { downloadCsv, usersToCsv } from "@/lib/csv";
import { formatDateShort } from "@/lib/format";
import type { UserRole, UserStatus } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

const roles: Array<UserRole | "All"> = ["All", "Owner", "Admin", "Analyst", "Support"];
const statuses: Array<UserStatus | "All"> = ["All", "Active", "Suspended"];

export function UsersTable() {
  const users = useAppStore((s) => s.users);
  const total = useAppStore((s) => s.usersTotal);
  const query = useAppStore((s) => s.usersQuery);
  const loading = useAppStore((s) => s.loading.users);
  const loadUsers = useAppStore((s) => s.loadUsers);

  const setUsersSearch = useAppStore((s) => s.setUsersSearch);
  const setUsersRole = useAppStore((s) => s.setUsersRole);
  const setUsersStatus = useAppStore((s) => s.setUsersStatus);
  const setUsersPage = useAppStore((s) => s.setUsersPage);
  const resetUsersFilters = useAppStore((s) => s.resetUsersFilters);

  const openEdit = useAppStore((s) => s.openEditUser);
  const openDelete = useAppStore((s) => s.openDeleteUser);
  const editingId = useAppStore((s) => s.editingUserId);
  const deletingId = useAppStore((s) => s.deletingUserId);

  const [search, setSearch] = React.useState(query.search);

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      setUsersSearch(search);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [search, setUsersSearch]);

  React.useEffect(() => {
    void loadUsers();
  }, [
    query.search,
    query.role,
    query.status,
    query.page,
    query.pageSize,
    loadUsers,
  ]);

  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const page = query.page;

  const editingUser = editingId ? users.find((u) => u.id === editingId) ?? null : null;
  const deletingUser = deletingId ? users.find((u) => u.id === deletingId) ?? null : null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <div className="mt-1 text-sm text-muted-foreground">
              Search, filter, and manage your workspace accounts.
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={() => downloadCsv("insightflow-users.csv", usersToCsv(users))}
              disabled={users.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="sm:max-w-md"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select value={query.role} onValueChange={(v) => setUsersRole(v as UserRole | "All")}>
                  <SelectTrigger className="min-w-44" />
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r === "All" ? "All roles" : r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={query.status} onValueChange={(v) => setUsersStatus(v as UserStatus | "All")}>
                  <SelectTrigger className="min-w-44" />
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "All" ? "All statuses" : s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearch("");
                resetUsersFilters();
              }}
            >
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[1.3fr_1.6fr_0.7fr_0.7fr_0.8fr] items-center gap-3 bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-border bg-card">
              {loading
                ? Array.from({ length: query.pageSize }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1.3fr_1.6fr_0.7fr_0.7fr_0.8fr] items-center gap-3 px-4 py-3"
                    >
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-9 w-20 rounded-xl" />
                        <Skeleton className="h-9 w-20 rounded-xl" />
                      </div>
                    </div>
                  ))
                : users.length === 0
                  ? (
                      <div className="px-4 py-10 text-center">
                        <div className="text-sm font-semibold tracking-tight">No users found</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Try adjusting your search or filters.
                        </div>
                      </div>
                    )
                  : users.map((u) => (
                      <div
                        key={u.id}
                        className={cn(
                          "grid grid-cols-[1.3fr_1.6fr_0.7fr_0.7fr_0.8fr] items-center gap-3 px-4 py-3",
                          "hover:bg-muted/40",
                        )}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold tracking-tight">{u.name}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            Last active {formatDateShort(u.lastActiveAt)}
                          </div>
                        </div>
                        <div className="truncate text-sm text-muted-foreground">{u.email}</div>
                        <div className="text-sm text-foreground">{u.role}</div>
                        <div>
                          <Badge variant={u.status === "Active" ? "success" : "danger"}>
                            {u.status}
                          </Badge>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(u.id)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-danger hover:text-danger"
                            onClick={() => openDelete(u.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {(page - 1) * query.pageSize + (users.length === 0 ? 0 : 1)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {(page - 1) * query.pageSize + users.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">{total}</span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setUsersPage(Math.max(1, page - 1))}
                disabled={page <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="text-sm text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                <span className="font-semibold text-foreground">{pageCount}</span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setUsersPage(Math.min(pageCount, page + 1))}
                disabled={page >= pageCount || loading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditUserDialog key={editingUser?.id ?? "edit"} user={editingUser} />
      <DeleteUserDialog user={deletingUser} />
    </>
  );
}
