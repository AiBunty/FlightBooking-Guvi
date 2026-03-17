"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ResultCard } from "@/features/flights/result-card";
import { EmptyState } from "@/components/ui/empty-state";
import { DUMMY_FLIGHTS } from "@/features/flights/dummy-flights";

type FlightQuery = {
  origin?: string;
  destination?: string;
  departureDate?: string;
  passengers?: string;
  cabinClass?: string;
  returnDate?: string;
};

function filterFlights(query: FlightQuery) {
  // Simple filter: match origin, destination, and date
  return DUMMY_FLIGHTS.filter((f) => {
    if (
      query.origin && f.origin.code.toUpperCase() !== query.origin.toUpperCase()
    )
      return false;
    if (
      query.destination && f.destination.code.toUpperCase() !== query.destination.toUpperCase()
    )
      return false;
    if (query.departureDate) {
      const flightDate = f.departureTime.slice(0, 10);
      if (flightDate !== query.departureDate) return false;
    }
    return true;
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
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Available Flights (Demo)</h1>
      <div className="space-y-3">
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
    </div>
  );
}
