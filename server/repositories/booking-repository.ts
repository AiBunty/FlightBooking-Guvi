import { BookingStatus, CabinClass, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function createPendingBooking(input: {
  userId: string;
  outboundFlightId: string;
  returnFlightId?: string;
  tripType: string;
  cabinClass: CabinClass;
  passengerCount: number;
  contactEmail: string;
  contactPhone: string;
  totalPrice: number;
  currency: string;
  reference: string;
  promoCodeId?: string;
  passengers: Array<{
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    nationality: string;
    passportNumber?: string;
    baggageKg: number;
  }>;
}) {
  return prisma.booking.create({
    data: {
      userId: input.userId,
      outboundFlightId: input.outboundFlightId,
      returnFlightId: input.returnFlightId,
      tripType: input.tripType,
      cabinClass: input.cabinClass,
      passengerCount: input.passengerCount,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      totalPrice: input.totalPrice,
      currency: input.currency,
      reference: input.reference,
      promoCodeId: input.promoCodeId,
      status: BookingStatus.PENDING,
      passengers: {
        create: input.passengers,
      },
      payments: {
        create: {
          amount: input.totalPrice,
          currency: input.currency,
          status: "PENDING",
        },
      },
    },
    include: {
      outboundFlight: { include: { airline: true, origin: true, destination: true } },
      returnFlight: { include: { airline: true, origin: true, destination: true } },
      passengers: true,
      payments: true,
    },
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      outboundFlight: { include: { airline: true, origin: true, destination: true } },
      returnFlight: { include: { airline: true, origin: true, destination: true } },
      passengers: true,
      tickets: true,
      payments: true,
      refunds: true,
    },
  });
}

export async function updateBookingStatus(
  tx: Prisma.TransactionClient,
  bookingId: string,
  status: BookingStatus,
) {
  return tx.booking.update({ where: { id: bookingId }, data: { status } });
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      outboundFlight: { include: { airline: true, origin: true, destination: true } },
      returnFlight: { include: { airline: true, origin: true, destination: true } },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
