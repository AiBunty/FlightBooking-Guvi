"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Unable to create account");
      return;
    }

    toast.success("Account created. Please sign in.");
    router.push("/auth/sign-in");
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="text-xl font-semibold">Create account</h1>
      <form action={onSubmit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="firstName" placeholder="First name" required />
          <Input name="lastName" placeholder="Last name" required />
        </div>
        <Input type="email" name="email" placeholder="Email" required />
        <Input type="password" name="password" placeholder="Password" required minLength={8} />
        <Button disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
    </Card>
  );
}
