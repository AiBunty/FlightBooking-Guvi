import { cn } from "@/lib/utils";

export function Badge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "good" | "warn" | "bad" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-slate-100 text-slate-700",
        tone === "good" && "bg-emerald-100 text-emerald-700",
        tone === "warn" && "bg-amber-100 text-amber-700",
        tone === "bad" && "bg-rose-100 text-rose-700",
      )}
    >
      {label}
    </span>
  );
}
