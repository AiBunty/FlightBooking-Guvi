"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Dot, Plane } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import type { DemoFlight } from "@/features/flights/demo-flight-data";

export function ResultCard({ flight }: { flight: DemoFlight }) {
  const motionPref = useMotionPreference();
  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);
  const durationInMinutes = Math.max(0, Math.round((arrival.getTime() - departure.getTime()) / 60000));
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionPref.transition}
    >
      <Card className="overflow-hidden border-slate-200/80 p-0">
        <div className="grid gap-6 p-5 lg:grid-cols-[0.95fr_1.55fr_0.9fr] lg:items-center lg:p-6">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-3 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm">
                <Plane className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{flight.airline.name}</p>
                <p className="text-xs text-slate-500">
                  {flight.airline.code} | {flight.cabinClass.replaceAll("_", " ")}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{flight.seatsAvailable} seats left</span>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">Non-stop</span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-slate-900">
                  {departure.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">{flight.origin.iata}</p>
                <p className="text-xs text-slate-400">{flight.origin.city}</p>
              </div>
              <div className="px-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <span>{hours}h {minutes}m</span>
                  <Dot className="h-4 w-4" />
                  <span>Direct</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <div className="h-px flex-1 bg-slate-300" />
                  <Plane className="h-4 w-4 -rotate-12 text-orange-500" />
                  <div className="h-px flex-1 bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {departure.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-semibold tracking-tight text-slate-900">
                  {arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">{flight.destination.iata}</p>
                <p className="text-xs text-slate-400">{flight.destination.city}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-slate-50/90 p-4 lg:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Final fare</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{formatCurrency(Number(flight.price), flight.currency)}</p>
            <p className="mt-1 text-xs text-slate-500">per traveller, taxes included</p>
            <Link href={`/flights/${flight.id}`}>
              <Button className="mt-4 w-full justify-center lg:w-auto">
                View demo details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200/80 bg-white px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-orange-500" />
            Demo itinerary generated from airport distance and route timing
          </p>
          <p className="font-medium text-slate-500">Route {flight.origin.iata} to {flight.destination.iata}</p>
        </div>
      </Card>
    </motion.div>
  );
}
