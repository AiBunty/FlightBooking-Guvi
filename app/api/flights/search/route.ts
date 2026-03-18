import { flightSearchSchema } from "@/lib/validators/flights";
import { ok, fail } from "@/lib/api";
import { generateDemoFlights, normalizeCabinClass, resolveAirportInput } from "@/features/flights/demo-flight-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resolvedOrigin = resolveAirportInput(searchParams.get("origin") ?? "")?.iata ?? searchParams.get("origin");
    const resolvedDestination =
      resolveAirportInput(searchParams.get("destination") ?? "")?.iata ?? searchParams.get("destination");
    const input = flightSearchSchema.parse({
      origin: resolvedOrigin,
      destination: resolvedDestination,
      departureDate: searchParams.get("departureDate"),
      returnDate: searchParams.get("returnDate") ?? undefined,
      passengers: searchParams.get("passengers") ?? "1",
      cabinClass: searchParams.get("cabinClass") ?? "ECONOMY",
    });

    const flights = generateDemoFlights({
      origin: input.origin,
      destination: input.destination,
      departureDate: input.departureDate,
      passengers: input.passengers,
      cabinClass: normalizeCabinClass(input.cabinClass),
    });

    return ok({ data: flights });
  } catch (error) {
    return fail(error);
  }
}
