"use client";

import * as React from "react";
import { NotificationsDrawer } from "@/components/notifications/NotificationsDrawer";
import { Toaster } from "@/components/ui/Toaster";
import { useAppStore } from "@/store/useAppStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const initTheme = useAppStore((s) => s.initTheme);

  React.useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <>
      {children}
      <NotificationsDrawer />
      <Toaster />
    </>
  );
}
