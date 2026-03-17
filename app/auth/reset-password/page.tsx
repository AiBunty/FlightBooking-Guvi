import { Suspense } from "react";
import { ResetForm } from "@/features/auth/reset-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
