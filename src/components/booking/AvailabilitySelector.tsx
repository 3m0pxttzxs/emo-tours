"use client";

import type { Departure } from "@/types";

interface AvailabilitySelectorProps {
  departures: Departure[];
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export default function AvailabilitySelector({
  departures,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: AvailabilitySelectorProps) {
  // Filter out sold_out departures
  const available = departures.filter((d) => !d.sold_out);

  // Group by date
  const dateMap = new Map<string, Departure[]>();
  for (const dep of available) {
    const existing = dateMap.get(dep.date) ?? [];
    existing.push(dep);
    dateMap.set(dep.date, existing);
  }

  const dates = Array.from(dateMap.keys()).sort();
  const timesForDate = selectedDate ? (dateMap.get(selectedDate) ?? []) : [];
  const selectedDeparture = timesForDate.find((d) => d.time === selectedTime);

  return (
    <div className="space-y-4">
      {/* Date selector */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-[#78716c] mb-2">
          Select Date
        </label>
        {dates.length === 0 ? (
          <p className="text-sm text-[#78716c]">No dates available</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => {
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-2 border-[#4CBB17] bg-[#4CBB17]/10 text-[#1c1b1b]"
                      : "border border-[#ebe7e7] text-[#1c1b1b] hover:bg-[#f5f0ee]"
                  }`}
                >
                  {formatDate(date)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Time selector */}
      {selectedDate && timesForDate.length > 0 && (
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#78716c] mb-2">
            Select Time
          </label>
          <div className="flex flex-wrap gap-2">
            {timesForDate.map((dep) => {
              const isSelected = dep.time === selectedTime;
              return (
                <button
                  key={dep.id}
                  type="button"
                  onClick={() => onSelectTime(dep.time)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-2 border-[#4CBB17] bg-[#4CBB17]/10 text-[#1c1b1b]"
                      : "border border-[#ebe7e7] text-[#1c1b1b] hover:bg-[#f5f0ee]"
                  }`}
                >
                  {dep.time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spots left indicator */}
      {selectedDeparture && (
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[#4CBB17] text-lg">
            group
          </span>
          <span className="text-[#78716c]">
            {selectedDeparture.spots_left} spots left
          </span>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
