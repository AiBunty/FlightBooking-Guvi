import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/table";
import { getAuthSession } from "@/lib/auth/session";
import { listAdminBookings } from "@/server/repositories/admin-repository";

export default async function AdminBookingsPage() {
  const session = await getAuthSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const bookings = await listAdminBookings();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Manage bookings</h1>
      <DataTable
        headers={["Reference", "User", "Route", "Status", "Total"]}
        rows={bookings.map((b) => [
          b.reference,
          b.user.email,
          `${b.outboundFlight.origin.code} -> ${b.outboundFlight.destination.code}`,
          b.status,
          `${b.currency} ${Number(b.totalPrice).toFixed(2)}`,
        ])}
      />
    </div>
  );
}
