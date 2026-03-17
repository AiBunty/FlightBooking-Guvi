import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type AuditInput = {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export async function writeAuditLog(input: AuditInput) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  });
}
