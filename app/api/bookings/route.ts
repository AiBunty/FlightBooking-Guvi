import { createBookingSchema } from "@/lib/validators/booking";
import { fail, ok, parseBody } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { AppError } from "@/server/services/errors";
import { createBookingForUser } from "@/server/services/booking-service";
import { rateLimit } from "@/server/services/rate-limit";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const ip = request.headers.get("x-forwarded-for") ?? session.user.id;
    const rl = rateLimit(`booking:${ip}`, 10, 60_000);
    if (!rl.allowed) {
      throw new AppError("Too many requests", 429, "RATE_LIMITED");
    }

    const input = await parseBody(request, createBookingSchema);

    const booking = await createBookingForUser({
      userId: session.user.id,
      outboundFlightId: input.outboundFlightId,
      returnFlightId: input.returnFlightId,
      tripType: input.tripType,
      passengers: input.passengers,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      cabinClass: input.cabinClass,
    });

    return ok({ data: booking }, 201);
  } catch (error) {
    return fail(error);
  }
}
