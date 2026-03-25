import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import ConfirmationSummary from "@/components/confirmation/ConfirmationSummary";
import type { Booking, Tour, Departure } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed | EMO Tours CDMX",
};

interface ConfirmationPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Generate a readable order reference from a booking UUID.
 * Format: #EMO-XXXX-MX where XXXX is derived from the booking id.
 */
function generateOrderReference(bookingId: string): string {
  const cleaned = bookingId.replace(/-/g, "").toUpperCase();
  const segment = cleaned.slice(0, 4);
  return `#EMO-${segment}-MX`;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  // Fetch booking by stripe_session_id
  const { data: bookingData, error: bookingError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (bookingError || !bookingData) {
    redirect("/");
  }

  const booking = bookingData as Booking;

  // Only show confirmation for paid bookings
  if (booking.payment_status !== "paid") {
    redirect("/");
  }

  // Fetch tour and departure in parallel
  const [tourResult, departureResult] = await Promise.all([
    supabaseAdmin.from("tours").select("*").eq("id", booking.tour_id).single(),
    supabaseAdmin
      .from("departures")
      .select("*")
      .eq("id", booking.departure_id)
      .single(),
  ]);

  if (tourResult.error || !tourResult.data) {
    redirect("/");
  }
  if (departureResult.error || !departureResult.data) {
    redirect("/");
  }

  const tour = tourResult.data as Tour;
  const departure = departureResult.data as Departure;

  // Format date
  const dateObj = new Date(departure.date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time
  const formattedTime = departure.time.slice(0, 5);

  const orderReference = generateOrderReference(booking.id);

  return (
    <ConfirmationSummary
      orderReference={orderReference}
      tourTitle={tour.title}
      date={formattedDate}
      time={formattedTime}
      guestCount={booking.guest_count}
      total={booking.total}
      meetingPoint={tour.meeting_point}
    />
  );
}
