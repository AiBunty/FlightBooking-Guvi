import Link from "next/link";
import { SignUpForm } from "@/features/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <SignUpForm />
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account? <Link href="/auth/sign-in" className="text-sky-700">Sign in</Link>
      </p>
    </div>
  );
}
