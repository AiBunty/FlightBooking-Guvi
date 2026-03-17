import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/server";
import { fail, ok } from "@/lib/api";
import { confirmBookingAfterPayment, failBookingPayment } from "@/server/services/booking-service";
import { sendBookingConfirmationEmail, sendPaymentReceiptEmail } from "@/server/services/email-service";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return ok({ received: true });
    }

    const body = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (typeof session.payment_intent === "string") {
        const booking = await confirmBookingAfterPayment(session.payment_intent);
        await sendBookingConfirmationEmail(booking.contactEmail, booking.reference);
        await sendPaymentReceiptEmail(booking.contactEmail, booking.reference);
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const bookingId = (intent.metadata?.bookingId ?? "").toString();
      if (bookingId) {
        await failBookingPayment(bookingId, intent.last_payment_error?.message);
      }
    }

    return ok({ received: true });
  } catch (error) {
    return fail(error);
  }
}
