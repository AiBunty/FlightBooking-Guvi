import { describe, expect, it } from "vitest";
import {
  generateDemoFlights,
  getAirportByCode,
  resolveAirportInput,
  searchAirports,
} from "@/features/flights/demo-flight-data";

describe("demo flight data", () => {
  it("resolves airport input from city names", () => {
    const airport = resolveAirportInput("Tokyo");
    expect(airport).not.toBeNull();
    expect(airport?.city).toBe("Tokyo");
  });

  it("returns ranked airport suggestions", () => {
    const airports = searchAirports("jfk", 3);
    expect(airports[0]?.iata).toBe("JFK");
  });

  it("generates deterministic flights for a valid route", () => {
    const origin = getAirportByCode("JFK");
    const destination = getAirportByCode("LAX");

    expect(origin).not.toBeNull();
    expect(destination).not.toBeNull();

    const flights = generateDemoFlights({
      origin: "JFK",
      destination: "LAX",
      departureDate: "2026-06-20",
      passengers: 1,
      cabinClass: "ECONOMY",
    });

    expect(flights.length).toBeGreaterThan(0);
    expect(flights[0]?.origin.iata).toBe("JFK");
    expect(flights[0]?.destination.iata).toBe("LAX");
  });
});
