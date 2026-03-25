"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Tour, Departure } from "@/types";
import AvailabilitySelector from "./AvailabilitySelector";
import GuestCounter from "./GuestCounter";

interface BookingModuleProps {
  tour: Tour;
  departures: Departure[];
}

export default function BookingModule({ tour, departures }: BookingModuleProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(2);

  // Derive selected departure from date + time
  const selectedDeparture = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    return (
      departures.find(
        (d) =>
          d.date === selectedDate &&
          d.time === selectedTime &&
          !d.sold_out
      ) ?? null
    );
  }, [departures, selectedDate, selectedTime]);

  const totalPrice = tour.base_price * guestCount;
  const exceedsCapacity =
    selectedDeparture !== null && guestCount > selectedDeparture.spots_left;
  const isSoldOut = selectedDeparture?.sold_out === true;
  const ctaDisabled = !selectedDeparture || isSoldOut || exceedsCapacity;

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedTime(null); // reset time when date changes
  }

  function handleBookNow() {
    if (!selectedDeparture) return;
    router.push(
      `/checkout?tourId=${tour.id}&departureId=${selectedDeparture.id}&guestCount=${guestCount}`
    );
  }

  return (
    <div className="sticky top-[96px]">
      <div className="bg-white p-8 rounded-xl shadow-[0_8px_24px_rgba(28,27,27,0.04)]">
        {/* Price header */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#78716c]">
            From
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-heading text-4xl font-bold text-[#1c1b1b]">
              ${tour.base_price}
            </span>
            <span className="text-[#78716c] text-sm">/person</span>
          </div>
        </div>

        {/* Availability selector */}
        <div className="space-y-4 mb-6">
          <AvailabilitySelector
            departures={departures}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={handleSelectDate}
            onSelectTime={setSelectedTime}
          />

          {/* Guest counter */}
          <GuestCounter value={guestCount} onChange={setGuestCount} />
        </div>

        {/* Error: exceeds capacity */}
        {exceedsCapacity && selectedDeparture && (
          <p className="text-red-600 text-sm mb-4">
            Only {selectedDeparture.spots_left} spots left. Please reduce the
            number of guests.
          </p>
        )}

        {/* Sold out state */}
        {isSoldOut && (
          <p className="text-red-600 text-sm font-medium mb-4">Sold out</p>
        )}

        {/* Price breakdown */}
        <div className="border-t border-[#ebe7e7] pt-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm text-[#78716c]">
            <span>
              ${tour.base_price} × {guestCount} guests
            </span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between font-heading font-bold text-lg text-[#1c1b1b]">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          disabled={ctaDisabled}
          onClick={handleBookNow}
          className="block w-full bg-[#4CBB17] text-[#1c1b1b] text-center font-heading font-bold text-base py-4 rounded-full hover:bg-[#3a960e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Book now
        </button>
      </div>
    </div>
  );
}
