"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateBookingReference } from "@/lib/utils";
import type { DemoCabinClass, DemoFlight, DemoTripType } from "@/features/flights/demo-flight-data";

type BookingStep = "itinerary" | "passenger" | "payment" | "complete";

export type DemoBookingPassenger = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  baggageKg: number;
};

export type CachedFlightSearch = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: DemoCabinClass;
  tripType: DemoTripType;
  searchedAt: string;
};

export type DemoBookingRecord = {
  id: string;
  reference: string;
  createdAt: string;
  status: "CONFIRMED";
  tripType: "ONE_WAY" | "ROUND_TRIP";
  cabinClass: DemoCabinClass;
  passengers: DemoBookingPassenger[];
  passengerCount: number;
  contactEmail: string;
  contactPhone: string;
  totalPrice: number;
  currency: string;
  flight: DemoFlight;
};

type BookingState = {
  step: BookingStep;
  lastSearch: CachedFlightSearch | null;
  recentSearches: CachedFlightSearch[];
  bookings: DemoBookingRecord[];
  setStep: (step: BookingStep) => void;
  saveSearch: (search: Omit<CachedFlightSearch, "searchedAt">) => void;
  createDemoBooking: (input: {
    flight: DemoFlight;
    cabinClass: DemoCabinClass;
    tripType: "ONE_WAY" | "ROUND_TRIP";
    passengers: DemoBookingPassenger[];
    contactEmail: string;
    contactPhone: string;
  }) => DemoBookingRecord;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      step: "itinerary",
      lastSearch: null,
      recentSearches: [],
      bookings: [],
      setStep: (step) => set({ step }),
      saveSearch: (search) =>
        set((state) => {
          const entry = { ...search, searchedAt: new Date().toISOString() };
          const recentSearches = [
            entry,
            ...state.recentSearches.filter((item) => {
              return !(
                item.origin === entry.origin &&
                item.destination === entry.destination &&
                item.departureDate === entry.departureDate &&
                item.cabinClass === entry.cabinClass &&
                item.tripType === entry.tripType
              );
            }),
          ].slice(0, 6);

          return {
            lastSearch: entry,
            recentSearches,
          };
        }),
      createDemoBooking: (input) => {
        const booking: DemoBookingRecord = {
          id: `demo-booking-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          reference: generateBookingReference(),
          createdAt: new Date().toISOString(),
          status: "CONFIRMED",
          tripType: input.tripType,
          cabinClass: input.cabinClass,
          passengers: input.passengers,
          passengerCount: input.passengers.length,
          contactEmail: input.contactEmail,
          contactPhone: input.contactPhone,
          totalPrice: input.flight.price * input.passengers.length,
          currency: input.flight.currency,
          flight: input.flight,
        };

        set((state) => ({
          bookings: [booking, ...state.bookings],
          step: "complete",
        }));

        return booking;
      },
    }),
    {
      name: "flightbooking-demo-cache",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
