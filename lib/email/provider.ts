import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const smtpTransport = process.env.EMAIL_SERVER
  ? nodemailer.createTransport(process.env.EMAIL_SERVER)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const from = process.env.EMAIL_FROM ?? "no-reply@flightbooking.local";

  if (resend) {
    await resend.emails.send({ from, to, subject, html });
    return;
  }

  if (smtpTransport) {
    await smtpTransport.sendMail({ from, to, subject, html });
    return;
  }

  console.log("[email-fallback]", { to, subject });
}
