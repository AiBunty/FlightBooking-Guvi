import { CabinClass } from "@prisma/client";
import { z } from "zod";

export const flightSearchSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  passengers: z.coerce.number().int().min(1).max(9),
  cabinClass: z.nativeEnum(CabinClass).default(CabinClass.ECONOMY),
});
