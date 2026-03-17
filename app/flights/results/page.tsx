import { EmptyState } from "@/components/ui/empty-state";
import { ResultCard } from "@/features/flights/result-card";

type FlightResult = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  currency: string;
  seatsAvailable: number;
  airline: { name: string; code: string };
  origin: { code: string; city: string };
  destination: { code: string; city: string };
};

async function getResults(searchParams: Record<string, string | string[] | undefined>) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.set(key, value);
    }
  });

  const response = await fetch(`${baseUrl}/api/flights/search?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data as FlightResult[];
}

export default async function FlightResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const flights = await getResults(query);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Available Flights</h1>
      <div className="space-y-3">
        {flights.length === 0 ? (
          <EmptyState
            title="No flights found"
            description="Try different dates or nearby airports."
            cta="Search again"
            href="/flights/search"
          />
        ) : (
          flights.map((flight) => <ResultCard key={flight.id} flight={flight} />)
        )}
      </div>
    </div>
  );
}
