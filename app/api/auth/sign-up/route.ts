import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { parseBody, ok, fail } from "@/lib/api";
import { signUpSchema } from "@/lib/validators/auth";
import { AppError } from "@/server/services/errors";
import { rateLimit } from "@/server/services/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rl = rateLimit(`signup:${ip}`, 10, 60_000);
    if (!rl.allowed) {
      throw new AppError("Too many requests", 429, "RATE_LIMITED");
    }

    const input = await parseBody(request, signUpSchema);

    const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (existing) {
      throw new AppError("User already exists", 409, "USER_EXISTS");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: "CUSTOMER",
      },
    });

    return ok({ id: user.id, email: user.email }, 201);
  } catch (error) {
    return fail(error);
  }
}
