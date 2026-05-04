"use client";

import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export function DeleteUserDialog({ user }: { user: User | null }) {
  const open = useAppStore((s) => Boolean(s.deletingUserId));
  const close = useAppStore((s) => s.closeDeleteUser);
  const confirmDelete = useAppStore((s) => s.confirmDeleteUser);
  const deleting = useAppStore((s) => s.loading.userMutation);

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : close())}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Delete user</DialogTitle>
              <DialogDescription>
                This action can’t be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 pt-4 text-sm text-muted-foreground">
          {user ? (
            <>
              You’re about to permanently remove <span className="font-semibold text-foreground">{user.name}</span>{" "}
              (<span className="font-mono text-xs">{user.email}</span>) from your workspace.
            </>
          ) : (
            "You’re about to permanently remove this user from your workspace."
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={close} disabled={deleting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              if (!user) return;
              void confirmDelete(user.id);
            }}
            disabled={!user || deleting}
          >
            {deleting ? "Deleting…" : "Delete user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

