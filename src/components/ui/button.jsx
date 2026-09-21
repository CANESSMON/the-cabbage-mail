import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-900/30",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-900/30",
        outline:
          "border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-slate-100 text-slate-300",
        secondary:
          "bg-slate-800 text-slate-100 hover:bg-slate-700",
        ghost:
          "hover:bg-slate-800/80 hover:text-slate-100 text-slate-300",
        link: "text-emerald-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
