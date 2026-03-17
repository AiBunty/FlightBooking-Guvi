export function Skeleton({ className = "h-5 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}
