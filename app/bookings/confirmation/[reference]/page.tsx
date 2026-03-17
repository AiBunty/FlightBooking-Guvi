import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { outboundFlight: { include: { origin: true, destination: true } }, payments: true },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Booking Confirmation</h1>
        <p className="mt-2 text-slate-600">Reference: {booking.reference}</p>
        <div className="mt-3">
          <Badge label={booking.status} tone={booking.status === "CONFIRMED" ? "good" : "warn"} />
        </div>
        <p className="mt-4 text-sm text-slate-700">
          Itinerary: {booking.outboundFlight.origin.code} to {booking.outboundFlight.destination.code}
        </p>
      </Card>
    </div>
  );
}
