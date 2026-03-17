import { CabinClass } from "@prisma/client";
import { z } from "zod";

export const bookingPassengerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  nationality: z.string().min(2),
  passportNumber: z.string().optional(),
  baggageKg: z.number().int().min(0).max(40).default(0),
});

export const createBookingSchema = z.object({
  outboundFlightId: z.string().min(8),
  returnFlightId: z.string().optional(),
  cabinClass: z.nativeEnum(CabinClass),
  passengers: z.array(bookingPassengerSchema).min(1).max(9),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7),
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP"]),
  promoCode: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(3).max(200),
});
