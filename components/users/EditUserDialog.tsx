"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/Select";
import type { User, UserRole, UserStatus } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

const roles: UserRole[] = ["Owner", "Admin", "Analyst", "Support"];
const statuses: UserStatus[] = ["Active", "Suspended"];

export function EditUserDialog({ user }: { user: User | null }) {
  const open = useAppStore((s) => Boolean(s.editingUserId));
  const close = useAppStore((s) => s.closeEditUser);
  const save = useAppStore((s) => s.saveUserEdits);
  const saving = useAppStore((s) => s.loading.userMutation);

  const [name, setName] = React.useState(() => user?.name ?? "");
  const [role, setRole] = React.useState<UserRole>(() => user?.role ?? "Analyst");
  const [status, setStatus] = React.useState<UserStatus>(() => user?.status ?? "Active");

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update the user’s name, role, and status. Changes apply immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 pb-1 pt-4">
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <div className="text-sm font-medium">Name</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid gap-1.5">
              <div className="text-sm font-medium">Role</div>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger />
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <div className="text-sm font-medium">Status</div>
              <Select value={status} onValueChange={(v) => setStatus(v as UserStatus)}>
                <SelectTrigger />
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={close} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              if (!user) return;
              void save({ id: user.id, name, role, status });
            }}
            disabled={!user || name.trim().length < 2 || saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
