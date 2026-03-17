import { sendEmail } from "@/lib/email/provider";

export async function sendBookingConfirmationEmail(to: string, reference: string) {
  await sendEmail({
    to,
    subject: `Booking confirmed: ${reference}`,
    html: `<p>Your booking <strong>${reference}</strong> is confirmed.</p>`,
  });
}

export async function sendPaymentReceiptEmail(to: string, reference: string) {
  await sendEmail({
    to,
    subject: `Payment receipt: ${reference}`,
    html: `<p>Payment received for booking <strong>${reference}</strong>.</p>`,
  });
}

export async function sendCancellationEmail(to: string, reference: string) {
  await sendEmail({
    to,
    subject: `Booking cancelled: ${reference}`,
    html: `<p>Your booking <strong>${reference}</strong> was cancelled.</p>`,
  });
}
