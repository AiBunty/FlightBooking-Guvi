"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDefaultDepartureDate, getFeaturedDestinations } from "@/features/flights/demo-flight-data";

export function HolidayDestinationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = useMemo(() => getFeaturedDestinations(), []);
  const departureDate = useMemo(() => getDefaultDepartureDate(7), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section className="mx-auto mt-14 w-full max-w-7xl px-4">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">Featured Destinations</p>
          <h2 className="mt-2 font-[family:var(--font-space-grotesk)] text-3xl font-semibold text-slate-900">
            Real travel photos, not abstract placeholders
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {slides.map((slide, index) => (
            <button
              key={slide.airport.iata}
              type="button"
              aria-label={`Go to ${slide.airport.city}`}
              className={cn(
                "h-2.5 rounded-full transition-all",
                index === activeIndex ? "w-10 bg-orange-500" : "w-2.5 bg-slate-300 hover:bg-slate-400",
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[32px] bg-slate-950 shadow-[0_20px_80px_rgba(15,23,42,0.18)]">
          <Image
            key={activeSlide.airport.iata}
            src={activeSlide.imageSrc}
            alt={activeSlide.airport.city}
            width={1440}
            height={920}
            className="h-95 w-full object-cover md:h-115"
            priority={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">{activeSlide.eyebrow}</p>
            <h3 className="mt-2 font-[family:var(--font-space-grotesk)] text-3xl font-semibold md:text-4xl">
              {activeSlide.airport.city}
            </h3>
            <p className="mt-2 text-sm text-slate-200">{activeSlide.airport.name}</p>
            <p className="mt-3 max-w-xl text-sm text-slate-200 md:text-base">{activeSlide.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/flights/results?origin=JFK&destination=${activeSlide.airport.iata}&departureDate=${departureDate}&passengers=1&cabinClass=ECONOMY&tripType=one-way`}
              >
                <Button variant="secondary" className="bg-white text-slate-950 shadow-none hover:bg-slate-100">
                  Search this route
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
                className="rounded-xl border border-white/35 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Next destination
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {slides.map((slide, index) => (
            <button
              key={slide.airport.iata}
              type="button"
              className={cn(
                "overflow-hidden rounded-3xl border text-left shadow-lg transition hover:-translate-y-1",
                index === activeIndex ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white",
              )}
              onClick={() => setActiveIndex(index)}
            >
              <Image src={slide.imageSrc} alt={slide.airport.city} width={420} height={280} className="h-32 w-full object-cover" />
              <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">{slide.eyebrow}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{slide.airport.city}</h3>
                <p className="mt-1 text-sm text-slate-600">{slide.airport.iata}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
