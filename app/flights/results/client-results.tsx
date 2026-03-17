"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays, Filter, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/features/flights/result-card";
import { EmptyState } from "@/components/ui/empty-state";
import { DUMMY_FLIGHTS, DUMMY_LOCATIONS, matchesLocationQuery } from "@/features/flights/dummy-flights";

type FlightQuery = {
  origin?: string;
  destination?: string;
  departureDate?: string;
  passengers?: string;
  cabinClass?: string;
  returnDate?: string;
};

function filterFlights(query: FlightQuery) {
  return DUMMY_FLIGHTS.filter((flight) => {
    if (!matchesLocationQuery(query.origin, flight.origin)) {
      return false;
    }
    if (!matchesLocationQuery(query.destination, flight.destination)) {
      return false;
    }
    if (query.departureDate) {
      const flightDate = flight.departureTime.slice(0, 10);
      if (flightDate !== query.departureDate) {
        return false;
      }
    }
    return true;
  });
}

function getLocationLabel(code: string | undefined) {
  if (!code) {
    return "Anywhere";
  }

  const location = DUMMY_LOCATIONS.find((item) => item.code.toLowerCase() === code.toLowerCase());
  return location ? `${location.city} (${location.code})` : code.toUpperCase();
}

function formatDateLabel(value: string | undefined) {
  if (!value) {
    return "Flexible";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function ClientResults() {
  const searchParams = useSearchParams();
  const query: FlightQuery = Object.fromEntries(searchParams.entries());
  const flights = filterFlights(query);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lastFlightSearch", JSON.stringify(query));
    }
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <Card className="overflow-hidden border-orange-100 bg-white/90 p-0">
        <div className="grid gap-5 bg-linear-to-r from-slate-900 via-slate-900 to-slate-800 p-6 text-white lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">Available flights</p>
            <h1 className="mt-3 font-[family:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight sm:text-4xl">
              {getLocationLabel(query.origin)} to {getLocationLabel(query.destination)}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <CalendarDays className="h-3.5 w-3.5 text-orange-200" />
                Depart {formatDateLabel(query.departureDate)}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <Users className="h-3.5 w-3.5 text-orange-200" />
                {query.passengers ?? "1"} traveller
                {query.passengers === "1" ? "" : "s"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2">{query.cabinClass?.replaceAll("_", " ") ?? "ECONOMY"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/flights/search">
              <Button className="w-full justify-center">Modify search</Button>
            </Link>
            <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">
              {flights.length} demo option{flights.length === 1 ? "" : "s"} found for this route.
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm">
          <Filter className="h-4 w-4 text-orange-500" />
          Sorted for clean comparison
        </span>
        <span className="rounded-full bg-orange-50 px-4 py-2 font-semibold text-orange-700">Direct route focus</span>
        <span className="rounded-full bg-white px-4 py-2 font-semibold text-slate-600 shadow-sm">Fast fare and timing scan</span>
      </div>

      <div className="mt-6 space-y-4">
        {flights.length === 0 ? (
          <EmptyState
            title="No flights found"
            description="Try different dates or nearby airports."
            cta="Search again"
            href="/flights/search"
          />
        ) : (
          flights.map((flight) => <ResultCard key={flight.id} flight={flight} />)
        )}
      </div>

      <Card className="mt-8 flex flex-col gap-3 border-orange-100 bg-linear-to-r from-orange-50 via-white to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Need a different route?</p>
          <p className="mt-1 text-sm text-slate-600">Jump back into the redesigned search shell and update city, date, or cabin in one place.</p>
        </div>
        <Link href="/flights/search" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
          Refine search
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  );
}
