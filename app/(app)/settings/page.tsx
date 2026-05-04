"use client";

import { Bell, Shield, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preferences, security, and workspace configuration.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold tracking-tight">Theme</div>
                  <div className="text-sm text-muted-foreground">
                    Current: {theme === "dark" ? "Dark" : "Light"}
                  </div>
                </div>
              </div>
              <Button variant="secondary" onClick={toggleTheme}>
                Toggle
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold tracking-tight">Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive product updates and alerts.
                  </div>
                </div>
              </div>
              <Button variant="secondary">Manage</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
              <Shield className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold tracking-tight">Access</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Roles enforce least-privilege access across your workspace.
                </div>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              Review audit log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

