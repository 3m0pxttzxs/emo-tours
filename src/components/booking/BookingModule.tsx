"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Tour, Departure } from "@/types";
import { weekdayName, formatPrice, isRequestOnly } from "@/lib/schedule";
import AvailabilitySelector from "./AvailabilitySelector";
import GuestCounter from "./GuestCounter";

interface BookingModuleProps {
  tour: Tour;
  departures: Departure[];
}

export default function BookingModule({ tour, departures }: BookingModuleProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(2);

  const requestOnly = isRequestOnly(tour.type, tour.weekday);
  const dayName = weekdayName(tour.weekday);

  const selectedDeparture = useMemo(() => {
    if (!selectedDate) return null;
    return departures.find((d) => d.date === selectedDate && !d.sold_out) ?? null;
  }, [departures, selectedDate]);

  const totalPrice = tour.base_price * guestCount;
  const exceedsCapacity = selectedDeparture !== null && guestCount > selectedDeparture.spots_left;
  const isSoldOut = selectedDeparture?.sold_out === true;
  const ctaDisabled = !selectedDeparture || isSoldOut || exceedsCapacity;

  function handleBookNow() {
    if (!selectedDeparture) return;
    router.push(
      `/checkout?tourId=${tour.id}&departureId=${selectedDeparture.id}&guestCount=${guestCount}`
    );
  }

  // Request-only panel for custom/private tours
  if (requestOnly) {
    return (
      <div className="sticky top-[96px]">
        <div className="bg-white p-8 rounded-xl shadow-[0_8px_24px_rgba(28,27,27,0.04)]">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-[#78716c]">Private Experience</span>
            <p className="font-heading text-2xl font-bold text-[#1c1b1b] mt-2">Pricing upon request</p>
            <p className="text-[#78716c] text-sm mt-2 leading-relaxed">
              This is a private, bespoke experience. Tell us your interests and we&apos;ll craft the perfect itinerary.
            </p>
          </div>
          <a
            href="/custom-tours"
            className="block w-full bg-[#4CBB17] text-[#1c1b1b] text-center font-heading font-bold text-base py-4 rounded-full hover:bg-[#3a960e] transition-colors"
          >
            Request My Tour
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[96px]">
      <div className="bg-white p-8 rounded-xl shadow-[0_8px_24px_rgba(28,27,27,0.04)]">
        {/* Schedule + Price */}
        <div className="mb-6">
          <p className="text-sm text-[#4cbb17] font-heading font-bold uppercase tracking-wider mb-1">
            Weekly Departure
          </p>
          <p className="text-[#78716c] text-sm mb-3">
            Every {dayName} at {tour.departure_time}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-4xl font-bold text-[#1c1b1b]">
              {formatPrice(tour.base_price)}
            </span>
          </div>
        </div>

        {/* Date selector — only shows valid weekday dates */}
        <div className="space-y-4 mb-6">
          <AvailabilitySelector
            departures={departures}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <GuestCounter value={guestCount} onChange={setGuestCount} />
        </div>

        {exceedsCapacity && selectedDeparture && (
          <p className="text-red-600 text-sm mb-4">
            Only {selectedDeparture.spots_left} spots left.
          </p>
        )}

        {isSoldOut && (
          <p className="text-red-600 text-sm font-medium mb-4">Sold out for this date</p>
        )}

        {/* Price breakdown */}
        <div className="border-t border-[#ebe7e7] pt-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm text-[#78716c]">
            <span>${tour.base_price} × {guestCount} guests</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between font-heading font-bold text-lg text-[#1c1b1b]">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={ctaDisabled}
          onClick={handleBookNow}
          className="block w-full bg-[#4CBB17] text-[#1c1b1b] text-center font-heading font-bold text-base py-4 rounded-full hover:bg-[#3a960e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
