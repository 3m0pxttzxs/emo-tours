import { supabaseAdmin } from "@/lib/supabase/server";
import BookingsManager from "@/components/admin/BookingsManager";

async function getBookings() {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, tours(title), departures(date, time)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
  return data;
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return <BookingsManager initialBookings={bookings} />;
}
