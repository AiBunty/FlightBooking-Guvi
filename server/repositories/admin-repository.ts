import { prisma } from "@/lib/db/prisma";

export async function adminMetrics() {
  const [users, bookings, flights, payments] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.flight.count(),
    prisma.payment.count({ where: { status: "SUCCEEDED" } }),
  ]);

  return { users, bookings, flights, successfulPayments: payments };
}

export async function listAdminFlights() {
  return prisma.flight.findMany({
    include: { airline: true, origin: true, destination: true },
    orderBy: { departureTime: "asc" },
    take: 100,
  });
}

export async function listAdminBookings() {
  return prisma.booking.findMany({
    include: {
      user: true,
      outboundFlight: { include: { origin: true, destination: true } },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function listAdminUsers() {
  return prisma.user.findMany({
    include: { bookings: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function listAdminPayments() {
  return prisma.payment.findMany({
    include: { booking: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
