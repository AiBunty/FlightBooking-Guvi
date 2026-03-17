import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/table";
import { getAuthSession } from "@/lib/auth/session";
import { listAdminUsers } from "@/server/repositories/admin-repository";

export default async function AdminUsersPage() {
  const session = await getAuthSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await listAdminUsers();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Manage users</h1>
      <DataTable
        headers={["Name", "Email", "Role", "Active", "Bookings"]}
        rows={users.map((u) => [
          `${u.firstName} ${u.lastName}`,
          u.email,
          u.role,
          u.isActive ? "Yes" : "No",
          String(u.bookings.length),
        ])}
      />
    </div>
  );
}
