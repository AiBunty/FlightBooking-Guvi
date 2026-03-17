"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useMotionPreference } from "@/hooks/use-motion-preference";

type ResultFlight = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: string | number;
  currency: string;
  seatsAvailable: number;
  airline: { name: string; code: string };
  origin: { code: string; city: string };
  destination: { code: string; city: string };
};

export function ResultCard({ flight }: { flight: ResultFlight }) {
  const motionPref = useMotionPreference();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionPref.transition}
    >
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">{flight.airline.name}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {flight.origin.code} to {flight.destination.code}
          </h3>
          <p className="text-sm text-slate-600">
            {new Date(flight.departureTime).toLocaleString()} - {new Date(flight.arrivalTime).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(Number(flight.price), flight.currency)}</p>
          <p className="text-xs text-slate-500">{flight.seatsAvailable} seats left</p>
          <Link href={`/flights/${flight.id}`}>
            <Button className="mt-2">View details</Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
