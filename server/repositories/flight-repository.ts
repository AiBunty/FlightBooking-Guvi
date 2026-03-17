import { CabinClass, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function searchFlights(input: {
  origin: string;
  destination: string;
  departureDate: Date;
  cabinClass: CabinClass;
  passengers: number;
}) {
  const start = new Date(input.departureDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(input.departureDate);
  end.setHours(23, 59, 59, 999);

  return prisma.flight.findMany({
    where: {
      origin: { code: input.origin.toUpperCase() },
      destination: { code: input.destination.toUpperCase() },
      departureTime: { gte: start, lte: end },
      cabinClass: input.cabinClass,
      seatsAvailable: { gte: input.passengers },
      status: "SCHEDULED",
    },
    include: {
      airline: true,
      origin: true,
      destination: true,
      aircraft: true,
    },
    orderBy: { departureTime: "asc" },
  });
}

export async function findFlightById(id: string) {
  return prisma.flight.findUnique({
    where: { id },
    include: { airline: true, origin: true, destination: true, aircraft: true },
  });
}

export async function decrementFlightInventory(
  tx: Prisma.TransactionClient,
  flightId: string,
  seats: number,
) {
  const updated = await tx.flight.updateMany({
    where: { id: flightId, seatsAvailable: { gte: seats } },
    data: { seatsAvailable: { decrement: seats } },
  });
  return updated.count > 0;
}
