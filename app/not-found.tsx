import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 text-center">
      <h2 className="text-3xl font-bold text-slate-900">Page not found</h2>
      <p className="mt-3 text-slate-600">The route does not exist or may have moved.</p>
      <Link href="/" className="mt-5 inline-flex rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
        Return home
      </Link>
    </div>
  );
}
