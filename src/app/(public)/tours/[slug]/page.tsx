import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import MetadataChips from "@/components/tours/MetadataChips";
import FaqAccordion from "@/components/tours/FaqAccordion";
import TourCard from "@/components/tours/TourCard";
import BookingModule from "@/components/booking/BookingModule";
import type { Tour, Departure } from "@/types";
import type { Metadata } from "next";

export const revalidate = 3600;

/* ── Fallback tours when Supabase is unavailable ── */
const fallbackTours: Tour[] = [
  {
    id: "1",
    title: "Historic Center Tour",
    slug: "historic-center",
    short_description:
      "Walk through centuries of history in the heart of Mexico City — from Aztec ruins to colonial masterpieces.",
    full_description:
      "Immerse yourself in the vibrant soul of Mexico City on this 4.5-hour walking tour through the Historic Center. Begin at the iconic Zócalo, one of the largest public squares in the world, and explore the ruins of Templo Mayor, the sacred heart of the Aztec empire. Marvel at the Diego Rivera murals inside the National Palace, stroll through the stunning Palacio de Correos, and discover hidden courtyards and street art along the way. The tour includes a culinary interlude at a traditional cantina where you will taste authentic Mexican flavors.",
    cover_image:
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&q=80",
      "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80",
      "https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=800&q=80",
    ],
    area: "Centro Histórico",
    duration: "4.5 Hours",
    meeting_point: "Zócalo Plaza",
    language: "EN / ES",
    type: "shared",
    base_price: 120,
    price_label: "$120/person",
    capacity_default: 8,
    active: true,
    published: true,
    featured: true,
    highlights: [
      "Templo Mayor archaeological site",
      "Diego Rivera Murals at the National Palace",
      "Palacio de Correos (Postal Palace)",
      "Traditional cantina culinary stop",
      "Hidden courtyards and street art",
    ],
    included_items: [
      "Culinary Interlude at a traditional cantina",
      "Entry Access to Templo Mayor",
      "Private Curator guide",
    ],
    faq_items: [
      {
        question: "What should I wear?",
        answer:
          "Comfortable walking shoes are essential. We recommend layers as weather can change quickly in the city center.",
      },
      {
        question: "Is the tour suitable for children?",
        answer:
          "Yes! Children aged 6 and above are welcome. Kids under 12 receive a 50% discount.",
      },
      {
        question: "What happens if it rains?",
        answer:
          "The tour runs rain or shine. Many stops are indoors, and we provide umbrellas if needed.",
      },
    ],
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Bellas Artes + Alameda Tour",
    slug: "bellas-artes-alameda",
    short_description:
      "Discover the artistic jewel of Mexico City — from Art Nouveau grandeur to peaceful park strolls.",
    full_description:
      "Explore the cultural heart of Mexico City on this 3-hour tour centered around the magnificent Palacio de Bellas Artes and the historic Alameda Central park. Admire the breathtaking Art Nouveau and Art Deco architecture of Bellas Artes, home to murals by Siqueiros, Orozco, and Rivera.",
    cover_image:
      "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80",
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&q=80",
    ],
    area: "Bellas Artes / Alameda",
    duration: "3 Hours",
    meeting_point: "Palacio de Bellas Artes",
    language: "EN / ES",
    type: "shared",
    base_price: 85,
    price_label: "$85/person",
    capacity_default: 6,
    active: true,
    published: true,
    featured: true,
    highlights: [
      "Palacio de Bellas Artes interior and murals",
      "Alameda Central park history",
      "Museo Mural Diego Rivera",
      "Art Nouveau and Art Deco architecture",
    ],
    included_items: [
      "Entry Access to Bellas Artes",
      "Professional bilingual guide",
      "Bottled water",
    ],
    faq_items: [
      {
        question: "Is photography allowed inside Bellas Artes?",
        answer:
          "Photography without flash is allowed in most areas. Tripods are not permitted.",
      },
      {
        question: "How much walking is involved?",
        answer:
          "The tour covers approximately 2.5 km at a leisurely pace with several stops.",
      },
    ],
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    title: "Coyoacán Tour",
    slug: "coyoacan",
    short_description:
      "Wander the cobblestone streets of Frida Kahlo's beloved neighborhood — art, culture, and local flavors.",
    full_description:
      "Step into the bohemian charm of Coyoacán on this 5-hour private tour through one of Mexico City's most beloved neighborhoods. Visit the iconic Casa Azul (Frida Kahlo Museum), explore the lively Jardín Centenario and Mercado de Coyoacán, and discover hidden gems.",
    cover_image:
      "https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=800&q=80",
      "https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80",
    ],
    area: "Coyoacán",
    duration: "5 Hours",
    meeting_point: "Jardín Centenario",
    language: "EN / ES",
    type: "private",
    base_price: 150,
    price_label: "$150/person",
    capacity_default: 10,
    active: true,
    published: true,
    featured: true,
    highlights: [
      "Casa Azul — Frida Kahlo Museum",
      "Jardín Centenario and Mercado de Coyoacán",
      "Viveros de Coyoacán park",
      "Local street food tastings",
      "Colonial architecture walking route",
    ],
    included_items: [
      "Entry Access to Casa Azul (Frida Kahlo Museum)",
      "Private bilingual guide",
      "Street food tasting stops",
    ],
    faq_items: [
      {
        question: "Do I need to book Casa Azul tickets separately?",
        answer:
          "No, entry to Casa Azul is included in the tour price. We handle the reservation for you.",
      },
      {
        question: "Can the tour be customized?",
        answer:
          "Absolutely! As a private tour, we can adjust the itinerary based on your interests.",
      },
    ],
    created_at: "",
    updated_at: "",
  },
];

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

    if (error || !data) {
      // Try fallback
      const fallback = fallbackTours.find((t) => t.slug === slug);
      return fallback ?? null;
    }
    return data as Tour;
  } catch {
    const fallback = fallbackTours.find((t) => t.slug === slug);
    return fallback ?? null;
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

    if (error || !data || data.length === 0) {
      return fallbackTours.filter(
        (t) => t.slug !== currentSlug && t.type !== "custom"
      );
    }
    return data as Tour[];
  } catch {
    return fallbackTours.filter(
      (t) => t.slug !== currentSlug && t.type !== "custom"
    );
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

    if (error || !data) {
      return fallbackTours.map((t) => ({ slug: t.slug }));
    }
    return data.map((t: { slug: string }) => ({ slug: t.slug }));
  } catch {
    return fallbackTours.map((t) => ({ slug: t.slug }));
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

  if (!tour) {
    return { title: "Tour Not Found | EMO Tours CDMX" };
  }

  return {
    title: `${tour.title} | EMO Tours CDMX`,
    description: tour.short_description,
    openGraph: {
      images: [tour.cover_image],
    },
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
  if (tour.type === "custom") redirect("/custom-tours");

  const [departures, relatedTours] = await Promise.all([
    getDepartures(tour.id),
    getRelatedTours(tour.slug),
  ]);

  // Compute availability label
  const availableCount = departures.filter((d) => !d.sold_out).length;
  const availabilityLabel =
    availableCount > 0 ? `${availableCount} dates available` : "Check dates";

  return (
    <div className="bg-[#fcf8f8] -mt-[72px]">
      {/* ═══════════════ HERO IMAGE ═══════════════ */}
      <HeroSection tour={tour} />

      {/* ═══════════════ CONTENT LAYOUT ═══════════════ */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Metadata Chips */}
            <MetadataChips
              area={tour.area}
              duration={tour.duration}
              meetingPoint={tour.meeting_point}
              language={tour.language}
              tourType={tour.type === "private" ? "Private" : "Shared"}
              availability={availabilityLabel}
            />

            {/* Description */}
            <DescriptionSection description={tour.full_description} />

            {/* Highlights */}
            {tour.highlights.length > 0 && (
              <HighlightsSection highlights={tour.highlights} />
            )}

            {/* Inclusions */}
            {tour.included_items.length > 0 && (
              <InclusionsSection items={tour.included_items} />
            )}

            {/* FAQ */}
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

      {/* ═══════════════ RELATED TOURS ═══════════════ */}
      {relatedTours.length > 0 && (
        <RelatedToursSection tours={relatedTours} />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────
   HERO SECTION
   ──────────────────────────────────────────────────── */
function HeroSection({ tour }: { tour: Tour }) {
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
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <div className="mx-auto max-w-[1440px]">
          <span className="inline-block bg-[#4CBB17] text-[#1c1b1b] text-xs font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            Signature Experience
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold text-white leading-[0.95] tracking-tighter max-w-4xl">
            {tour.title}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {tour.short_description}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   DESCRIPTION — "The Urban Narrative"
   ──────────────────────────────────────────────────── */
function DescriptionSection({ description }: { description: string }) {
  return (
    <div>
      <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-2">
        The Urban Narrative
      </p>
      <p className="text-xl text-[#1c1b1b] leading-relaxed">{description}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   HIGHLIGHTS — "What You'll See"
   ──────────────────────────────────────────────────── */
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
            <span className="text-[#1c1b1b] text-lg">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   INCLUSIONS
   ──────────────────────────────────────────────────── */
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
            <span className="text-[#1c1b1b] font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   RELATED TOURS
   ──────────────────────────────────────────────────── */
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
