"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useBookingStore } from "@/features/bookings/booking-store";
import { formatCurrency } from "@/lib/utils";

export default function DemoBookingsPage() {
  const bookings = useBookingStore((state) => state.bookings);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Demo bookings</p>
        <h1 className="mt-2 font-[family:var(--font-space-grotesk)] text-3xl font-semibold text-slate-900">
          Trips stored in local browser cache
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          These bookings come from the demo checkout flow and stay on this device after refresh until the browser storage is cleared.
        </p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No demo trips saved yet"
          description="Complete a booking from the search results to see it listed here."
          cta="Search flights"
          href="/flights/search"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-slate-200/80">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{booking.reference}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {booking.flight.origin.city} to {booking.flight.destination.city}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {booking.flight.airline.name} • {booking.flight.flightNumber} • {booking.flight.cabinClass.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(booking.flight.departureTime).toLocaleString([], {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <Badge label={booking.status} tone="good" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    {formatCurrency(booking.totalPrice, booking.currency)}
                  </p>
                  <Link href={`/bookings/confirmation/${booking.reference}`} className="mt-3 inline-block text-sm font-semibold text-orange-700">
                    Open confirmation
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
