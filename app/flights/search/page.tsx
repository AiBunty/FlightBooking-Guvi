import { FlightSearchForm } from "@/features/flights/search-form";

export default function FlightSearchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Search Flights</h1>
      <FlightSearchForm />
    </div>
  );
}
