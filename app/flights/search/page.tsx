import { FlightSearchForm } from "@/features/flights/search-form";
import { Card } from "@/components/ui/card";

export default function FlightSearchPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <Card className="overflow-hidden border-orange-100 bg-linear-to-r from-slate-900 via-slate-900 to-slate-800 p-0 text-white">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">Flight Search</p>
              <h1 className="mt-3 font-[family:var(--font-space-grotesk)] text-4xl font-semibold tracking-tight">Find the right fare without the extra chrome.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Search-first layout, compact controls, and a warmer retail travel style across the booking funnel.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">Round-trip and one-way flows share the same booking shell.</div>
              <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">Result cards are tuned for fast time-and-price comparison.</div>
              <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">Branding and search modules now match the homepage.</div>
            </div>
          </div>
        </Card>

        <div className="-mt-6 px-2 pb-6 sm:px-4">
          <FlightSearchForm />
        </div>
      </div>
    </div>
  );
}
