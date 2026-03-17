import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/server/services/errors";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true, travelerInfos: true },
    });

    return ok({ data: user });
  } catch (error) {
    return fail(error);
  }
}
