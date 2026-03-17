import { describe, expect, it } from "vitest";
import { createBookingSchema } from "@/lib/validators/booking";
import { flightSearchSchema } from "@/lib/validators/flights";

describe("validators", () => {
  it("accepts valid flight search", () => {
    const parsed = flightSearchSchema.parse({
      origin: "JFK",
      destination: "LAX",
      departureDate: "2026-06-20",
      passengers: 1,
      cabinClass: "ECONOMY",
    });
    expect(parsed.origin).toBe("JFK");
  });

  it("rejects invalid booking", () => {
    const result = createBookingSchema.safeParse({
      outboundFlightId: "abc",
      cabinClass: "ECONOMY",
      passengers: [],
      contactEmail: "bad-email",
      contactPhone: "1",
      tripType: "ONE_WAY",
    });

    expect(result.success).toBe(false);
  });
});
