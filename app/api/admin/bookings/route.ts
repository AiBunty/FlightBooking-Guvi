import { prisma } from "@/lib/db/prisma";
import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { AppError } from "@/server/services/errors";
import { listAdminBookings } from "@/server/repositories/admin-repository";
import { writeAuditLog } from "@/server/services/audit";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const bookings = await listAdminBookings();
    return ok({ data: bookings });
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const booking = await prisma.booking.update({
      where: { id: body.id },
      data: { status: body.status, notes: body.notes },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "ADMIN_BOOKING_UPDATED",
      entity: "Booking",
      entityId: booking.id,
      metadata: body,
    });

    return ok({ data: booking });
  } catch (error) {
    return fail(error);
  }
}
