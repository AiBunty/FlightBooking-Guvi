import { randomUUID } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { parseBody, ok, fail } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { sendEmail } from "@/lib/email/provider";
import { rateLimit } from "@/server/services/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rl = rateLimit(`forgot-password:${ip}`, 10, 60_000);
    if (!rl.allowed) {
      return ok({ message: "If the account exists, reset instructions will be sent." });
    }

    const input = await parseBody(request, forgotPasswordSchema);
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });

    if (user) {
      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
      });
    }

    return ok({ message: "If the account exists, reset instructions will be sent." });
  } catch (error) {
    return fail(error);
  }
}
