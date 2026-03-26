import { supabaseAdmin } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Leave a Review | EMO Tours CDMX",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;

  const { data: review } = await supabaseAdmin
    .from("reviews")
    .select("id, token_used, reviewer_name, tours(title)")
    .eq("review_token", token)
    .single();

  if (!review) {
    return (
      <div className="min-h-screen bg-[#fcf8f8] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-[#d4d4d4] mb-4 block">
            link_off
          </span>
          <h1 className="font-heading text-2xl font-bold text-[#1c1b1b] mb-2">
            Invalid Review Link
          </h1>
          <p className="text-[#78716c]">
            This review link is not valid. Please check the link in your email and try again.
          </p>
        </div>
      </div>
    );
  }

  if (review.token_used) {
    return (
      <div className="min-h-screen bg-[#fcf8f8] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-[#4cbb17] mb-4 block"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <h1 className="font-heading text-2xl font-bold text-[#1c1b1b] mb-2">
            Already Submitted
          </h1>
          <p className="text-[#78716c]">
            This review link has already been used. Thank you for your feedback!
          </p>
        </div>
      </div>
    );
  }

  const tourTitle = ((review.tours as unknown as { title: string } | null))?.title ?? "your EMO Tour";

  return (
    <div className="min-h-screen bg-[#fcf8f8] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
            Share Your Experience
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1c1b1b] tracking-tight">
            How was {tourTitle}?
          </h1>
          <p className="text-[#78716c] mt-3">
            Hi {review.reviewer_name}, we would love to hear about your experience!
          </p>
        </div>
        <ReviewForm token={token} />
      </div>
    </div>
  );
}
