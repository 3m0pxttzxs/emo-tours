import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import MetadataChips from "@/components/tours/MetadataChips";
import FaqAccordion from "@/components/tours/FaqAccordion";
import TourCard from "@/components/tours/TourCard";
import BookingModule from "@/components/booking/BookingModule";
import { weekdayName, formatSchedule, isRequestOnly } from "@/lib/schedule";
import type { Tour, Departure } from "@/types";
import type { Metadata } from "next";

export const revalidate = 3600;

/* ── Data fetching helpers ── */

async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("tours")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .eq("active", true)
      .single();
    if (error || !data) return null;
    return data as Tour;
  } catch {
    return null;
  }
}

async function getDepartures(tourId: string): Promise<Departure[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("departures")
      .select("*")
      .eq("tour_id", tourId)
      .eq("active", true)
      .eq("hidden", false);
    if (error || !data) return [];
    return data as Departure[];
  } catch {
    return [];
  }
}

async function getRelatedTours(currentSlug: string): Promise<Tour[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("tours")
      .select("*")
      .eq("published", true)
      .eq("active", true)
      .neq("slug", currentSlug)
      .neq("type", "custom")
      .limit(3);
    if (error || !data) return [];
    return data as Tour[];
  } catch {
    return [];
  }
}

/* ── SSG: generateStaticParams ── */
export async function generateStaticParams() {
  try {
    const { data, error } = await supabaseAdmin
      .from("tours")
      .select("slug")
      .eq("published", true)
      .eq("active", true);
    if (error || !data) return [];
    return data.map((t: { slug: string }) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour Not Found | EMO Tours CDMX" };
  return {
    title: `${tour.title} | EMO Tours CDMX`,
    description: tour.short_description,
    openGraph: { images: [tour.cover_image] },
  };
}

/* ── Page Component ── */
export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return notFound();

  // Custom tours redirect to custom-tours page
  if (tour.type === "custom") redirect("/custom-tours");

  const [departures, relatedTours] = await Promise.all([
    getDepartures(tour.id),
    getRelatedTours(tour.slug),
  ]);

  const requestOnly = isRequestOnly(tour.type, tour.weekday);
  const dayName = weekdayName(tour.weekday);
  const availableCount = departures.filter((d) => !d.sold_out).length;
  const availabilityLabel = requestOnly
    ? "By request"
    : availableCount > 0
      ? `${availableCount} dates available`
      : "Check dates";
  const scheduleLabel = formatSchedule(tour.weekday, tour.departure_time);

  return (
    <div className="bg-[#fcf8f8] -mt-[72px]">
      <HeroSection tour={tour} requestOnly={requestOnly} dayName={dayName} />

      <section className="mx-auto max-w-[1440px] px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-12">
            <MetadataChips
              area={tour.area}
              duration={tour.duration}
              meetingPoint={tour.meeting_point}
              language={tour.language}
              tourType={tour.type === "private" ? "Private" : "Shared"}
              availability={availabilityLabel}
              schedule={scheduleLabel}
            />
            <DescriptionSection description={tour.full_description} />
            {tour.highlights.length > 0 && (
              <HighlightsSection highlights={tour.highlights} />
            )}
            {tour.faq_items.length > 0 && (
              <div>
                <h2 className="font-heading text-3xl font-bold text-[#1c1b1b] mb-6">
                  Frequently Asked Questions
                </h2>
                <FaqAccordion items={tour.faq_items} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <BookingModule tour={tour} departures={departures} />
          </div>
        </div>
      </section>

      {relatedTours.length > 0 && (
        <RelatedToursSection tours={relatedTours} />
      )}
    </div>
  );
}

/* ── HERO SECTION ── */
function HeroSection({
  tour,
  requestOnly,
  dayName,
}: {
  tour: Tour;
  requestOnly: boolean;
  dayName: string | null;
}) {
  return (
    <section className="relative h-[500px] md:h-[716px] overflow-hidden rounded-b-xl">
      <Image
        src={tour.cover_image}
        alt={tour.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <div className="mx-auto max-w-[1440px]">
          {requestOnly ? (
            <span className="inline-block bg-[#1c1b1b] text-white text-xs font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              Private · By Request
            </span>
          ) : (
            <span className="inline-block bg-[#4CBB17] text-[#1c1b1b] text-xs font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              Every {dayName}{tour.departure_time ? ` at ${tour.departure_time}` : ""}
            </span>
          )}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold text-white leading-[0.95] tracking-tighter max-w-4xl">
            {tour.title}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-body">
            {tour.short_description}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── DESCRIPTION ── */
function DescriptionSection({ description }: { description: string }) {
  return (
    <div>
      <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-2">
        The Urban Narrative
      </p>
      <p className="text-xl text-[#1c1b1b] leading-relaxed font-body">
        {description}
      </p>
    </div>
  );
}

/* ── HIGHLIGHTS ── */
function HighlightsSection({ highlights }: { highlights: string[] }) {
  return (
    <div className="bg-[#f5f0ee] p-8 md:p-12 rounded-xl">
      <h2 className="font-heading text-3xl font-bold text-[#1c1b1b] mb-8">
        What You&apos;ll See
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#4CBB17] text-xl mt-0.5">
              location_on
            </span>
            <span className="text-[#1c1b1b] text-lg font-body">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── INCLUSIONS ── */
const inclusionIcons = ["restaurant", "confirmation_number", "local_activity"];
function InclusionsSection({ items }: { items: string[] }) {
  return (
    <div>
      <h2 className="font-heading text-3xl font-bold text-[#1c1b1b] mb-6">
        Inclusions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white p-5 rounded-xl border border-[#ebe7e7]/40"
          >
            <span className="material-symbols-outlined text-[#4CBB17] text-2xl">
              {inclusionIcons[i % inclusionIcons.length]}
            </span>
            <span className="text-[#1c1b1b] font-medium font-body">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── RELATED TOURS ── */
function RelatedToursSection({ tours }: { tours: Tour[] }) {
  return (
    <section className="bg-[#f5f0ee] py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
          Keep Exploring
        </p>
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-[#1c1b1b] tracking-tighter mb-12">
          Related Experiences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
