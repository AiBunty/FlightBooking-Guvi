"use client";

import { useEffect, useState } from "react";
import { ResultCard } from "@/features/flights/result-card";
import { EmptyState } from "@/components/ui/empty-state";
import { DUMMY_FLIGHTS } from "@/features/flights/dummy-flights";

function filterFlights(query) {
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
  const [flights, setFlights] = useState([]);
  const [query, setQuery] = useState({});

  useEffect(() => {
    // Get last search from localStorage or URL
    let params;
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      params = Object.fromEntries(url.searchParams.entries());
      setQuery(params);
      localStorage.setItem("lastFlightSearch", JSON.stringify(params));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      setFlights(filterFlights(query));
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
