"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays, Filter, LoaderCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingStore } from "@/features/bookings/booking-store";
import {
  formatAirportLabel,
  generateDemoFlights,
  getAirportByCode,
  normalizeCabinClass,
  type DemoFlight,
  type DemoTripType,
} from "@/features/flights/demo-flight-data";
import { ResultCard } from "@/features/flights/result-card";

type FlightQuery = {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  cabinClass: ReturnType<typeof normalizeCabinClass>;
  returnDate?: string;
  tripType: DemoTripType;
};

export default function ClientResults() {
  const searchParams = useSearchParams();
  const saveSearch = useBookingStore((state) => state.saveSearch);
  const query = useMemo<FlightQuery>(() => {
    return {
      origin: (searchParams.get("origin") ?? "").toUpperCase(),
      destination: (searchParams.get("destination") ?? "").toUpperCase(),
      departureDate: searchParams.get("departureDate") ?? "",
      passengers: Number(searchParams.get("passengers") ?? "1"),
      cabinClass: normalizeCabinClass(searchParams.get("cabinClass")),
      returnDate: searchParams.get("returnDate") ?? undefined,
      tripType: (searchParams.get("tripType") as DemoTripType | null) ?? "one-way",
    };
  }, [searchParams]);

  const isQueryReady = Boolean(query.origin && query.destination && query.departureDate);
  const [flights, setFlights] = useState<DemoFlight[]>([]);
  const [resolvedQueryKey, setResolvedQueryKey] = useState("");
  const queryKey = useMemo(() => JSON.stringify(query), [query]);

  useEffect(() => {
    if (!isQueryReady) {
      return;
    }

    saveSearch(query);

    const timer = window.setTimeout(() => {
      setFlights(
        generateDemoFlights({
          origin: query.origin,
          destination: query.destination,
          departureDate: query.departureDate,
          passengers: query.passengers,
          cabinClass: query.cabinClass,
        }),
      );
      setResolvedQueryKey(queryKey);
    }, 850);

    return () => window.clearTimeout(timer);
  }, [isQueryReady, query, queryKey, saveSearch]);

  const originAirport = getAirportByCode(query.origin);
  const destinationAirport = getAirportByCode(query.destination);
  const visibleFlights = isQueryReady ? flights : [];
  const showLoading = isQueryReady ? resolvedQueryKey !== queryKey : false;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <Card className="overflow-hidden border-orange-100 bg-white/90 p-0">
        <div className="grid gap-5 bg-linear-to-r from-slate-900 via-slate-900 to-slate-800 p-6 text-white lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">Live-feel demo search</p>
            <h1 className="mt-3 font-[family:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight sm:text-4xl">
              {originAirport ? formatAirportLabel(originAirport) : query.origin || "Anywhere"} to{" "}
              {destinationAirport ? formatAirportLabel(destinationAirport) : query.destination || "Anywhere"}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <CalendarDays className="h-3.5 w-3.5 text-orange-200" />
                Depart {formatDateLabel(query.departureDate)}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <Users className="h-3.5 w-3.5 text-orange-200" />
                {query.passengers} traveller{query.passengers === 1 ? "" : "s"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2">{query.cabinClass.replaceAll("_", " ")}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/flights/search">
              <Button className="w-full justify-center">Modify search</Button>
            </Link>
            <div className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm">
              Airport matches come from the imported local database, so route lookup stays available after refresh.
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm">
          {showLoading ? <LoaderCircle className="h-4 w-4 animate-spin text-orange-500" /> : <Filter className="h-4 w-4 text-orange-500" />}
          {showLoading ? "Searching demo inventory" : "Sorted for clean comparison"}
        </span>
        <span className="rounded-full bg-orange-50 px-4 py-2 font-semibold text-orange-700">Immediate airport lookup</span>
        <span className="rounded-full bg-white px-4 py-2 font-semibold text-slate-600 shadow-sm">Bookings stay in local cache</span>
      </div>

      <div className="mt-6 space-y-4">
        {showLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-slate-200/80 p-5">
              <div className="grid gap-5 lg:grid-cols-[0.95fr_1.55fr_0.9fr]">
                <div className="space-y-3">
                  <Skeleton className="h-12 w-44" />
                  <Skeleton className="h-6 w-36" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-52" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
            </Card>
          ))
        ) : visibleFlights.length === 0 ? (
          <EmptyState
            title="No demo flights found"
            description="Try a different date or change either airport. The route builder only creates itineraries for valid airport pairs."
            cta="Search again"
            href="/flights/search"
          />
        ) : (
          visibleFlights.map((flight) => <ResultCard key={flight.id} flight={flight} />)
        )}
      </div>

      <Card className="mt-8 flex flex-col gap-3 border-orange-100 bg-linear-to-r from-orange-50 via-white to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Demo mode stays local</p>
          <p className="mt-1 text-sm text-slate-600">Pick a flight, continue into checkout, and the confirmation will still be there after a reload.</p>
        </div>
        <Link href="/flights/search" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
          Refine search
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  );
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
