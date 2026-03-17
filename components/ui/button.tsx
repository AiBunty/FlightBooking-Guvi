import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-[0_12px_28px_rgb(249,115,22,0.28)] hover:from-orange-600 hover:to-orange-700",
        variant === "secondary" && "bg-orange-50 text-orange-700 hover:bg-orange-100",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-slate-100",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
