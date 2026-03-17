import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { AppError } from "@/server/services/errors";
import { listAdminPayments } from "@/server/repositories/admin-repository";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const payments = await listAdminPayments();
    return ok({ data: payments });
  } catch (error) {
    return fail(error);
  }
}
