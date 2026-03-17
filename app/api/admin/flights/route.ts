import { prisma } from "@/lib/db/prisma";
import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { AppError } from "@/server/services/errors";
import { listAdminFlights } from "@/server/repositories/admin-repository";
import { writeAuditLog } from "@/server/services/audit";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const flights = await listAdminFlights();
    return ok({ data: flights });
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
    const flight = await prisma.flight.update({
      where: { id: body.id },
      data: {
        status: body.status,
        seatsAvailable: typeof body.seatsAvailable === "number" ? body.seatsAvailable : undefined,
        price: typeof body.price === "number" ? body.price : undefined,
      },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "ADMIN_FLIGHT_UPDATED",
      entity: "Flight",
      entityId: flight.id,
      metadata: body,
    });

    return ok({ data: flight });
  } catch (error) {
    return fail(error);
  }
}
