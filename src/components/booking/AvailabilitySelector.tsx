"use client";

import type { Departure } from "@/types";

interface AvailabilitySelectorProps {
  departures: Departure[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  scheduleDay?: string | null;
  scheduleTime?: string | null;
}

export default function AvailabilitySelector({
  departures,
  selectedDate,
  onSelectDate,
  scheduleDay,
  scheduleTime,
}: AvailabilitySelectorProps) {
  // Filter out sold_out departures
  const available = departures.filter((d) => !d.sold_out);

  // If scheduleDay is set, only show dates matching that weekday
  const filteredDeps = scheduleDay
    ? available.filter((d) => {
        const [y, m, day] = d.date.split("-").map(Number);
        const date = new Date(y, m - 1, day);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        return dayName === scheduleDay;
      })
    : available;

  // Unique dates sorted
  const dates = Array.from(new Set(filteredDeps.map((d) => d.date))).sort();

  // Find selected departure for spots display
  const selectedDeparture = selectedDate
    ? filteredDeps.find((d) => d.date === selectedDate)
    : null;

  return (
    <div className="space-y-4">
      {/* Schedule label */}
      {scheduleDay && (
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[#4CBB17] text-lg">event_repeat</span>
          <span className="text-[#1c1b1b] font-medium">
            Runs every {scheduleDay}
            {scheduleTime && ` at ${formatTime(scheduleTime)}`}
          </span>
        </div>
      )}

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
                  {formatDateWithDay(date)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed time display (no time selection needed) */}
      {selectedDate && scheduleTime && (
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[#4CBB17] text-lg">schedule</span>
          <span className="text-[#78716c]">
            Departure at {formatTime(scheduleTime)}
          </span>
        </div>
      )}

      {/* Spots left indicator */}
      {selectedDeparture && (
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[#4CBB17] text-lg">group</span>
          <span className="text-[#78716c]">
            {selectedDeparture.spots_left} spots left
          </span>
        </div>
      )}
    </div>
  );
}

function formatDateWithDay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}:00 ${period}` : `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
