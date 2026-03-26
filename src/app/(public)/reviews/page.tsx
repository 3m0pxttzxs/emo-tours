import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import ReviewCard from "@/components/reviews/ReviewCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Reviews & Experiences | EMO Tours CDMX",
};

async function getApprovedReviews() {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*, tours(title)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data ?? []).map((r) => ({
    ...r,
    tour_title: ((r.tours as unknown as { title: string } | null))?.title ?? "EMO Tour",
  }));
}

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const count = reviews.length;
  const avgRating =
    count > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / count) * 10
        ) / 10
      : 0;

  return (
    <div className="bg-[#fcf8f8]">
      <HeroSection />
      <MetricsSection avgRating={avgRating} count={count} />
      {count > 0 ? (
        <ReviewsList reviews={reviews} />
      ) : (
        <EmptyState />
      )}
      <FinalCTA />
    </div>
  );
}

/* ── HERO ── */
function HeroSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-16 md:pt-24 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-7">
          <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-4">
            Guest Reviews
          </p>
          <h1 className="font-heading text-7xl md:text-[9rem] font-bold tracking-tighter uppercase leading-[0.85] text-[#1c1b1b]">
            The City,
            <br />
            Through
            <br />
            Your Eyes
          </h1>
        </div>
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&q=80"
              alt="Mexico City street scene"
              fill
              priority
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── METRICS ── */
function MetricsSection({ avgRating, count }: { avgRating: number; count: number }) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#f6f3f2] p-8 rounded-xl">
          <p className="font-heading font-black text-4xl md:text-5xl text-[#1c1b1b] tracking-tight">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-[#78716c] text-sm mt-2 font-heading font-medium">Average Rating</p>
        </div>
        <div className="bg-[#f6f3f2] p-8 rounded-xl">
          <p className="font-heading font-black text-4xl md:text-5xl text-[#1c1b1b] tracking-tight">
            {count > 0 ? count : "—"}
          </p>
          <p className="text-[#78716c] text-sm mt-2 font-heading font-medium">Reviews</p>
        </div>
        <div className="bg-[#f6f3f2] p-8 rounded-xl">
          <p className="font-heading font-black text-4xl md:text-5xl text-[#1c1b1b] tracking-tight">150+</p>
          <p className="text-[#78716c] text-sm mt-2 font-heading font-medium">Local Guides</p>
        </div>
        <div className="bg-[#f6f3f2] p-8 rounded-xl border-2 border-[#4cbb17]">
          <p className="font-heading font-black text-4xl md:text-5xl text-[#1c1b1b] tracking-tight">100%</p>
          <p className="text-[#78716c] text-sm mt-2 font-heading font-medium">Curation</p>
        </div>
      </div>
    </section>
  );
}

/* ── REVIEWS LIST ── */
interface ReviewData {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  tour_title: string;
  photo_url: string | null;
}

function ReviewsList({ reviews }: { reviews: ReviewData[] }) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-16">
      <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
        Guest Dispatches
      </p>
      <h2 className="font-heading font-black text-4xl md:text-6xl text-[#1c1b1b] tracking-tighter leading-[0.95] mb-12">
        What They Said
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <ReviewCard
            key={r.id}
            reviewer_name={r.reviewer_name}
            rating={r.rating}
            comment={r.comment}
            tour_title={r.tour_title}
            photo_url={r.photo_url}
          />
        ))}
      </div>
    </section>
  );
}

/* ── EMPTY STATE ── */
function EmptyState() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-20 text-center">
      <span className="material-symbols-outlined text-6xl text-[#d4d4d4] mb-4 block">rate_review</span>
      <h2 className="font-heading text-2xl font-bold text-[#1c1b1b] mb-2">No Reviews Yet</h2>
      <p className="text-[#78716c] max-w-md mx-auto mb-8">
        Be the first to share your Mexico City experience! Book a tour and leave your review after the adventure.
      </p>
      <Link
        href="/tours"
        className="inline-flex items-center bg-[#4cbb17] text-[#1c1b1b] rounded-full px-8 py-4 font-heading font-bold text-base hover:bg-[#3a960e] transition-colors"
      >
        Book a Tour
      </Link>
    </section>
  );
}

/* ── FINAL CTA ── */
function FinalCTA() {
  return (
    <section className="bg-[#1c1b1b] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 text-center">
        <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl text-white uppercase tracking-tighter leading-[0.9] max-w-3xl mx-auto">
          Become the Story
        </h2>
        <p className="mt-6 text-white/50 text-lg max-w-md mx-auto">
          Your Mexico City chapter starts here. Join travelers who left as storytellers.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/tours"
            className="inline-flex items-center bg-[#4cbb17] text-[#1c1b1b] rounded-full px-8 py-4 font-heading font-bold text-base hover:bg-[#3a960e] transition-colors"
          >
            Book a Tour
          </Link>
          <Link
            href="/custom-tours"
            className="inline-flex items-center border border-white/30 text-white rounded-full px-8 py-4 font-heading font-bold text-base hover:bg-white/10 transition-colors"
          >
            Design Your Own
          </Link>
        </div>
      </div>
    </section>
  );
}
