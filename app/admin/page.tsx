import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth/session";
import { adminMetrics } from "@/server/repositories/admin-repository";

export default async function AdminPage() {
  const session = await getAuthSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const metrics = await adminMetrics();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Users</p><p className="text-2xl font-bold">{metrics.users}</p></Card>
        <Card><p className="text-sm text-slate-500">Bookings</p><p className="text-2xl font-bold">{metrics.bookings}</p></Card>
        <Card><p className="text-sm text-slate-500">Flights</p><p className="text-2xl font-bold">{metrics.flights}</p></Card>
        <Card><p className="text-sm text-slate-500">Successful payments</p><p className="text-2xl font-bold">{metrics.successfulPayments}</p></Card>
      </div>
    </div>
  );
}
