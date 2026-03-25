import { supabaseAdmin } from "@/lib/supabase/server";
import TourCard from "@/components/tours/TourCard";
import type { Tour } from "@/types";

export const revalidate = 3600;

export const metadata = {
  title: "Tours | EMO Tours CDMX",
  description:
    "Explore curated walking tours through Mexico City — from historic landmarks to hidden neighborhoods.",
};

/* ── Fallback data when Supabase is unavailable ── */
const fallbackTours: Tour[] = [
  {
    id: "1",
    title: "Historic Center Tour",
    slug: "historic-center",
    short_description:
      "Walk through centuries of history in the heart of Mexico City — from Aztec ruins to colonial masterpieces.",
    full_description: "",
    cover_image:
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=1200&q=80",
    gallery_images: [],
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
    highlights: [],
    included_items: [],
    faq_items: [],
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Bellas Artes + Alameda Tour",
    slug: "bellas-artes-alameda",
    short_description:
      "Discover the artistic jewel of Mexico City — from Art Nouveau grandeur to peaceful park strolls.",
    full_description: "",
    cover_image:
      "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80",
    gallery_images: [],
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
    highlights: [],
    included_items: [],
    faq_items: [],
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    title: "Coyoacán Tour",
    slug: "coyoacan",
    short_description:
      "Wander the cobblestone streets of Frida Kahlo's beloved neighborhood — art, culture, and local flavors.",
    full_description: "",
    cover_image:
      "https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=1200&q=80",
    gallery_images: [],
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
    highlights: [],
    included_items: [],
    faq_items: [],
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    title: "Custom Private Tour",
    slug: "custom-private-tour",
    short_description:
      "Design your own Mexico City experience — tell us your interests and we'll craft the perfect itinerary.",
    full_description: "",
    cover_image:
      "https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=1200&q=80",
    gallery_images: [],
    area: "CDMX",
    duration: "Flexible",
    meeting_point: "To be arranged",
    language: "EN / ES",
    type: "custom",
    base_price: 0,
    price_label: "Quote",
    capacity_default: 1,
    active: true,
    published: true,
    featured: true,
    highlights: [],
    included_items: [],
    faq_items: [],
    created_at: "",
    updated_at: "",
  },
];

async function getPublishedTours(): Promise<Tour[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("tours")
      .select("*")
      .eq("published", true)
      .eq("active", true);

    if (error || !data || data.length === 0) return fallbackTours;
    return data as Tour[];
  } catch {
    return fallbackTours;
  }
}

export default async function ToursListingPage() {
  const tours = await getPublishedTours();

  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      {/* ═══════════════ HEADER SECTION ═══════════════ */}
      <section className="mx-auto max-w-[1440px] px-6 pt-20 md:pt-28 pb-12">
        <h1 className="font-heading text-[3.5rem] md:text-[5rem] font-bold tracking-[-0.04em] text-[#1c1b1b] leading-[0.95]">
          Explore Mexico City Routes
        </h1>
        <div className="w-24 h-1 bg-[#4CBB17] mt-6" />
      </section>

      {/* ═══════════════ FILTER BAR ═══════════════ */}
      <section className="mx-auto max-w-[1440px] px-6 border-b border-[#e5e2de]">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1 border border-[#d4d0cb] rounded-full px-4 py-2 text-sm text-[#1c1b1b] font-heading font-medium hover:bg-[#1c1b1b] hover:text-white transition-colors"
            >
              Tour Type
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 border border-[#d4d0cb] rounded-full px-4 py-2 text-sm text-[#1c1b1b] font-heading font-medium hover:bg-[#1c1b1b] hover:text-white transition-colors"
            >
              Duration
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 border border-[#d4d0cb] rounded-full px-4 py-2 text-sm text-[#1c1b1b] font-heading font-medium hover:bg-[#1c1b1b] hover:text-white transition-colors"
            >
              Private/Shared
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
          </div>
          <span className="text-sm text-[#78716c] hidden sm:block">
            Displaying {tours.length} curated routes
          </span>
        </div>
      </section>

      {/* ═══════════════ TOUR GRID ═══════════════ */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className={index % 2 === 1 ? "md:pt-24" : ""}
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
