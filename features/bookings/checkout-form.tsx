"use client";

import { CabinClass } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/features/bookings/booking-store";

export function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const outboundFlightId = params.get("outboundFlightId") ?? "";
  const [loading, setLoading] = useState(false);
  const { step, setStep } = useBookingStore();

  async function onSubmit(formData: FormData) {
    setStep("passenger");
    setLoading(true);

    const payload = {
      outboundFlightId,
      cabinClass: String(formData.get("cabinClass") ?? CabinClass.ECONOMY),
      tripType: "ONE_WAY",
      contactEmail: String(formData.get("contactEmail") ?? ""),
      contactPhone: String(formData.get("contactPhone") ?? ""),
      passengers: [
        {
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
          nationality: String(formData.get("nationality") ?? ""),
          passportNumber: String(formData.get("passportNumber") ?? "") || undefined,
          baggageKg: Number(formData.get("baggageKg") ?? 0),
        },
      ],
    };

    const bookingRes = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!bookingRes.ok) {
      setLoading(false);
      toast.error("Unable to create booking");
      return;
    }

    const bookingData = await bookingRes.json();
    setStep("payment");
    const checkoutRes = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: bookingData.data.id }),
    });

    setLoading(false);

    if (!checkoutRes.ok) {
      toast.error("Unable to start payment");
      return;
    }

    const checkout = await checkoutRes.json();
    if (checkout.data.url) {
      setStep("complete");
      router.push(checkout.data.url);
      return;
    }

    toast.error("Stripe checkout URL unavailable");
  }

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checkout step: {step}</p>
      <h1 className="text-xl font-semibold">Passenger and payment details</h1>
      <form action={onSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
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
          className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <option value="ECONOMY">Economy</option>
          <option value="PREMIUM_ECONOMY">Premium Economy</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">First</option>
        </select>
        <div className="sm:col-span-2">
          <Button className="w-full sm:w-auto" disabled={loading || !outboundFlightId}>
            {loading ? "Processing..." : "Continue to payment"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
