import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "success" | "danger" | "warning";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variant === "default" && "border-border bg-muted text-foreground",
        variant === "success" &&
          "border-emerald-200/60 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200",
        variant === "danger" &&
          "border-rose-200/60 bg-rose-50 text-rose-800 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200",
        variant === "warning" &&
          "border-amber-200/70 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200",
        className,
      )}
      {...props}
    />
  );
}

