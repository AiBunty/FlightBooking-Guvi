import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_16px_50px_rgb(15,23,42,0.08)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
