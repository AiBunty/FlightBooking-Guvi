"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: String(formData.get("password") ?? ""),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Unable to reset password");
      return;
    }

    toast.success("Password reset complete");
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="text-xl font-semibold">Reset password</h1>
      <form action={onSubmit} className="mt-5 space-y-3">
        <Input type="password" name="password" placeholder="New password" required minLength={8} />
        <Button disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save password"}
        </Button>
      </form>
    </Card>
  );
}
