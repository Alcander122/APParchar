import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default:
        "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20",
      secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
      outline:
        "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100",
      ghost: "hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100",
      destructive: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-2xl px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
