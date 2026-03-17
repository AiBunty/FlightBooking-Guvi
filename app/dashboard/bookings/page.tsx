import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAuthSession } from "@/lib/auth/session";
import { getUserBookingHistory } from "@/server/services/booking-service";

export default async function DashboardBookingsPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const bookings = await getUserBookingHistory(session.user.id);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">My bookings</h1>
      {bookings.length === 0 ? (
        <EmptyState title="No bookings found" description="Start by searching flights." cta="Search flights" href="/flights/search" />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">{booking.reference}</p>
                  <p className="font-semibold">
                    {booking.outboundFlight.origin.code} to {booking.outboundFlight.destination.code}
                  </p>
                </div>
                <Badge label={booking.status} tone={booking.status === "CONFIRMED" ? "good" : "warn"} />
              </div>
              <Link href={`/dashboard/bookings/${booking.id}`} className="mt-3 inline-block text-sm font-semibold text-sky-700">
                Open booking
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
