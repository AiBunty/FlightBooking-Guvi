import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth/session";
import { getUserBookingById } from "@/server/services/booking-service";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const { id } = await params;
  const booking = await getUserBookingById(session.user.id, id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Booking {booking.reference}</h1>
        <div className="mt-3">
          <Badge label={booking.status} tone={booking.status === "CONFIRMED" ? "good" : "warn"} />
        </div>
        <p className="mt-3 text-sm text-slate-700">Contact email: {booking.contactEmail}</p>
        <p className="mt-1 text-sm text-slate-700">Passengers: {booking.passengers.length}</p>
        <p className="mt-1 text-sm text-slate-700">Payment status: {booking.payments[0]?.status ?? "N/A"}</p>
        <div className="mt-4">
          <Button variant="secondary" disabled>
            Cancellation request via API (UI enhancement pending)
          </Button>
        </div>
      </Card>
    </div>
  );
}
