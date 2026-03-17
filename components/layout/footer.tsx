import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/70 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 text-sm text-slate-600 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-[family:var(--font-space-grotesk)] text-lg font-semibold text-slate-900">SkyLedger Trips</p>
          <p className="mt-3 max-w-md">
            Flight search, booking, and trip management in a cleaner retail-style travel interface.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">Zero booking clutter</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Live route discovery</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Explore</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/flights/search" className="transition hover:text-orange-600">
              Search flights
            </Link>
            <Link href="/dashboard/bookings" className="transition hover:text-orange-600">
              Manage bookings
            </Link>
            <Link href="/contact" className="transition hover:text-orange-600">
              Help center
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Confidence</p>
          <div className="mt-3 space-y-3">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Stripe-backed secure checkout
            </p>
            <p className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              Built for quick flight comparison
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 SkyLedger Trips.</p>
          <p>Travel UI refreshed for a cleaner marketplace-style booking flow.</p>
        </div>
      </div>
    </footer>
  );
}
