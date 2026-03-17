import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { AppError } from "@/server/services/errors";
import { getUserBookingById } from "@/server/services/booking-service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const booking = await getUserBookingById(session.user.id, id);
    return ok({ data: booking });
  } catch (error) {
    return fail(error);
  }
}
