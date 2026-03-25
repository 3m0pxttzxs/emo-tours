import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Tour } from "@/types";
import TourForm from "@/components/admin/TourForm";

async function getTour(id: string): Promise<Tour | null> {
  const { data, error } = await supabaseAdmin
    .from("tours")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Tour;
}

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-[#1c1b1b] mb-8">
        Edit Tour: {tour.title}
      </h1>
      <TourForm tour={tour} mode="edit" />
    </div>
  );
}
