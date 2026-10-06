import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 tracking-wider uppercase",
  {
    variants: {
      variant: {
        default:
          "border-slate-200 bg-slate-100 text-slate-950",
        secondary:
          "border-slate-200 bg-slate-50 text-slate-700",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700",
        outline: "text-slate-900 border-slate-300 bg-white",
        warning: "border-amber-200 bg-amber-50 text-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
