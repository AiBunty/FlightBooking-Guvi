import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Clock3, Wallet, PlaneTakeoff } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-14">
      <section className="rounded-3xl bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-600 p-6 text-white shadow-xl sm:p-10">
        <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Global booking platform
        </p>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
          Search and book flights with confidence in minutes.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-sky-50 sm:text-base">
          Real-time inventory, secure checkout, and travel-ready dashboards for customers and operators.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/flights/search" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-800">
            Search Flights
          </Link>
          <Link href="/auth/sign-up" className="rounded-xl border border-white/60 px-5 py-3 text-sm font-semibold text-white">
            Create Account
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="space-y-2">
          <PlaneTakeoff className="h-5 w-5 text-sky-700" />
          <h2 className="font-semibold">Extensive Flight Inventory</h2>
          <p className="text-sm text-slate-600">Seeded demo routes with architecture ready for GDS integration.</p>
        </Card>
        <Card className="space-y-2">
          <ShieldCheck className="h-5 w-5 text-sky-700" />
          <h2 className="font-semibold">Secure Checkout</h2>
          <p className="text-sm text-slate-600">Stripe-powered test payments with webhook verification.</p>
        </Card>
        <Card className="space-y-2">
          <Clock3 className="h-5 w-5 text-sky-700" />
          <h2 className="font-semibold">Fast Multi-step Booking</h2>
          <p className="text-sm text-slate-600">Optimized flow for itinerary, passengers, and payment.</p>
        </Card>
        <Card className="space-y-2">
          <Wallet className="h-5 w-5 text-sky-700" />
          <h2 className="font-semibold">Admin Revenue Visibility</h2>
          <p className="text-sm text-slate-600">Track users, bookings, flights, and payment statuses.</p>
        </Card>
      </section>
    </div>
  );
}
