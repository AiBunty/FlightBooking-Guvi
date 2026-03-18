"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/features/bookings/booking-store";
import {
  CABIN_CLASS_VALUES,
  getDemoFlightById,
  normalizeCabinClass,
} from "@/features/flights/demo-flight-data";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const outboundFlightId = params.get("outboundFlightId") ?? "";
  const flight = useMemo(() => getDemoFlightById(outboundFlightId), [outboundFlightId]);
  const [loading, setLoading] = useState(false);
  const { step, setStep, createDemoBooking } = useBookingStore();

  async function onSubmit(formData: FormData) {
    if (!flight) {
      toast.error("This demo itinerary is unavailable.");
      return;
    }

    setLoading(true);
    setStep("passenger");

    const passengers = [
      {
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
        nationality: String(formData.get("nationality") ?? ""),
        passportNumber: String(formData.get("passportNumber") ?? "") || undefined,
        baggageKg: Number(formData.get("baggageKg") ?? 0),
      },
    ];

    const cabinClass = normalizeCabinClass(String(formData.get("cabinClass") ?? flight.cabinClass));
    const contactEmail = String(formData.get("contactEmail") ?? "");
    const contactPhone = String(formData.get("contactPhone") ?? "");

    await delay(350);
    setStep("payment");
    await delay(650);

    const booking = createDemoBooking({
      flight: {
        ...flight,
        cabinClass,
        price: Math.round(flight.price * getCabinMultiplier(cabinClass)),
      },
      cabinClass,
      tripType: "ONE_WAY",
      passengers,
      contactEmail,
      contactPhone,
    });

    setLoading(false);
    toast.success("Demo booking saved in local cache");
    router.push(`/bookings/confirmation/${booking.reference}`);
  }

  if (!flight) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-slate-900">Demo flight unavailable</h1>
        <p className="mt-3 text-sm text-slate-600">Open a flight from the results page first so checkout has an itinerary to save locally.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-slate-200/80">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checkout step: {step}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Passenger details for demo booking</h1>
        <p className="mt-2 text-sm text-slate-600">
          No real payment happens here. Submitting the form stores the itinerary, traveller data, and confirmation in browser storage.
        </p>

        <form action={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
          <Input name="firstName" placeholder="First name" required />
          <Input name="lastName" placeholder="Last name" required />
          <Input name="dateOfBirth" type="date" required />
          <Input name="nationality" placeholder="Nationality" required />
          <Input name="passportNumber" placeholder="Passport number" />
          <Input name="baggageKg" type="number" min={0} max={40} defaultValue={15} required />
          <Input name="contactEmail" type="email" placeholder="Contact email" required />
          <Input name="contactPhone" placeholder="Contact phone" required />
          <select
            name="cabinClass"
            defaultValue={flight.cabinClass}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {CABIN_CLASS_VALUES.map((cabinClass) => (
              <option key={cabinClass} value={cabinClass}>
                {cabinClass.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <div className="sm:col-span-2">
            <Button className="w-full sm:w-auto" disabled={loading}>
              {loading ? "Saving demo booking..." : "Confirm demo booking"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="border-orange-100 bg-linear-to-b from-orange-50 to-white">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
          <ShieldCheck className="h-4 w-4" />
          Demo summary
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          {flight.origin.city} to {flight.destination.city}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {flight.airline.name} • {flight.flightNumber} • {flight.aircraft.model}
        </p>
        <div className="mt-5 space-y-3 rounded-[24px] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">Departure</span>
            <span className="font-semibold text-slate-900">
              {new Date(flight.departureTime).toLocaleString([], {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">Arrival</span>
            <span className="font-semibold text-slate-900">
              {new Date(flight.arrivalTime).toLocaleString([], {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">Fare</span>
            <span className="font-semibold text-slate-900">{formatCurrency(flight.price, flight.currency)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getCabinMultiplier(cabinClass: ReturnType<typeof normalizeCabinClass>) {
  return (
    {
      ECONOMY: 1,
      PREMIUM_ECONOMY: 1.28,
      BUSINESS: 2.1,
      FIRST: 3.05,
    }[cabinClass] ?? 1
  );
}
