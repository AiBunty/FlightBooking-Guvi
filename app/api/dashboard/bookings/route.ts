import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { AppError } from "@/server/services/errors";
import { getUserBookingHistory } from "@/server/services/booking-service";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const bookings = await getUserBookingHistory(session.user.id);
    return ok({ data: bookings });
  } catch (error) {
    return fail(error);
  }
}
