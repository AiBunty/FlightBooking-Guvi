import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function ProfilePage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { profile: true } });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Profile settings</h1>
        <p className="mt-3 text-sm text-slate-700">Name: {user?.firstName} {user?.lastName}</p>
        <p className="mt-1 text-sm text-slate-700">Email: {user?.email}</p>
        <p className="mt-1 text-sm text-slate-700">Phone: {user?.profile?.phone ?? "Not set"}</p>
      </Card>
    </div>
  );
}
