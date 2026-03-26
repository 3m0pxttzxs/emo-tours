"use client";

import Link from "next/link";

interface ConfirmationSummaryProps {
  orderReference: string;
  tourTitle: string;
  date: string;
  time: string;
  guestCount: number;
  total: number;
  meetingPoint: string;
}

export default function ConfirmationSummary({
  orderReference,
  tourTitle,
  date,
  time,
  guestCount,
  total,
  meetingPoint,
}: ConfirmationSummaryProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetingPoint + " Mexico City")}`;

  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <section className="mx-auto max-w-[1440px] px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
            Booking Confirmed
          </p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl text-[#1c1b1b] tracking-tighter leading-[0.95] max-w-3xl">
            Your journey is confirmed.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[#78716c] max-w-2xl leading-relaxed">
            Pack your curiosity — we&apos;ll handle the rest. Below you&apos;ll find everything you need for your upcoming experience.
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-10">
            {/* Booking summary card */}
            <div className="bg-[#f5f0ee] rounded-xl p-6 md:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-xl text-[#1c1b1b]">
                  Booking Summary
                </h2>
                <span className="inline-flex items-center gap-1.5 bg-[#4CBB17]/10 text-[#4CBB17] text-xs font-heading font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Confirmed
                </span>
              </div>

              <div className="border-t border-[#ebe7e7]" />

              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <SummaryItem label="Order Reference" value={orderReference} />
                <SummaryItem label="Tour" value={tourTitle} />
                <SummaryItem label="Date" value={date} />
                <SummaryItem label="Time" value={time} />
                <SummaryItem
                  label="Guests"
                  value={`${guestCount} ${guestCount === 1 ? "person" : "people"}`}
                />
                <SummaryItem label="Total Paid" value={`$${total}`} />
              </div>
            </div>

            {/* What to expect next */}
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1c1b1b]">
                What to expect next
              </h2>

              <div className="space-y-6">
                <StepItem
                  number="01"
                  title="Curator Connect"
                  description={`Your curator will reach out within 24 hours to introduce themselves and share any last-minute tips for your ${tourTitle} experience.`}
                />
                <StepItem
                  number="02"
                  title="Arrival Protocol"
                  description={`Arrive at ${meetingPoint} 10 minutes before your scheduled time. Look for the EMO Tours guide with the green lanyard.`}
                />
              </div>
            </div>

            {/* WhatsApp CTA banner */}
            <div className="bg-[#4CBB17] rounded-xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-heading font-bold text-lg text-[#1c1b1b] mb-1">
                  Questions before your tour?
                </h3>
                <p className="text-[#1c1b1b]/70 text-sm">
                  Chat with us on WhatsApp for instant support.
                </p>
              </div>
              <a
                href="https://wa.me/5215512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1c1b1b] text-white font-heading font-bold text-sm px-6 py-3 rounded-full hover:bg-[#1c1b1b]/90 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                Open WhatsApp
              </a>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Meeting point */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-2xl text-[#1c1b1b]">
                Meeting Point
              </h2>
              <div className="bg-[#f5f0ee] rounded-xl p-6 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#4CBB17] text-4xl mb-3">location_on</span>
                <p className="text-[#1c1b1b] font-heading font-bold text-lg">{meetingPoint}</p>
                <p className="text-[#78716c] text-sm mt-1">Mexico City</p>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1c1b1b] text-white font-heading font-bold text-sm px-6 py-3 rounded-full hover:bg-[#1c1b1b]/90 transition-colors w-full justify-center"
              >
                <span className="material-symbols-outlined text-lg">open_in_new</span>
                Open in Google Maps
              </a>
            </div>

            {/* Keep exploring */}
            <div className="bg-[#f5f0ee] rounded-xl p-6 md:p-8 space-y-4">
              <h3 className="font-heading font-bold text-xl text-[#1c1b1b]">
                Keep exploring
              </h3>
              <p className="text-sm text-[#78716c]">
                Discover more experiences and stories from Mexico City.
              </p>
              <div className="space-y-3">
                <Link
                  href="/tours"
                  className="flex items-center justify-between bg-white rounded-lg px-5 py-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4CBB17]">explore</span>
                    <span className="font-heading font-bold text-sm text-[#1c1b1b]">Browse Tours</span>
                  </div>
                  <span className="material-symbols-outlined text-[#78716c] group-hover:text-[#4CBB17] transition-colors">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-between bg-white rounded-lg px-5 py-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4CBB17]">home</span>
                    <span className="font-heading font-bold text-sm text-[#1c1b1b]">Back to Home</span>
                  </div>
                  <span className="material-symbols-outlined text-[#78716c] group-hover:text-[#4CBB17] transition-colors">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Helper sub-components ── */

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-[#78716c] font-bold mb-0.5">
        {label}
      </p>
      <p className="text-sm text-[#1c1b1b] font-medium">{value}</p>
    </div>
  );
}

function StepItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <span className="font-heading font-black text-4xl text-[#4CBB17]/20 leading-none select-none">
        {number}
      </span>
      <div>
        <h3 className="font-heading font-bold text-lg text-[#1c1b1b] mb-1">
          {title}
        </h3>
        <p className="text-[#78716c] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
