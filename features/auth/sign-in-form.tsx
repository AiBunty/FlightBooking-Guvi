"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Welcome back");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <form action={onSubmit} className="mt-5 space-y-3">
        <Input type="email" name="email" placeholder="Email" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
