import { supabaseAdmin } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ManageBookingClient from "./ManageBookingClient";

export const metadata: Metadata = {
  title: "Manage Booking | EMO Tours CDMX",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ManageBookingPage({ params }: Props) {
  const { token } = await params;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select(
      "id, booking_status, guest_count, times_cancelled, times_rescheduled, tour_id, departure_id, customer_full_name, tours(title), departures(date, time)"
    )
    .eq("cancel_token", token)
    .single();

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#fcf8f8] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-[#d4d4d4] mb-4 block">link_off</span>
          <h1 className="font-heading text-2xl font-bold text-[#1c1b1b] mb-2">Invalid Link</h1>
          <p className="text-[#78716c]">This booking link is not valid. Please check the link in your confirmation email.</p>
        </div>
      </div>
    );
  }

  // Fetch available departures for rescheduling
  const { data: departures } = await supabaseAdmin
    .from("departures")
    .select("id, date, time, spots_left, sold_out")
    .eq("tour_id", booking.tour_id)
    .eq("active", true)
    .eq("hidden", false)
    .eq("sold_out", false)
    .gte("spots_left", booking.guest_count)
    .neq("id", booking.departure_id)
    .order("date");

  const tourTitle = (booking.tours as unknown as { title: string })?.title ?? "your tour";
  const departure = booking.departures as unknown as { date: string; time: string } | null;

  return (
    <div className="min-h-screen bg-[#fcf8f8] py-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
            Manage Booking
          </p>
          <h1 className="font-heading text-4xl font-bold text-[#1c1b1b] tracking-tight">
            {tourTitle}
          </h1>
          {departure && (
            <p className="text-[#78716c] mt-3">
              {formatDate(departure.date)} at {formatTime(departure.time)}
            </p>
          )}
          <p className="text-[#78716c] mt-1">
            Hi {booking.customer_full_name}
          </p>
        </div>

        <ManageBookingClient
          token={token}
          bookingStatus={booking.booking_status}
          timesCancelled={booking.times_cancelled}
          timesRescheduled={booking.times_rescheduled}
          departures={departures ?? []}
          currentDepartureId={booking.departure_id}
        />
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}:00 ${period}` : `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
