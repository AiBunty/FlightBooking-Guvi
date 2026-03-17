import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15,23,42,0.06)]",
        className,
      )}
      {...props}
    />
  );
}
