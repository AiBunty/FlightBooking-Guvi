import Link from "next/link";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  cta,
  href,
}: {
  title: string;
  description: string;
  cta?: string;
  href?: string;
}) {
  return (
    <Card className="text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {cta && href && (
        <Link href={href} className="mt-4 inline-flex rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
          {cta}
        </Link>
      )}
    </Card>
  );
}
