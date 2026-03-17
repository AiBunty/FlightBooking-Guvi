"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DUMMY_LOCATIONS, resolveLocationCode } from "@/features/flights/dummy-flights";

const defaultDepartureDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export function FlightSearchForm() {
  const router = useRouter();

  function onSubmit(formData: FormData) {
    const origin = resolveLocationCode(String(formData.get("origin") ?? ""));
    const destination = resolveLocationCode(String(formData.get("destination") ?? ""));

    const params = new URLSearchParams({
      origin,
      destination,
      departureDate: String(formData.get("departureDate") ?? defaultDepartureDate),
      passengers: String(formData.get("passengers") ?? "1"),
      cabinClass: String(formData.get("cabinClass") ?? "ECONOMY"),
    });

    const returnDate = String(formData.get("returnDate") ?? "");
    if (returnDate) {
      params.set("returnDate", returnDate);
    }

    // Save last search to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("lastFlightSearch", JSON.stringify(Object.fromEntries(params)));
    }

    router.push(`/flights/results?${params.toString()}`);
  }

  return (
    <Card>
      <form action={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Input
          name="origin"
          placeholder="Origin (e.g. New York or JFK)"
          required
          defaultValue="JFK"
          list="dummy-locations"
        />
        <Input
          name="destination"
          placeholder="Destination (e.g. Los Angeles or LAX)"
          required
          defaultValue="LAX"
          list="dummy-locations"
        />
        <Input name="departureDate" type="date" required defaultValue={defaultDepartureDate} />
        <Input name="returnDate" type="date" />
        <Input name="passengers" type="number" min={1} max={9} defaultValue={1} required />
        <select
          name="cabinClass"
          className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <option value="ECONOMY">Economy</option>
          <option value="PREMIUM_ECONOMY">Premium Economy</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">First</option>
        </select>
        <div className="sm:col-span-2 lg:col-span-6">
          <Button className="w-full sm:w-auto">Find flights</Button>
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
