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
              <h1 className="mt-3 font-[family:var(--font-space-grotesk)] text-4xl font-semibold tracking-tight">Search the cached airport network without waiting on the backend.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Type a city, airport name, or IATA code and the demo route engine will generate results and booking flow from local cache.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">Airport suggestions come from the imported local database.</div>
              <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">Results simulate a live search pass before rendering.</div>
              <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">Bookings and recent searches stay cached after refresh.</div>
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
