import Link from "next/link";
import { Headphones, Plane, ReceiptText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#fffaf5]/80 backdrop-blur-xl">
      <div className="border-b border-orange-100/80 bg-white/55">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs font-medium text-slate-600">
          <p className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            Fare drops refreshed daily for flexible travelers
          </p>
          <p className="hidden items-center gap-2 sm:flex">
            <Headphones className="h-3.5 w-3.5 text-orange-500" />
            24x7 booking support
          </p>
        </div>
      </div>
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3 text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-[0_10px_24px_rgb(249,115,22,0.3)]">
            <Plane className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-[family:var(--font-space-grotesk)] text-lg font-semibold tracking-tight">SkyLedger</span>
            <span className="block text-xs text-slate-500">Flights and weekend escapes</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 lg:flex">
          <Link href="/flights/search" className="transition hover:text-orange-600">
            Flights
          </Link>
          <Link href="/" className="transition hover:text-orange-600">
            Offers
          </Link>
          <Link href="/dashboard/bookings" className="transition hover:text-orange-600">
            My Trips
          </Link>
          <Link href="/contact" className="transition hover:text-orange-600">
            Support
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden sm:block">
            <Button variant="ghost" className="px-4 text-slate-700">
              <ReceiptText className="mr-2 h-4 w-4" />
              Trips
            </Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button className="px-5">Sign in</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
