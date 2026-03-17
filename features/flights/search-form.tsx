"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, BriefcaseBusiness, CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DUMMY_LOCATIONS, resolveLocationCode } from "@/features/flights/dummy-flights";

const defaultDepartureDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const defaultReturnDate = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10);

export function FlightSearchForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"round-trip" | "one-way">("round-trip");
  const [origin, setOrigin] = useState("JFK");
  const [destination, setDestination] = useState("LAX");

  function onSubmit(formData: FormData) {
    const resolvedOrigin = resolveLocationCode(origin);
    const resolvedDestination = resolveLocationCode(destination);

    const params = new URLSearchParams({
      origin: resolvedOrigin,
      destination: resolvedDestination,
      departureDate: String(formData.get("departureDate") ?? defaultDepartureDate),
      passengers: String(formData.get("passengers") ?? "1"),
      cabinClass: String(formData.get("cabinClass") ?? "ECONOMY"),
    });

    const returnDate = String(formData.get("returnDate") ?? "");
    if (tripType === "round-trip" && returnDate) {
      params.set("returnDate", returnDate);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("lastFlightSearch", JSON.stringify({ ...Object.fromEntries(params), tripType }));
    }

    router.push(`/flights/results?${params.toString()}`);
  }

  return (
    <Card className="overflow-hidden border border-orange-100 bg-white p-0 shadow-[0_24px_70px_rgb(15,23,42,0.08)]">
      <form action={onSubmit} className="space-y-6 p-4 sm:p-6">
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
                onClick={() => setTripType(option.value as "round-trip" | "one-way")}
                className={
                  tripType === option.value
                    ? "rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgb(249,115,22,0.26)]"
                    : "rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                }
              >
                {option.label}
              </button>
            ))}
            <span className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-400">
              Multi-city soon
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-orange-50 px-3 py-2 text-orange-700">Zero convenience fees</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Instant confirmation</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Demo fares with live flow</span>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_auto_1.2fr_1fr_1fr_0.9fr]">
          <FieldShell label="From" hint="Airport or city" icon={MapPin}>
            <Input
              name="origin"
              placeholder="Origin"
              required
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              list="dummy-locations"
              className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
            />
          </FieldShell>

          <button
            type="button"
            onClick={() => {
              setOrigin(destination);
              setDestination(origin);
            }}
            className="mx-auto hidden h-14 w-14 items-center justify-center self-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600 lg:flex"
            aria-label="Swap origin and destination"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          <FieldShell label="To" hint="Airport or city" icon={MapPin}>
            <Input
              name="destination"
              placeholder="Destination"
              required
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              list="dummy-locations"
              className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
            />
          </FieldShell>

          <FieldShell label="Depart" hint="Choose date" icon={CalendarDays}>
            <Input
              name="departureDate"
              type="date"
              required
              defaultValue={defaultDepartureDate}
              className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
            />
          </FieldShell>

          <FieldShell
            label={tripType === "round-trip" ? "Return" : "Return optional"}
            hint={tripType === "round-trip" ? "Flexible return" : "Add later if needed"}
            icon={CalendarDays}
            muted={tripType === "one-way"}
          >
            <Input
              name="returnDate"
              type="date"
              defaultValue={defaultReturnDate}
              disabled={tripType === "one-way"}
              className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40"
            />
          </FieldShell>

          <FieldShell label="Travellers" hint="Cabin and count" icon={Users}>
            <div className="grid gap-2">
              <Input
                name="passengers"
                type="number"
                min={1}
                max={9}
                defaultValue={1}
                required
                className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
              />
              <select
                name="cabinClass"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                defaultValue="ECONOMY"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>
            </div>
          </FieldShell>
        </div>

        <div className="flex flex-col gap-4 rounded-[28px] bg-slate-50/85 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-slate-700 shadow-sm">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-orange-500" />
              Best for short-haul city breaks
            </span>
            <span className="rounded-full bg-white px-3 py-2 shadow-sm">Book by route, not airline bias</span>
          </div>
          <Button className="h-[52px] px-8 text-base">Search flights</Button>
        </div>
        <datalist id="dummy-locations">
          {DUMMY_LOCATIONS.map((location) => (
            <option key={location.code} value={location.label} />
          ))}
        </datalist>
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
  icon: typeof MapPin;
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
