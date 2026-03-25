import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import type { Tour, Departure } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | EMO Tours CDMX",
};

interface CheckoutPageProps {
  searchParams: Promise<{ tourId?: string; departureId?: string; guestCount?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const tourId = params.tourId;
  const departureId = params.departureId;
  const guestCount = Number(params.guestCount) || 1;

  if (!tourId || !departureId) {
    redirect("/tours");
  }

  // Fetch tour
  const { data: tourData, error: tourError } = await supabaseAdmin
    .from("tours")
    .select("*")
    .eq("id", tourId)
    .single();

  if (tourError || !tourData) {
    redirect("/tours");
  }

  // Fetch departure
  const { data: departureData, error: departureError } = await supabaseAdmin
    .from("departures")
    .select("*")
    .eq("id", departureId)
    .single();

  if (departureError || !departureData) {
    redirect("/tours");
  }

  const tour = tourData as Tour;
  const departure = departureData as Departure;
  const total = tour.base_price * guestCount;

  // Format date for display
  const dateObj = new Date(departure.date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time for display
  const formattedTime = departure.time.slice(0, 5);

  const formId = "checkout-form";

  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <section className="mx-auto max-w-[1440px] px-6 py-12 md:py-20">
        {/* Page header */}
        <div className="mb-10">
          <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-2">
            Secure Checkout
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-[#1c1b1b] tracking-tighter">
            Complete Your Booking
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left column — Form */}
          <div className="lg:col-span-7">
            <CheckoutForm
              tourId={tour.id}
              departureId={departure.id}
              guestCount={guestCount}
              tourTitle={tour.title}
              formId={formId}
            />
          </div>

          {/* Right column — Order Summary (sticky) */}
          <div className="lg:col-span-5">
            <OrderSummary
              tourTitle={tour.title}
              tourImage={tour.cover_image}
              tourType={tour.type === "private" ? "Private" : "Shared"}
              date={formattedDate}
              time={formattedTime}
              guestCount={guestCount}
              basePrice={tour.base_price}
              total={total}
              formId={formId}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
