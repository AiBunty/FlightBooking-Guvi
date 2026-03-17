import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/table";
import { getAuthSession } from "@/lib/auth/session";
import { listAdminFlights } from "@/server/repositories/admin-repository";

export default async function AdminFlightsPage() {
  const session = await getAuthSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const flights = await listAdminFlights();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Manage flights</h1>
      <DataTable
        headers={["Flight", "Route", "Departure", "Status", "Seats"]}
        rows={flights.map((f) => [
          f.flightNumber,
          `${f.origin.code} -> ${f.destination.code}`,
          new Date(f.departureTime).toLocaleString(),
          f.status,
          String(f.seatsAvailable),
        ])}
      />
    </div>
  );
}
