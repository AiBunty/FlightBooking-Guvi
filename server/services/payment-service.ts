import { BookingStatus, PaymentStatus } from "@prisma/client";
import { getStripeClient } from "@/lib/stripe/server";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/server/services/errors";

export async function createCheckoutSession(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      outboundFlight: { include: { origin: true, destination: true } },
      payments: true,
    },
  });

  if (!booking) {
    throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
  }

  if (booking.status !== BookingStatus.PENDING) {
    throw new AppError("Booking is not payable", 400, "INVALID_BOOKING_STATUS");
  }

  const amount = Math.round(Number(booking.totalPrice) * 100);

  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${process.env.NEXTAUTH_URL}/bookings/confirmation/${booking.reference}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/bookings/checkout?bookingId=${booking.id}`,
    customer_email: booking.contactEmail,
    metadata: {
      bookingId: booking.id,
      reference: booking.reference,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: booking.currency.toLowerCase(),
          unit_amount: amount,
          product_data: {
            name: `Flight booking ${booking.reference}`,
            description: `${booking.outboundFlight.origin.code} to ${booking.outboundFlight.destination.code}`,
          },
        },
      },
    ],
  });

  const payment = booking.payments[0];
  if (!payment) {
    throw new AppError("Payment record missing", 500, "PAYMENT_RECORD_MISSING");
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      status: PaymentStatus.PENDING,
    },
  });

  return session;
}
