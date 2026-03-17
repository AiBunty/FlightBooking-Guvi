export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
    public code = "BAD_REQUEST",
  ) {
    super(message);
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: { error: error.message, code: error.code },
    };
  }

  return {
    status: 500,
    body: { error: "Internal server error", code: "INTERNAL_ERROR" },
  };
}
