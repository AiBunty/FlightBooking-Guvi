import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, Sparkles, SunMedium } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlightSearchForm } from "@/features/flights/search-form";
import { HolidayDestinationCarousel } from "@/components/home/holiday-destination-carousel";
import { DummyPhotoGallery } from "@/components/home/dummy-photo-gallery";
import { getDefaultDepartureDate } from "@/features/flights/demo-flight-data";

const defaultDepartureDate = getDefaultDepartureDate(7);

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative px-4 pb-12 pt-8 sm:pt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-linear-to-b from-orange-100/80 via-orange-50/55 to-transparent" />
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Flight booking, simplified
            </div>
            <h1 className="mt-5 max-w-3xl font-[family:var(--font-space-grotesk)] text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Search fast, compare cleanly, and book with a retail travel feel.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Search from a locally cached airport database, see a realistic demo search pass, and keep demo bookings saved in the browser after refresh.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/flights/search">
                <Button className="h-12 px-6 text-base">Start searching</Button>
              </Link>
              <Link href="/bookings/demo">
                <Button variant="secondary" className="h-12 px-6 text-base">
                  View trips
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <QuickSearchChip origin="JFK" destination="LAX" label="New York to Los Angeles" />
              <QuickSearchChip origin="SFO" destination="ORD" label="San Francisco to Chicago" />
              <QuickSearchChip origin="LAX" destination="SFO" label="Los Angeles to San Francisco" />
            </div>
          </div>

          <Card className="overflow-hidden border border-orange-100 bg-white/90 p-0">
            <div className="grid gap-5 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-white sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">Weekend ready</p>
                <h2 className="mt-3 font-[family:var(--font-space-grotesk)] text-3xl font-semibold">Save time on the hunt.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Faster airport lookup, real-photo merchandising, and a demo booking flow that no longer depends on the server database.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">Today&apos;s spotlight</p>
                  <p className="mt-2 text-2xl font-semibold">JFK to LAX</p>
                  <p className="mt-1 text-sm text-slate-300">Generated non-stop demo fares from the cached airport network</p>
                </div>
                <div className="rounded-[24px] bg-white/8 p-4 text-sm text-slate-200 backdrop-blur-sm">
                  Search first, compare second, and finish booking without losing the itinerary on refresh.
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mx-auto mt-8 w-full max-w-7xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Flights</span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">Hotels</span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">Trains</span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">Cabs</span>
          </div>
          <FlightSearchForm />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-orange-100 bg-white/90 p-6">
            <SunMedium className="h-9 w-9 rounded-2xl bg-orange-50 p-2 text-orange-600" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Seasonal picks</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Short-break routes for this week</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Real destination imagery and route-led merchandising instead of abstract art blocks.</p>
          </Card>
          <Card className="border-emerald-100 bg-white/90 p-6">
            <ShieldCheck className="h-9 w-9 rounded-2xl bg-emerald-50 p-2 text-emerald-600" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Demo checkout</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Book without losing state</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Demo checkout stores the itinerary locally, so confirmation persists across reloads without hitting Stripe.</p>
          </Card>
          <Card className="border-sky-100 bg-white/90 p-6">
            <Clock3 className="h-9 w-9 rounded-2xl bg-sky-50 p-2 text-sky-600" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Fast booking</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Less scrolling, faster decisions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Airport suggestions, results, and booking history now share the same client-side demo data flow.</p>
          </Card>
        </div>
      </section>

      <HolidayDestinationCarousel />
      <DummyPhotoGallery />

      <section className="mx-auto mt-14 w-full max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Popular right now</p>
            <h2 className="mt-2 font-[family:var(--font-space-grotesk)] text-3xl font-semibold text-slate-900">Cards that sell the next trip</h2>
          </div>
          <Link href="/flights/search" className="hidden items-center gap-2 text-sm font-semibold text-orange-600 md:flex">
            Explore more routes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Red-eye ready",
              copy: "Late departures with clean result cards and less clutter around fare decisions.",
              tone: "from-orange-500 to-orange-600",
            },
            {
              title: "City switch weekends",
              copy: "Compact one-way search works well for short hops and quick booking intent.",
              tone: "from-slate-900 to-slate-700",
            },
            {
              title: "Premium cabin browsing",
              copy: "Cabin selector and traveller inputs sit inside the same booking shell for faster edits.",
              tone: "from-emerald-500 to-emerald-600",
            },
          ].map((offer) => (
            <Card key={offer.title} className="overflow-hidden border-0 p-0">
              <div className={`h-40 bg-linear-to-br ${offer.tone} p-6 text-white`}>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/75">Featured</p>
                <h3 className="mt-4 font-[family:var(--font-space-grotesk)] text-2xl font-semibold">{offer.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-sm leading-6 text-slate-600">{offer.copy}</p>
                <Link href="/flights/search" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                  Search flights
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-7xl px-4 pb-6">
        <Card className="grid gap-6 border-orange-100 bg-linear-to-r from-orange-50 via-white to-white p-6 lg:grid-cols-[1fr_0.75fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Why this redesign works</p>
            <h2 className="mt-2 font-[family:var(--font-space-grotesk)] text-3xl font-semibold text-slate-900">It behaves more like a travel marketplace and less like a SaaS dashboard.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              The new UI emphasizes the booking intent immediately: route entry, trip type, fare discovery, and quick next actions. That is the part Cleartrip-like interfaces typically get right.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white px-4 py-5 shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">01</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Warmer consumer palette</p>
            </div>
            <div className="rounded-[24px] bg-white px-4 py-5 shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">02</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Search-first home screen</p>
            </div>
            <div className="rounded-[24px] bg-white px-4 py-5 shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">03</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Retail-style result cards</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function QuickSearchChip({
  origin,
  destination,
  label,
}: {
  origin: string;
  destination: string;
  label: string;
}) {
  const params = new URLSearchParams({
    origin,
    destination,
    departureDate: defaultDepartureDate,
    passengers: "1",
    cabinClass: "ECONOMY",
  });

  return (
    <Link
      href={`/flights/results?${params.toString()}`}
      className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
    >
      {label}
    </Link>
  );
}
