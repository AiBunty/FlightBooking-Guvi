import { BookingStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { generateBookingReference } from "@/lib/utils";
import {
  createPendingBooking,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
} from "@/server/repositories/booking-repository";
import { decrementFlightInventory, findFlightById } from "@/server/repositories/flight-repository";
import { AppError } from "@/server/services/errors";
import { writeAuditLog } from "@/server/services/audit";

export async function createBookingForUser(input: {
  userId: string;
  outboundFlightId: string;
  returnFlightId?: string;
  tripType: "ONE_WAY" | "ROUND_TRIP";
  passengers: Array<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber?: string;
    baggageKg: number;
  }>;
  contactEmail: string;
  contactPhone: string;
  cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
}) {
  const outbound = await findFlightById(input.outboundFlightId);
  if (!outbound || outbound.status !== "SCHEDULED") {
    throw new AppError("Outbound flight is unavailable", 404, "FLIGHT_UNAVAILABLE");
  }

  if (outbound.seatsAvailable < input.passengers.length) {
    throw new AppError("Not enough seats available", 409, "SEAT_LIMIT");
  }

  let totalPrice = Number(outbound.price);

  if (input.returnFlightId) {
    const ret = await findFlightById(input.returnFlightId);
    if (!ret || ret.status !== "SCHEDULED") {
      throw new AppError("Return flight is unavailable", 404, "RETURN_FLIGHT_UNAVAILABLE");
    }
    totalPrice += Number(ret.price);
  }

  totalPrice *= input.passengers.length;

  const booking = await createPendingBooking({
    userId: input.userId,
    outboundFlightId: input.outboundFlightId,
    returnFlightId: input.returnFlightId,
    tripType: input.tripType,
    cabinClass: input.cabinClass,
    passengerCount: input.passengers.length,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    totalPrice,
    currency: outbound.currency,
    reference: generateBookingReference(),
    passengers: input.passengers.map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      dateOfBirth: new Date(p.dateOfBirth),
      nationality: p.nationality,
      passportNumber: p.passportNumber,
      baggageKg: p.baggageKg,
    })),
  });

  await writeAuditLog({
    userId: input.userId,
    action: "BOOKING_CREATED",
    entity: "Booking",
    entityId: booking.id,
  });

  return booking;
}

export async function confirmBookingAfterPayment(paymentIntentId: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { booking: true },
    });

    if (!payment) {
      throw new AppError("Payment record not found", 404, "PAYMENT_NOT_FOUND");
    }

    if (payment.status === PaymentStatus.SUCCEEDED && payment.booking.status === BookingStatus.CONFIRMED) {
      return payment.booking;
    }

    const booking = await tx.booking.findUnique({
      where: { id: payment.bookingId },
      include: { passengers: true },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    const seatCount = booking.passengerCount;
    const outboundOk = await decrementFlightInventory(tx, booking.outboundFlightId, seatCount);
    if (!outboundOk) {
      throw new AppError("Inventory changed, unable to confirm booking", 409, "INVENTORY_CONFLICT");
    }

    if (booking.returnFlightId) {
      const returnOk = await decrementFlightInventory(tx, booking.returnFlightId, seatCount);
      if (!returnOk) {
        throw new AppError("Return flight inventory changed", 409, "INVENTORY_CONFLICT");
      }
    }

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCEEDED, paidAt: new Date() },
    });

    const confirmed = await updateBookingStatus(tx, booking.id, BookingStatus.CONFIRMED);

    const passengers = await tx.bookingPassenger.findMany({ where: { bookingId: booking.id } });

    for (const p of passengers) {
      await tx.ticket.create({
        data: {
          bookingId: booking.id,
          passengerId: p.id,
          ticketNumber: `TKT-${booking.reference}-${p.lastName.slice(0, 2).toUpperCase()}`,
          issueDate: new Date(),
        },
      });
    }

    return confirmed;
  });
}

export async function failBookingPayment(bookingId: string, reason?: string) {
  return prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: { bookingId },
      data: { status: PaymentStatus.FAILED, failureReason: reason },
    });

    return updateBookingStatus(tx, bookingId, BookingStatus.FAILED);
  });
}

export async function cancelBookingForUser(userId: string, bookingId: string, reason: string) {
  const booking = await getBookingById(bookingId);

  if (!booking || booking.userId !== userId) {
    throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
  }

  if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.PENDING) {
    throw new AppError("Booking cannot be cancelled", 400, "INVALID_STATE");
  }

  const cancelled = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason,
      cancelledAt: new Date(),
    },
  });

  await writeAuditLog({
    userId,
    action: "BOOKING_CANCELLED",
    entity: "Booking",
    entityId: bookingId,
    metadata: { reason },
  });

  return cancelled;
}

export async function getUserBookingHistory(userId: string) {
  return getUserBookings(userId);
}

export async function getUserBookingById(userId: string, bookingId: string) {
  const booking = await getBookingById(bookingId);
  if (!booking || booking.userId !== userId) {
    throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
  }
  return booking;
}
