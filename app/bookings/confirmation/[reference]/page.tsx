"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useBookingStore } from "@/features/bookings/booking-store";
import { formatCurrency } from "@/lib/utils";

export default function BookingConfirmationPage() {
  const params = useParams<{ reference: string }>();
  const reference = String(params.reference ?? "");
  const booking = useBookingStore((state) => state.bookings.find((entry) => entry.reference === reference));

  if (!booking) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <EmptyState
          title="Booking not found in local cache"
          description="This confirmation page now reads from browser storage. Complete a demo booking again if this device cache was cleared."
          cta="Search flights"
          href="/flights/search"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Card className="border-orange-100 bg-linear-to-b from-orange-50 to-white">
        <h1 className="text-2xl font-bold text-slate-900">Demo booking confirmed</h1>
        <p className="mt-2 text-slate-600">Reference: {booking.reference}</p>
        <div className="mt-3">
          <Badge label={booking.status} tone="good" />
        </div>
        <div className="mt-6 grid gap-3 rounded-[24px] bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-700">
            Itinerary: {booking.flight.origin.iata} to {booking.flight.destination.iata}
          </p>
          <p className="text-sm text-slate-700">
            Passenger: {booking.passengers[0]?.firstName} {booking.passengers[0]?.lastName}
          </p>
          <p className="text-sm text-slate-700">Contact: {booking.contactEmail}</p>
          <p className="text-sm font-semibold text-slate-900">
            Total paid in demo mode: {formatCurrency(booking.totalPrice, booking.currency)}
          </p>
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-600">
          This confirmation is stored in local browser cache, so it stays available after refresh on the same device.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/flights/search" className="text-sm font-semibold text-orange-700">
            Book another demo flight
          </Link>
          <Link href={`/flights/${booking.flight.id}`} className="text-sm font-semibold text-slate-700">
            Reopen itinerary
          </Link>
        </div>
      </Card>
    </div>
  );
}
