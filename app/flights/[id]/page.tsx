import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAirportPhotoUrl,
  getDefaultDepartureDate,
  getDemoFlightById,
} from "@/features/flights/demo-flight-data";
import { formatCurrency } from "@/lib/utils";

export default async function FlightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const flight = getDemoFlightById(id);

  if (!flight) {
    notFound();
  }

  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);
  const durationHours = Math.floor(flight.durationMinutes / 60);
  const durationMinutes = flight.durationMinutes % 60;
  const nextSearchDate = getDefaultDepartureDate(2);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="relative h-72 overflow-hidden sm:h-96">
          <Image
            src={getAirportPhotoUrl(`${flight.destination.iata}-detail`, 1440, 960)}
            alt={flight.destination.city}
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">Demo itinerary</p>
            <h1 className="mt-2 font-[family:var(--font-space-grotesk)] text-4xl font-semibold">
              {flight.origin.city} to {flight.destination.city}
            </h1>
            <p className="mt-2 text-sm text-slate-200">
              {flight.airline.name} • {flight.flightNumber} • {flight.aircraft.model}
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <Card className="border-slate-200/80 bg-slate-50/70">
              <div className="flex flex-wrap items-center gap-3">
                <Badge label={flight.cabinClass.replaceAll("_", " ")} tone="neutral" />
                <Badge label="Demo mode" tone="warn" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Departure</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {departure.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{flight.origin.iata}</p>
                  <p className="text-sm text-slate-500">{flight.origin.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Duration</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {durationHours}h {durationMinutes}m
                  </p>
                  <p className="mt-1 text-sm text-slate-600">Non-stop demo service</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Arrival</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{flight.destination.iata}</p>
                  <p className="text-sm text-slate-500">{flight.destination.name}</p>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200/80">
              <h2 className="text-lg font-semibold text-slate-900">Why this route exists in demo mode</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The app now builds itinerary options from the imported airport database instead of relying on a tiny seeded table. Search, flight details, and checkout all use the same deterministic route generator.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Route search is cached locally, and the booking confirmation will stay available after refresh because the checkout stores the completed itinerary in browser storage.
              </p>
            </Card>
          </div>

          <Card className="border-orange-100 bg-linear-to-b from-orange-50 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Final fare</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(flight.price, flight.currency)}
            </p>
            <p className="mt-2 text-sm text-slate-600">{flight.seatsAvailable} seats left in demo inventory</p>
            <Link href={`/bookings/checkout?outboundFlightId=${flight.id}`} className="mt-5 block">
              <Button className="w-full">Book in demo mode</Button>
            </Link>
            <Link
              href={`/flights/results?origin=${flight.origin.iata}&destination=${flight.destination.iata}&departureDate=${nextSearchDate}&passengers=1&cabinClass=${flight.cabinClass}&tripType=one-way`}
              className="mt-3 block"
            >
              <Button variant="secondary" className="w-full">
                Search similar flights
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
