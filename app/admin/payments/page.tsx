import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/table";
import { getAuthSession } from "@/lib/auth/session";
import { listAdminPayments } from "@/server/repositories/admin-repository";

export default async function AdminPaymentsPage() {
  const session = await getAuthSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const payments = await listAdminPayments();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Payment records</h1>
      <DataTable
        headers={["Booking", "Amount", "Status", "Intent", "Created"]}
        rows={payments.map((p) => [
          p.booking.reference,
          `${p.currency} ${Number(p.amount).toFixed(2)}`,
          p.status,
          p.stripePaymentIntentId ?? "-",
          new Date(p.createdAt).toLocaleString(),
        ])}
      />
    </div>
  );
}
