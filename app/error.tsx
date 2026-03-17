"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-600">Please try again. If this persists, contact support.</p>
      <Button onClick={reset} className="mt-5">
        Retry
      </Button>
    </div>
  );
}
