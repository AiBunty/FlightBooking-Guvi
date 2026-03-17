"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ForgotForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(formData.get("email") ?? "") }),
    });
    setLoading(false);
    toast.success("If the account exists, reset instructions have been sent.");
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="text-xl font-semibold">Forgot password</h1>
      <form action={onSubmit} className="mt-5 space-y-3">
        <Input type="email" name="email" placeholder="Email" required />
        <Button disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </Card>
  );
}
