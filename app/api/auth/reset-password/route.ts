import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { parseBody, ok, fail } from "@/lib/api";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { AppError } from "@/server/services/errors";

export async function POST(request: Request) {
  try {
    const input = await parseBody(request, resetPasswordSchema);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: input.token },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new AppError("Invalid or expired token", 400, "INVALID_TOKEN");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);

    return ok({ message: "Password reset successful" });
  } catch (error) {
    return fail(error);
  }
}
