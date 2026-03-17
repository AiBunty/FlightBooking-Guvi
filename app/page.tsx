

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock3, Wallet, PlaneTakeoff } from "lucide-react";
import Image from "next/image";
import { FlightSearchForm } from "@/features/flights/search-form";

export default function Home() {
  return (
    <div className="relative isolate min-h-[90vh] w-full overflow-x-hidden bg-slate-50">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-10 pb-24 sm:pt-20 sm:pb-32">
        {/* Background image overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-60" style={{backgroundBlendMode:'multiply'}} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-900/80 via-sky-800/70 to-cyan-700/60" />

        <p className="mb-4 mt-4 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-sm backdrop-blur-sm">
          Book your next adventure
        </p>
        <h1 className="max-w-3xl text-center text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-6xl">
          Effortless Flight Booking<br className="hidden sm:inline" /> for Modern Travelers
        </h1>
        <p className="mt-6 max-w-xl text-center text-base text-sky-100 sm:text-lg">
          Discover, compare, and book flights worldwide. Enjoy seamless checkout, real-time updates, and a dashboard built for you.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/flights/search">
            <Button className="h-12 w-44 text-lg shadow-xl transition hover:scale-105 hover:bg-sky-700">
              Search Flights
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="secondary" className="h-12 w-44 text-lg border border-white/60 bg-white/80 text-sky-800 shadow-xl transition hover:scale-105 hover:bg-white">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Dummy flight images row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Image src="/dummy-flight.svg" alt="Flight 1" width={120} height={120} className="rounded-2xl shadow-md bg-white/80" />
          <Image src="/dummy-flight.svg" alt="Flight 2" width={120} height={120} className="rounded-2xl shadow-md bg-white/80" />
          <Image src="/dummy-flight.svg" alt="Flight 3" width={120} height={120} className="rounded-2xl shadow-md bg-white/80" />
        </div>

        {/* Dummy search suggestions */}
        <div className="mx-auto mt-12 w-full max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800 shadow">
            <span className="mr-2 text-slate-500">Popular searches:</span>
            <DummySearchButton origin="JFK" destination="LAX" label="New York → Los Angeles" />
            <DummySearchButton origin="SFO" destination="ORD" label="San Francisco → Chicago" />
            <DummySearchButton origin="LAX" destination="SFO" label="Los Angeles → San Francisco" />
          </div>
          <div className="rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur-lg">
            <FlightSearchForm />
          </div>
        </div>
      // DummySearchButton component for quick search
      "use client";
      import { useRouter } from "next/navigation";
      function DummySearchButton({ origin, destination, label }: { origin: string; destination: string; label: string }) {
        const router = useRouter();
        return (
          <button
            type="button"
            className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-200 transition"
            onClick={() => {
              const params = new URLSearchParams({
                origin,
                destination,
                departureDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
                passengers: "1",
                cabinClass: "ECONOMY",
              });
              router.push(`/flights/results?${params.toString()}`);
            }}
          >
            {label}
          </button>
        );
      }
      </section>

      {/* Feature Highlights */}
      <section className="relative z-10 mx-auto -mt-20 w-full max-w-6xl px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group flex flex-col items-center space-y-3 border-0 bg-gradient-to-br from-white/90 to-sky-50 p-7 shadow-xl transition hover:scale-105 hover:shadow-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 group-hover:bg-sky-200 transition"><PlaneTakeoff className="h-7 w-7 text-sky-700" /></span>
            <h2 className="text-lg font-semibold text-slate-900">Extensive Inventory</h2>
            <p className="text-center text-sm text-slate-600">Thousands of routes, real-time availability, and global coverage.</p>
          </Card>
          <Card className="group flex flex-col items-center space-y-3 border-0 bg-gradient-to-br from-white/90 to-sky-50 p-7 shadow-xl transition hover:scale-105 hover:shadow-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition"><ShieldCheck className="h-7 w-7 text-emerald-700" /></span>
            <h2 className="text-lg font-semibold text-slate-900">Secure Payments</h2>
            <p className="text-center text-sm text-slate-600">Stripe-powered checkout, fraud protection, and instant confirmation.</p>
          </Card>
          <Card className="group flex flex-col items-center space-y-3 border-0 bg-gradient-to-br from-white/90 to-sky-50 p-7 shadow-xl transition hover:scale-105 hover:shadow-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 group-hover:bg-cyan-200 transition"><Clock3 className="h-7 w-7 text-cyan-700" /></span>
            <h2 className="text-lg font-semibold text-slate-900">Lightning Fast</h2>
            <p className="text-center text-sm text-slate-600">Book in minutes with our streamlined, multi-step booking flow.</p>
          </Card>
          <Card className="group flex flex-col items-center space-y-3 border-0 bg-gradient-to-br from-white/90 to-sky-50 p-7 shadow-xl transition hover:scale-105 hover:shadow-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 group-hover:bg-amber-200 transition"><Wallet className="h-7 w-7 text-amber-700" /></span>
            <h2 className="text-lg font-semibold text-slate-900">Travel Dashboard</h2>
            <p className="text-center text-sm text-slate-600">Manage bookings, get notifications, and access support anytime.</p>
          </Card>
        </div>
      </section>

      {/* Decorative bottom wave */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-32 w-full bg-gradient-to-t from-sky-100/80 to-transparent" />
    </div>
  );
}
