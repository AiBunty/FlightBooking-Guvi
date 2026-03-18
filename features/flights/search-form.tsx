"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, BriefcaseBusiness, CalendarDays, PlaneTakeoff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/features/bookings/booking-store";
import { AirportAutocomplete } from "@/features/flights/airport-autocomplete";
import {
  CABIN_CLASS_VALUES,
  getDefaultDepartureDate,
  normalizeCabinClass,
  resolveAirportInput,
} from "@/features/flights/demo-flight-data";

const defaultDepartureDate = getDefaultDepartureDate(1);
const defaultReturnDate = getDefaultDepartureDate(4);

export function FlightSearchForm() {
  const router = useRouter();
  const lastSearch = useBookingStore((state) => state.lastSearch);
  const saveSearch = useBookingStore((state) => state.saveSearch);
  const [tripTypeDraft, setTripTypeDraft] = useState<"round-trip" | "one-way" | null>(null);
  const [originDraft, setOriginDraft] = useState<string | null>(null);
  const [destinationDraft, setDestinationDraft] = useState<string | null>(null);
  const [error, setError] = useState("");
  const tripType = tripTypeDraft ?? lastSearch?.tripType ?? "round-trip";
  const origin = originDraft ?? lastSearch?.origin ?? "JFK";
  const destination = destinationDraft ?? lastSearch?.destination ?? "LAX";
  const formDefaultsKey = lastSearch?.searchedAt ?? "default-search";

  function onSubmit(formData: FormData) {
    const resolvedOrigin = resolveAirportInput(origin)?.iata ?? origin.trim().toUpperCase();
    const resolvedDestination = resolveAirportInput(destination)?.iata ?? destination.trim().toUpperCase();
    const departureDate = String(formData.get("departureDate") ?? defaultDepartureDate);
    const returnDate = String(formData.get("returnDate") ?? "");
    const passengers = Number(formData.get("passengers") ?? 1);
    const cabinClass = normalizeCabinClass(String(formData.get("cabinClass") ?? "ECONOMY"));

    if (!resolvedOrigin || !resolvedDestination || resolvedOrigin.length !== 3 || resolvedDestination.length !== 3) {
      setError("Pick both airports from the search suggestions so the route can be generated correctly.");
      return;
    }

    if (resolvedOrigin === resolvedDestination) {
      setError("Origin and destination need to be different airports.");
      return;
    }

    setError("");

    const params = new URLSearchParams({
      origin: resolvedOrigin,
      destination: resolvedDestination,
      departureDate,
      passengers: String(passengers),
      cabinClass,
      tripType,
    });

    if (tripType === "round-trip" && returnDate) {
      params.set("returnDate", returnDate);
    }

    saveSearch({
      origin: resolvedOrigin,
      destination: resolvedDestination,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate || undefined : undefined,
      passengers,
      cabinClass,
      tripType,
    });

    router.push(`/flights/results?${params.toString()}`);
  }

  return (
    <Card className="overflow-visible border border-orange-100 bg-white p-0 shadow-[0_24px_70px_rgb(15,23,42,0.08)]">
      <form key={formDefaultsKey} action={onSubmit} className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "round-trip", label: "Round trip" },
              { value: "one-way", label: "One way" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={tripType === option.value}
                onClick={() => setTripTypeDraft(option.value as "round-trip" | "one-way")}
                className={
                  tripType === option.value
                    ? "rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgb(249,115,22,0.26)]"
                    : "rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                }
              >
                {option.label}
              </button>
            ))}
            <span className="rounded-full border border-dashed border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
              7,913 airports cached locally
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-orange-50 px-3 py-2 text-orange-700">Instant airport suggestions</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Demo fares generated per route</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Bookings saved after refresh</span>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_auto_1.2fr_1fr_1fr_0.9fr]">
          <FieldShell label="From" hint="Search city, code, or airport" icon={PlaneTakeoff}>
            <AirportAutocomplete id="origin" placeholder="Origin airport" value={origin} onChange={setOriginDraft} />
          </FieldShell>

          <button
            type="button"
            onClick={() => {
              setOriginDraft(destination);
              setDestinationDraft(origin);
            }}
            className="mx-auto hidden h-14 w-14 items-center justify-center self-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600 lg:flex"
            aria-label="Swap origin and destination"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          <FieldShell label="To" hint="Any destination in the database" icon={PlaneTakeoff}>
            <AirportAutocomplete id="destination" placeholder="Destination airport" value={destination} onChange={setDestinationDraft} />
          </FieldShell>

          <FieldShell label="Depart" hint="Choose date" icon={CalendarDays}>
            <Input
              name="departureDate"
              type="date"
              required
              defaultValue={lastSearch?.departureDate ?? defaultDepartureDate}
              className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
            />
          </FieldShell>

          <FieldShell
            label={tripType === "round-trip" ? "Return" : "Return optional"}
            hint={tripType === "round-trip" ? "Keep flexible if needed" : "Skip for one-way"}
            icon={CalendarDays}
            muted={tripType === "one-way"}
          >
            <Input
              name="returnDate"
              type="date"
              defaultValue={lastSearch?.returnDate ?? defaultReturnDate}
              disabled={tripType === "one-way"}
              className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40"
            />
          </FieldShell>

          <FieldShell label="Travellers" hint="Passenger count and cabin" icon={Users}>
            <div className="grid gap-2">
              <Input
                name="passengers"
                type="number"
                min={1}
                max={9}
                defaultValue={lastSearch?.passengers ?? 1}
                required
                className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
              />
              <select
                name="cabinClass"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                defaultValue={lastSearch?.cabinClass ?? "ECONOMY"}
              >
                {CABIN_CLASS_VALUES.map((cabinClass) => (
                  <option key={cabinClass} value={cabinClass}>
                    {cabinClass.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </FieldShell>
        </div>

        <div className="flex flex-col gap-4 rounded-[28px] bg-slate-50/85 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-slate-700 shadow-sm">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-orange-500" />
              Route-aware pricing and timing
            </span>
            <span className="rounded-full bg-white px-3 py-2 shadow-sm">Results simulate a real search pass before loading</span>
          </div>
          <Button className="h-[52px] px-8 text-base">Search flights</Button>
        </div>

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      </form>
    </Card>
  );
}

function FieldShell({
  label,
  hint,
  icon: Icon,
  muted = false,
  children,
}: {
  label: string;
  hint: string;
  icon: typeof PlaneTakeoff;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex min-h-[124px] flex-col justify-between rounded-[28px] border px-4 py-4 transition focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100 ${
        muted ? "border-slate-200 bg-slate-50/60 opacity-75" : "border-slate-200 bg-slate-50/90 hover:border-slate-300"
      }`}
    >
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        <Icon className="h-3.5 w-3.5 text-orange-500" />
        {label}
      </span>
      {children}
      <span className="text-xs text-slate-500">{hint}</span>
    </label>
  );
}
