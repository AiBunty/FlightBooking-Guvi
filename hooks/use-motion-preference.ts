"use client";

import { useReducedMotion } from "framer-motion";

export function useMotionPreference() {
  const reduced = useReducedMotion();
  return {
    shouldReduceMotion: reduced,
    transition: reduced ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
  };
}
