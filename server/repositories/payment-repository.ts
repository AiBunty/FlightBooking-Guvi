import { PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function updatePaymentIntent(
  paymentId: string,
  stripePaymentIntentId: string,
  stripeCheckoutSessionId: string,
) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      stripePaymentIntentId,
      stripeCheckoutSessionId,
      status: PaymentStatus.PENDING,
    },
  });
}

export async function markPaymentSucceeded(
  tx: Prisma.TransactionClient,
  paymentIntentId: string,
) {
  return tx.payment.update({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { status: PaymentStatus.SUCCEEDED, paidAt: new Date() },
    include: { booking: true },
  });
}

export async function markPaymentFailed(paymentIntentId: string, reason?: string) {
  return prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { status: PaymentStatus.FAILED, failureReason: reason },
  });
}

export async function getPaymentByBookingId(bookingId: string) {
  return prisma.payment.findFirst({ where: { bookingId } });
}
