import Link from "next/link";
import { Plane } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <Plane className="h-5 w-5 text-sky-600" /> SkyLedger
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-700">
          <Link href="/flights/search" className="hover:text-sky-700">
            Search
          </Link>
          <Link href="/dashboard" className="hover:text-sky-700">
            Dashboard
          </Link>
          <Link href="/admin" className="hover:text-sky-700">
            Admin
          </Link>
          <Link href="/auth/sign-in" className="rounded-full bg-slate-900 px-4 py-2 text-white">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
