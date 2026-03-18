import airportsData from "@/data/airports.json";

export const CABIN_CLASS_VALUES = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"] as const;
export type DemoCabinClass = (typeof CABIN_CLASS_VALUES)[number];

export type DemoTripType = "round-trip" | "one-way";

export type DemoAirport = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  state: string;
  country: string;
  tz: string;
  lat: number | null;
  lon: number | null;
};

export type DemoFlight = {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  price: number;
  currency: string;
  seatsAvailable: number;
  cabinClass: DemoCabinClass;
  aircraft: {
    code: string;
    model: string;
  };
  airline: {
    name: string;
    code: string;
  };
  origin: Pick<DemoAirport, "iata" | "city" | "name" | "country" | "tz">;
  destination: Pick<DemoAirport, "iata" | "city" | "name" | "country" | "tz">;
};

export type DemoFlightSearch = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: DemoCabinClass;
  tripType: DemoTripType;
};

const AIRPORTS = (airportsData as DemoAirport[])
  .filter((airport) => airport.iata && airport.city && airport.name)
  .map((airport) => ({
    ...airport,
    iata: airport.iata.toUpperCase(),
    icao: airport.icao.toUpperCase(),
    city: airport.city.trim(),
    name: airport.name.trim(),
    state: airport.state.trim(),
    country: airport.country.trim().toUpperCase(),
    tz: airport.tz.trim(),
  }));

const AIRPORTS_BY_CODE = new Map(AIRPORTS.map((airport) => [airport.iata, airport]));

const POPULAR_AIRPORT_CODES = [
  "JFK",
  "LAX",
  "SFO",
  "ORD",
  "LHR",
  "CDG",
  "DXB",
  "SIN",
  "HND",
  "SYD",
  "YYZ",
  "FRA",
];

const FEATURED_DESTINATION_CODES = ["DXB", "HND", "CDG"];

const PHOTO_SEEDS = {
  DXB: "dubai-marina-demo",
  HND: "tokyo-night-demo",
  CDG: "paris-rooftop-demo",
  JFK: "new-york-skyline-demo",
  LAX: "la-coast-demo",
  SFO: "san-francisco-demo",
  ORD: "chicago-river-demo",
  SIN: "singapore-garden-demo",
  SYD: "sydney-harbour-demo",
  YYZ: "toronto-tower-demo",
  FRA: "frankfurt-river-demo",
  BCN: "barcelona-sun-demo",
  GIG: "rio-beach-demo",
  CPT: "cape-town-demo",
  AKL: "auckland-demo",
  CMB: "colombo-demo",
} as const;

const AIRLINES = [
  { code: "AX", name: "Atlas Airway" },
  { code: "SK", name: "Skyline Connect" },
  { code: "NV", name: "NovaJet" },
  { code: "OR", name: "Orchid Pacific" },
  { code: "CT", name: "Coastline Air" },
  { code: "FL", name: "FlyMint" },
];

const AIRCRAFT = [
  { code: "A320", model: "Airbus A320neo" },
  { code: "A321", model: "Airbus A321neo" },
  { code: "B738", model: "Boeing 737-800" },
  { code: "B38M", model: "Boeing 737 MAX 8" },
  { code: "B789", model: "Boeing 787-9 Dreamliner" },
];

const FLIGHT_SLOTS = [
  { hour: 6, minute: 20 },
  { hour: 9, minute: 10 },
  { hour: 12, minute: 45 },
  { hour: 15, minute: 35 },
  { hour: 18, minute: 20 },
  { hour: 21, minute: 5 },
];

const CABIN_MULTIPLIERS: Record<DemoCabinClass, number> = {
  ECONOMY: 1,
  PREMIUM_ECONOMY: 1.28,
  BUSINESS: 2.1,
  FIRST: 3.05,
};

export function getAirportByCode(code: string | undefined | null) {
  if (!code) {
    return null;
  }

  return AIRPORTS_BY_CODE.get(code.trim().toUpperCase()) ?? null;
}

export function getPopularAirports(limit = 8) {
  return POPULAR_AIRPORT_CODES.map((code) => getAirportByCode(code)).filter(isDefined).slice(0, limit);
}

export function formatAirportLabel(airport: Pick<DemoAirport, "iata" | "city" | "country">) {
  return `${airport.city}, ${airport.country} (${airport.iata})`;
}

export function formatAirportDisplay(airport: Pick<DemoAirport, "iata" | "city" | "name" | "country">) {
  return `${airport.city} (${airport.iata})`;
}

export function getAirportPhotoUrl(codeOrSeed: string, width = 1200, height = 800) {
  const seed = PHOTO_SEEDS[codeOrSeed as keyof typeof PHOTO_SEEDS] ?? `${codeOrSeed.toLowerCase()}-travel-demo`;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export function getFeaturedDestinations() {
  return FEATURED_DESTINATION_CODES.map((code, index) => {
    const airport = getAirportByCode(code);
    if (!airport) {
      return null;
    }

    return {
      airport,
      eyebrow: ["Modern getaway", "City break", "Long-haul favourite"][index] ?? "Featured route",
      subtitle:
        [
          "Real travel photography and a full airport database make the demo feel closer to a live OTA search.",
          "Search by airport code, city, or airport name and get immediate route suggestions from the local cache.",
          "Book the itinerary in demo mode and keep the booking saved in local storage after refresh.",
        ][index] ?? "Search any destination and continue into demo checkout.",
      imageSrc: getAirportPhotoUrl(code, 1440, 920),
    };
  }).filter(isDefined);
}

export function getGalleryDestinations() {
  return ["JFK", "LAX", "SFO", "SIN", "SYD", "YYZ", "FRA", "BCN", "GIG", "CPT", "AKL", "CMB"]
    .map((code, index) => {
      const airport = getAirportByCode(code);
      if (!airport) {
        return null;
      }

      return {
        airport,
        tag: ["City", "Coast", "Culture", "Nightlife", "Harbour", "Weekend"][index % 6] ?? "Travel",
        imageSrc: getAirportPhotoUrl(`${code}-${index}`, 960, index % 5 === 0 ? 820 : 720),
      };
    })
    .filter(isDefined);
}

export function searchAirports(query: string, limit = 8) {
  const normalized = normalizeText(query);
  if (!normalized) {
    return getPopularAirports(limit);
  }

  return AIRPORTS
    .map((airport) => {
      const score = getAirportMatchScore(airport, normalized);
      return score === Number.POSITIVE_INFINITY ? null : { airport, score };
    })
    .filter(isDefined)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      return left.airport.city.localeCompare(right.airport.city) || left.airport.iata.localeCompare(right.airport.iata);
    })
    .slice(0, limit)
    .map((entry) => entry.airport);
}

export function resolveAirportInput(value: string) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  if (/^[a-z]{3}$/i.test(value.trim())) {
    return getAirportByCode(value);
  }

  const exactMatch = AIRPORTS.find((airport) => {
    return (
      normalizeText(airport.city) === normalized ||
      normalizeText(airport.name) === normalized ||
      normalizeText(formatAirportLabel(airport)) === normalized ||
      normalizeText(`${airport.city} (${airport.iata})`) === normalized
    );
  });

  if (exactMatch) {
    return exactMatch;
  }

  return searchAirports(value, 1)[0] ?? null;
}

export function normalizeCabinClass(value: string | null | undefined): DemoCabinClass {
  if (value && CABIN_CLASS_VALUES.includes(value as DemoCabinClass)) {
    return value as DemoCabinClass;
  }

  return "ECONOMY";
}

export function getDefaultDepartureDate(offsetDays = 1) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function buildDemoFlightId(input: {
  origin: string;
  destination: string;
  departureDate: string;
  cabinClass: DemoCabinClass;
  index: number;
}) {
  return `demo-${input.origin}-${input.destination}-${input.departureDate.replaceAll("-", "")}-${input.cabinClass}-${input.index}`;
}

export function parseDemoFlightId(id: string) {
  const match = /^demo-([A-Z0-9]{3})-([A-Z0-9]{3})-(\d{8})-(ECONOMY|PREMIUM_ECONOMY|BUSINESS|FIRST)-(\d+)$/.exec(id);
  if (!match) {
    return null;
  }

  const [, origin, destination, compactDate, cabinClass, index] = match;
  const departureDate = `${compactDate.slice(0, 4)}-${compactDate.slice(4, 6)}-${compactDate.slice(6, 8)}`;

  return {
    origin,
    destination,
    departureDate,
    cabinClass: cabinClass as DemoCabinClass,
    index: Number(index),
  };
}

export function generateDemoFlights(input: {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  cabinClass: DemoCabinClass;
}) {
  const origin = getAirportByCode(input.origin);
  const destination = getAirportByCode(input.destination);
  if (!origin || !destination || origin.iata === destination.iata) {
    return [];
  }

  const distanceKm = Math.max(320, Math.round(getDistanceKm(origin, destination)));
  const baseDurationMinutes = Math.max(75, Math.round((distanceKm / 820) * 60) + 35);
  const searchSeed = `${origin.iata}-${destination.iata}-${input.departureDate}-${input.cabinClass}`;
  const passengerCount = Math.max(1, Math.min(9, input.passengers || 1));

  return FLIGHT_SLOTS.map((slot, index) => {
    const routeSeed = seededFraction(`${searchSeed}-${index}`);
    const departure = new Date(`${input.departureDate}T00:00:00`);
    departure.setHours(slot.hour + Math.floor(routeSeed * 2), slot.minute + (Math.floor(routeSeed * 40) % 12), 0, 0);

    const durationMinutes = baseDurationMinutes + Math.round(routeSeed * 32) + index * 7;
    const arrival = new Date(departure.getTime() + durationMinutes * 60_000);
    const airline = AIRLINES[(index + Math.floor(seededFraction(`${searchSeed}-airline`) * AIRLINES.length)) % AIRLINES.length];
    const aircraft = AIRCRAFT[(index + Math.floor(seededFraction(`${searchSeed}-aircraft`) * AIRCRAFT.length)) % AIRCRAFT.length];
    const fareNoise = 35 + seededFraction(`${searchSeed}-fare-${index}`) * 90;
    const baseFare = distanceKm * 0.11 + fareNoise;
    const price = Math.round(baseFare * CABIN_MULTIPLIERS[input.cabinClass]);
    const seatsAvailable = Math.max(passengerCount + 1, 3 + Math.floor(seededFraction(`${searchSeed}-seats-${index}`) * 7) + (index % 3));
    const flightNumberSeed = Math.floor(seededFraction(`${searchSeed}-number-${index}`) * 700);

    return {
      id: buildDemoFlightId({
        origin: origin.iata,
        destination: destination.iata,
        departureDate: input.departureDate,
        cabinClass: input.cabinClass,
        index,
      }),
      flightNumber: `${airline.code}${180 + flightNumberSeed}`,
      departureTime: departure.toISOString(),
      arrivalTime: arrival.toISOString(),
      durationMinutes,
      price,
      currency: "USD",
      seatsAvailable,
      cabinClass: input.cabinClass,
      aircraft,
      airline,
      origin: pickAirportSummary(origin),
      destination: pickAirportSummary(destination),
    } satisfies DemoFlight;
  });
}

export function getDemoFlightById(id: string) {
  const parsed = parseDemoFlightId(id);
  if (!parsed) {
    return null;
  }

  return (
    generateDemoFlights({
      origin: parsed.origin,
      destination: parsed.destination,
      departureDate: parsed.departureDate,
      passengers: 1,
      cabinClass: parsed.cabinClass,
    }).find((flight) => flight.id === id) ?? null
  );
}

function pickAirportSummary(airport: DemoAirport) {
  return {
    iata: airport.iata,
    city: airport.city,
    name: airport.name,
    country: airport.country,
    tz: airport.tz,
  };
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getAirportMatchScore(airport: DemoAirport, normalizedQuery: string) {
  const fields = {
    iata: airport.iata.toLowerCase(),
    icao: airport.icao.toLowerCase(),
    city: airport.city.toLowerCase(),
    name: airport.name.toLowerCase(),
    country: airport.country.toLowerCase(),
    label: formatAirportLabel(airport).toLowerCase(),
  };

  if (fields.iata === normalizedQuery) {
    return 0;
  }
  if (fields.city === normalizedQuery) {
    return 1;
  }
  if (fields.name === normalizedQuery) {
    return 2;
  }
  if (fields.iata.startsWith(normalizedQuery)) {
    return 3;
  }
  if (fields.city.startsWith(normalizedQuery)) {
    return 4;
  }
  if (fields.name.startsWith(normalizedQuery)) {
    return 5;
  }
  if (fields.label.includes(normalizedQuery)) {
    return 6;
  }
  if (fields.country.includes(normalizedQuery) || fields.icao.startsWith(normalizedQuery)) {
    return 7;
  }

  return Number.POSITIVE_INFINITY;
}

function getDistanceKm(origin: DemoAirport, destination: DemoAirport) {
  if (origin.lat == null || origin.lon == null || destination.lat == null || destination.lon == null) {
    return 960;
  }

  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(destination.lat - origin.lat);
  const longitudeDelta = toRadians(destination.lon - origin.lon);
  const startLatitude = toRadians(origin.lat);
  const endLatitude = toRadians(destination.lat);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function seededFraction(seed: string) {
  let hash = 2166136261;

  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return ((hash >>> 0) % 10_000) / 10_000;
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}
