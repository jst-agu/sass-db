"use client";

import { UsersTable } from "@/components/users/UsersTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage roles, status, and access across your team.
        </p>
      </div>

      <UsersTable />
    </div>
  );
}

