import { supabaseAdmin } from "@/lib/supabase/server";
import ReviewsManager from "@/components/admin/ReviewsManager";

async function getReviews() {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*, tours(title)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
  return data;
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  return <ReviewsManager initialReviews={reviews} />;
}
