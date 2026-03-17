import Link from "next/link";
import { SignInForm } from "@/features/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <SignInForm />
      <p className="mt-4 text-center text-sm text-slate-600">
        New here? <Link href="/auth/sign-up" className="text-sky-700">Create an account</Link>
      </p>
      <p className="mt-1 text-center text-sm text-slate-600">
        <Link href="/auth/forgot-password" className="text-sky-700">Forgot password?</Link>
      </p>
    </div>
  );
}
