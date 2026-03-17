import { flightSearchSchema } from "@/lib/validators/flights";
import { ok, fail } from "@/lib/api";
import { searchFlights } from "@/server/repositories/flight-repository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = flightSearchSchema.parse({
      origin: searchParams.get("origin"),
      destination: searchParams.get("destination"),
      departureDate: searchParams.get("departureDate"),
      returnDate: searchParams.get("returnDate") ?? undefined,
      passengers: searchParams.get("passengers") ?? "1",
      cabinClass: searchParams.get("cabinClass") ?? "ECONOMY",
    });

    const flights = await searchFlights({
      origin: input.origin,
      destination: input.destination,
      departureDate: new Date(input.departureDate),
      cabinClass: input.cabinClass,
      passengers: input.passengers,
    });

    return ok({ data: flights });
  } catch (error) {
    return fail(error);
  }
}
