"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/app-shell/Sidebar";
import { Topbar } from "@/components/app-shell/Topbar";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";

export function AppShell({ children }: { children: React.ReactNode }) {
  const isOpen = useAppStore((s) => s.isMobileSidebarOpen);
  const close = useAppStore((s) => s.closeMobileSidebar);
  const pathname = usePathname();

  React.useEffect(() => {
    if (isOpen) close();
  }, [pathname, isOpen, close]);

  return (
    <div className="min-h-screen">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <Sidebar className="h-full" />
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={close} />
            <motion.div
              className="absolute inset-y-0 left-0 w-[280px] bg-background shadow-2xl"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="flex items-center justify-end p-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-10 px-0"
                  onClick={close}
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar className="h-[calc(100%-56px)] border-r-0" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="lg:pl-[280px]">
        <Topbar />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
