import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { toErrorResponse } from "@/server/services/errors";

export async function parseBody<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(error: unknown) {
  const parsed = toErrorResponse(error);
  return NextResponse.json(parsed.body, { status: parsed.status });
}
