import { supabaseAdmin } from "@/lib/supabase/server";
import type { Metadata } from "next";
import CancelForm from "./CancelForm";

export const metadata: Metadata = {
  title: "Cancel Booking | EMO Tours CDMX",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function CancelBookingPage({ params }: Props) {
  const { token } = await params;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("id, booking_status, customer_full_name, guest_count, total, tours(title), departures(date, time)")
    .eq("cancel_token", token)
    .single();

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#fcf8f8] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-[#d4d4d4] mb-4 block">link_off</span>
          <h1 className="font-heading text-2xl font-bold text-[#1c1b1b] mb-2">Invalid Link</h1>
          <p className="text-[#78716c]">This cancellation link is not valid.</p>
        </div>
      </div>
    );
  }

  if (booking.booking_status === "cancelled") {
    return (
      <div className="min-h-screen bg-[#fcf8f8] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-[#a8a29e] mb-4 block">event_busy</span>
          <h1 className="font-heading text-2xl font-bold text-[#1c1b1b] mb-2">Already Cancelled</h1>
          <p className="text-[#78716c]">This booking has already been cancelled.</p>
        </div>
      </div>
    );
  }

  const tour = booking.tours as unknown as { title: string } | null;
  const departure = booking.departures as unknown as { date: string; time: string } | null;

  return (
    <div className="min-h-screen bg-[#fcf8f8] py-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <span className="material-symbols-outlined text-5xl text-[#ef4444] mb-4 block">warning</span>
          <h1 className="font-heading text-3xl font-bold text-[#1c1b1b] mb-2">Cancel Booking</h1>
          <p className="text-[#78716c]">Are you sure you want to cancel this booking?</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 text-[#78716c]">Name</td>
                <td className="py-2 text-[#1c1b1b] font-medium text-right">{booking.customer_full_name}</td>
              </tr>
              <tr>
                <td className="py-2 text-[#78716c]">Tour</td>
                <td className="py-2 text-[#1c1b1b] font-medium text-right">{tour?.title}</td>
              </tr>
              {departure && (
                <>
                  <tr>
                    <td className="py-2 text-[#78716c]">Date</td>
                    <td className="py-2 text-[#1c1b1b] font-medium text-right">{departure.date}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-[#78716c]">Time</td>
                    <td className="py-2 text-[#1c1b1b] font-medium text-right">{departure.time}</td>
                  </tr>
                </>
              )}
              <tr>
                <td className="py-2 text-[#78716c]">Guests</td>
                <td className="py-2 text-[#1c1b1b] font-medium text-right">{booking.guest_count}</td>
              </tr>
              <tr>
                <td className="py-2 text-[#78716c]">Total</td>
                <td className="py-2 text-[#1c1b1b] font-medium text-right">${Number(booking.total).toFixed(2)} USD</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CancelForm token={token} />
      </div>
    </div>
  );
}
