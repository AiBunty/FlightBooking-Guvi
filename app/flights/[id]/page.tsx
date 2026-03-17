import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function FlightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const flight = await prisma.flight.findUnique({
    where: { id },
    include: { airline: true, origin: true, destination: true, aircraft: true },
  });

  if (!flight) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">
          {flight.origin.code} to {flight.destination.code}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {flight.airline.name} • {flight.flightNumber} • {flight.aircraft.model}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Departure: {new Date(flight.departureTime).toLocaleString()} | Arrival: {new Date(flight.arrivalTime).toLocaleString()}
        </p>
        <p className="mt-3 text-xl font-semibold">{formatCurrency(Number(flight.price), flight.currency)}</p>
        <p className="mt-1 text-sm text-slate-600">{flight.seatsAvailable} seats remaining</p>
        <Link href={`/bookings/checkout?outboundFlightId=${flight.id}`}>
          <Button className="mt-5">Book this flight</Button>
        </Link>
      </Card>
    </div>
  );
}
