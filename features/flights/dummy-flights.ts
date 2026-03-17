// Dummy flight data for local search
export type DummyLocation = {
  code: string;
  city: string;
  label: string;
};

export const DUMMY_FLIGHTS = [
  {
    id: "1",
    departureTime: new Date(Date.now() + 86400000).toISOString(),
    arrivalTime: new Date(Date.now() + 86400000 + 4 * 3600000).toISOString(),
    price: "320",
    currency: "USD",
    seatsAvailable: 5,
    airline: { name: "SkyBlue Air", code: "SB" },
    origin: { code: "JFK", city: "New York" },
    destination: { code: "LAX", city: "Los Angeles" },
  },
  {
    id: "2",
    departureTime: new Date(Date.now() + 2 * 86400000).toISOString(),
    arrivalTime: new Date(Date.now() + 2 * 86400000 + 5 * 3600000).toISOString(),
    price: "360",
    currency: "USD",
    seatsAvailable: 3,
    airline: { name: "NorthJet", code: "NJ" },
    origin: { code: "SFO", city: "San Francisco" },
    destination: { code: "ORD", city: "Chicago" },
  },
  {
    id: "3",
    departureTime: new Date(Date.now() + 3 * 86400000).toISOString(),
    arrivalTime: new Date(Date.now() + 3 * 86400000 + 2 * 3600000).toISOString(),
    price: "240",
    currency: "USD",
    seatsAvailable: 8,
    airline: { name: "SkyBlue Air", code: "SB" },
    origin: { code: "LAX", city: "Los Angeles" },
    destination: { code: "SFO", city: "San Francisco" },
  },
];

export const DUMMY_LOCATIONS: DummyLocation[] = [
  { code: "JFK", city: "New York", label: "New York (JFK)" },
  { code: "LAX", city: "Los Angeles", label: "Los Angeles (LAX)" },
  { code: "SFO", city: "San Francisco", label: "San Francisco (SFO)" },
  { code: "ORD", city: "Chicago", label: "Chicago (ORD)" },
];

export function resolveLocationCode(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return "";
  }

  const match = DUMMY_LOCATIONS.find((location) => {
    return (
      location.code.toLowerCase() === normalized ||
      location.city.toLowerCase() === normalized ||
      location.label.toLowerCase() === normalized
    );
  });

  return match?.code ?? value.trim().toUpperCase();
}

export function matchesLocationQuery(query: string | undefined, location: { code: string; city: string }) {
  if (!query) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  return (
    location.code.toLowerCase() === normalized ||
    location.city.toLowerCase() === normalized ||
    location.code.toLowerCase().includes(normalized) ||
    location.city.toLowerCase().includes(normalized)
  );
}
