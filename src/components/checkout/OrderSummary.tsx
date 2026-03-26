"use client";

import Image from "next/image";

interface OrderSummaryProps {
  tourTitle: string;
  tourImage: string;
  tourType: string;
  date: string;
  time: string;
  guestCount: number;
  basePrice: number;
  total: number;
  formId: string;
}

export default function OrderSummary({
  tourTitle,
  tourImage,
  tourType,
  date,
  time,
  guestCount,
  basePrice,
  total,
  formId,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-[96px] space-y-6">
      {/* Main card */}
      <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(28,27,27,0.04)] overflow-hidden">
        {/* Tour image header */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={tourImage}
            alt={tourTitle}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block bg-[#4CBB17] text-[#1c1b1b] text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              {tourType}
            </span>
            <h3 className="text-white font-heading font-bold text-lg leading-tight">
              {tourTitle}
            </h3>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem icon="calendar_today" label="Date" value={date} />
            <DetailItem icon="schedule" label="Time" value={time} />
            <DetailItem icon="group" label="Guests" value={`${guestCount} ${guestCount === 1 ? "person" : "people"}`} />
            <DetailItem icon="timer" label="Duration" value="See details" />
          </div>

          {/* Divider */}
          <div className="border-t border-[#ebe7e7]" />

          {/* Price breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[#78716c]">
              <span>${basePrice} / person × {guestCount} {guestCount === 1 ? "guest" : "guests"}</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-sm text-[#78716c]">
              <span>Booking fee</span>
              <span className="text-[#4CBB17] font-medium">$0</span>
            </div>
            <div className="flex justify-between text-sm text-[#78716c]">
              <span>Taxes</span>
              <span>$0</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#ebe7e7]" />

          {/* Total */}
          <div className="flex justify-between items-baseline">
            <span className="font-heading font-bold text-lg text-[#1c1b1b]">Total</span>
            <span className="font-heading font-bold text-3xl text-[#1c1b1b]">${total}</span>
          </div>

          {/* Confirm & Pay button */}
          <button
            type="submit"
            form={formId}
            className="block w-full bg-[#4CBB17] text-[#1c1b1b] text-center font-heading font-bold text-base py-4 rounded-full hover:bg-[#3a960e] transition-colors"
          >
            Confirm &amp; Pay
          </button>

          {/* SSL badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#78716c]">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>SSL encrypted &amp; secure payment</span>
          </div>
        </div>
      </div>

      {/* Trust / assistance badge */}
      <div className="bg-white rounded-xl p-5 shadow-[0_8px_24px_rgba(28,27,27,0.04)] text-center">
        <p className="text-sm text-[#78716c]">
          Need assistance?{" "}
          <a href="mailto:inkedsad@gmail.com" className="text-[#4CBB17] font-medium hover:underline">
            inkedsad@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="material-symbols-outlined text-[#4CBB17] text-lg mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#78716c] font-bold">{label}</p>
        <p className="text-sm text-[#1c1b1b] font-medium">{value}</p>
      </div>
    </div>
  );
}
