"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  formatAirportDisplay,
  formatAirportLabel,
  getAirportByCode,
  getPopularAirports,
  resolveAirportInput,
  searchAirports,
} from "@/features/flights/demo-flight-data";

type AirportAutocompleteProps = {
  id: string;
  placeholder: string;
  value: string;
  onChange: (code: string) => void;
};

export function AirportAutocomplete({ id, placeholder, value, onChange }: AirportAutocompleteProps) {
  const [draftQuery, setDraftQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const resolvedValue = getAirportByCode(value);
  const query = draftQuery ?? (resolvedValue ? formatAirportDisplay(resolvedValue) : value);
  const deferredQuery = useDeferredValue(query);

  const suggestions = useMemo(() => {
    if (!deferredQuery.trim()) {
      return getPopularAirports(8);
    }

    return searchAirports(deferredQuery, 8);
  }, [deferredQuery]);

  function commitQuery() {
    const resolved = resolveAirportInput(query);
    if (resolved) {
      onChange(resolved.iata);
      setDraftQuery(null);
      return;
    }

    onChange(query.trim().toUpperCase());
    setDraftQuery(query.trim().toUpperCase());
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          id={id}
          name={id}
          placeholder={placeholder}
          required
          value={query}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => {
              commitQuery();
              setOpen(false);
            }, 120);
          }}
          onChange={(event) => {
            setDraftQuery(event.target.value);
            setOpen(true);
          }}
          className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none focus-visible:ring-0"
        />
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {deferredQuery.trim() ? "Matching airports" : "Popular airports"}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((airport) => (
              <button
                key={airport.iata}
                type="button"
                className="flex w-full flex-col gap-1 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-orange-50"
                onMouseDown={() => {
                  onChange(airport.iata);
                  setDraftQuery(null);
                  setOpen(false);
                }}
              >
                <span className="text-sm font-semibold text-slate-900">{formatAirportLabel(airport)}</span>
                <span className="text-xs text-slate-500">{airport.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
