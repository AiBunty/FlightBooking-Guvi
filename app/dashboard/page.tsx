import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAuthSession } from "@/lib/auth/session";
import { getUserBookingHistory } from "@/server/services/booking-service";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const bookings = await getUserBookingHistory(session.user.id);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Welcome, {session.user.name}</h1>
      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Your upcoming trips will appear here." cta="Search flights" href="/flights/search" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.slice(0, 4).map((booking) => (
            <Card key={booking.id}>
              <p className="text-sm text-slate-500">{booking.reference}</p>
              <p className="text-lg font-semibold">
                {booking.outboundFlight.origin.code} to {booking.outboundFlight.destination.code}
              </p>
              <div className="mt-2">
                <Badge label={booking.status} tone={booking.status === "CONFIRMED" ? "good" : "warn"} />
              </div>
              <Link href={`/dashboard/bookings/${booking.id}`} className="mt-3 inline-block text-sm font-semibold text-sky-700">
                View details
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
