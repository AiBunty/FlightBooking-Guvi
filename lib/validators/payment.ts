import { z } from "zod";

export const createCheckoutSchema = z.object({
  bookingId: z.string().min(8),
});
