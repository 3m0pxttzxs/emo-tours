import { supabaseAdmin } from "@/lib/supabase/server";
import TourCard from "@/components/tours/TourCard";
import type { Tour } from "@/types";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tours | EMO Tours CDMX",
  description: "Curated weekly walking tours through Mexico City. One signature route each day.",
};

async function getPublishedTours(): Promise<Tour[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("tours")
      .select("*")
      .eq("published", true)
      .eq("active", true);
    if (error || !data) return [];
    return data as Tour[];
  } catch {
    return [];
  }
}

export default async function ToursListingPage() {
  const tours = await getPublishedTours();

  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <section className="mx-auto max-w-[1440px] px-6 pt-20 md:pt-28 pb-12">
        <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
          Weekly Scheduled Experiences
        </p>
        <h1 className="font-heading text-[3rem] md:text-[4.5rem] font-bold tracking-[-0.04em] text-[#1c1b1b] leading-[0.95]">
          Curated Weekly Routes Through CDMX
        </h1>
        <p className="mt-4 text-[#78716c] text-lg max-w-xl">
          One signature route each day. Transparent pricing. No surprises.
        </p>
        <div className="w-24 h-1 bg-[#4CBB17] mt-6" />
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-16 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
