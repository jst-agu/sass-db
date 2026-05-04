"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

export function Toaster() {
  const toasts = useAppStore((s) => s.toasts);
  const dismissToast = useAppStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 sm:justify-end">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "pointer-events-auto rounded-2xl border border-border bg-card shadow-lg",
                t.variant === "success" && "border-emerald-200/60 dark:border-emerald-400/25",
                t.variant === "danger" && "border-rose-200/60 dark:border-rose-400/25",
              )}
            >
              <div className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold tracking-tight">{t.title}</div>
                  {t.message ? (
                    <div className="mt-1 text-sm text-muted-foreground">{t.message}</div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(t.id)}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

