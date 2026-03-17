"use client";

import { create } from "zustand";

type BookingStep = "itinerary" | "passenger" | "payment" | "complete";

type BookingState = {
  step: BookingStep;
  setStep: (step: BookingStep) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  step: "itinerary",
  setStep: (step) => set({ step }),
}));
