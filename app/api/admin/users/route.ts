import { prisma } from "@/lib/db/prisma";
import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { AppError } from "@/server/services/errors";
import { listAdminUsers } from "@/server/repositories/admin-repository";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const users = await listAdminUsers();
    return ok({ data: users });
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
    const user = await prisma.user.update({
      where: { id: body.id },
      data: { role: body.role, isActive: body.isActive },
    });

    return ok({ data: user });
  } catch (error) {
    return fail(error);
  }
}
