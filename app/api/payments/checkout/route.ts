import { fail, ok, parseBody } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { createCheckoutSchema } from "@/lib/validators/payment";
import { AppError } from "@/server/services/errors";
import { createCheckoutSession } from "@/server/services/payment-service";
import { rateLimit } from "@/server/services/rate-limit";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const ip = request.headers.get("x-forwarded-for") ?? session.user.id;
    const rl = rateLimit(`payment:${ip}`, 8, 60_000);
    if (!rl.allowed) {
      throw new AppError("Too many requests", 429, "RATE_LIMITED");
    }

    const input = await parseBody(request, createCheckoutSchema);
    const checkout = await createCheckoutSession(input.bookingId);

    return ok({ data: { id: checkout.id, url: checkout.url } });
  } catch (error) {
    return fail(error);
  }
}
