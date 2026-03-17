import { fail, ok, parseBody } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { cancelBookingSchema } from "@/lib/validators/booking";
import { AppError } from "@/server/services/errors";
import { cancelBookingForUser } from "@/server/services/booking-service";
import { sendCancellationEmail } from "@/server/services/email-service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const input = await parseBody(request, cancelBookingSchema);
    const booking = await cancelBookingForUser(session.user.id, id, input.reason);
    await sendCancellationEmail(booking.contactEmail, booking.reference);
    return ok({ data: booking });
  } catch (error) {
    return fail(error);
  }
}
