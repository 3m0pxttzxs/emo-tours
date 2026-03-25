import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Reviews & Experiences | EMO Tours CDMX",
};

export default function ReviewsPage() {
  return (
    <div className="bg-[#fcf8f8]">
      <HeroSection />
      <MetricsSection />
      <FeaturedReview />
      <GuestDispatches />
      <VisualJournal />
      <FinalCTA />
    </div>
  );
}

/* ────────────────────────────────────────────────────
   HERO
   ──────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────
   METRICS
   ──────────────────────────────────────────────────── */
function MetricsSection() {
  const metrics = [
    { value: "4.9", label: "Average Rating" },
    { value: "12k+", label: "Stories Shared" },
    { value: "150+", label: "Local Guides" },
    { value: "100%", label: "Curation", highlight: true },
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`bg-[#f6f3f2] p-8 rounded-xl ${m.highlight ? "border-2 border-[#4cbb17]" : ""}`}
          >
            <p className="font-heading font-black text-4xl md:text-5xl text-[#1c1b1b] tracking-tight">
              {m.value}
            </p>
            <p className="text-[#78716c] text-sm mt-2 font-heading font-medium">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   FEATURED REVIEW
   ──────────────────────────────────────────────────── */
function FeaturedReview() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12">
      <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-6">
        Featured Story
      </p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-[300px] md:h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80"
            alt="Featured review photo"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-[#4cbb17] text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl italic text-[#1c1b1b] leading-relaxed font-body">
            &ldquo;We didn&apos;t just see Mexico City — we felt it. From the hidden mezcal bar in Roma Norte
            to the sunrise over Teotihuacán, every moment was curated with intention. This wasn&apos;t
            tourism. This was transformation.&rdquo;
          </blockquote>
          <div className="mt-8">
            <p className="font-heading font-bold text-[#1c1b1b]">Elena & Marco</p>
            <p className="text-[#78716c] text-sm">Milan, Italy · Historic Center Tour</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   GUEST DISPATCHES
   ──────────────────────────────────────────────────── */
function GuestDispatches() {
  const reviews = [
    {
      name: "Sarah M.",
      location: "New York, USA",
      stars: 5,
      tour: "Coyoacán Tour",
      text: "Our guide knew every hidden corner and story. The street food stops were incredible — places I never would have found on my own.",
    },
    {
      name: "James & Priya",
      location: "London, UK",
      stars: 5,
      tour: "Historic Center",
      text: "The architecture walk blew our minds. Standing inside the Postal Palace while our guide explained the Art Nouveau details was unforgettable.",
    },
    {
      name: "Tomoko H.",
      location: "Tokyo, Japan",
      stars: 5,
      tour: "Bellas Artes Tour",
      text: "I've traveled to 40+ countries and this was one of the most thoughtful, well-organized tours I've ever experienced. Truly special.",
    },
    {
      name: "Carlos R.",
      location: "Buenos Aires, Argentina",
      stars: 4,
      tour: "Custom Private",
      text: "They designed a full-day experience around my photography interests. Every location was perfectly timed for golden hour light.",
    },
    {
      name: "Anna & David",
      location: "Berlin, Germany",
      stars: 5,
      tour: "Night Tour",
      text: "The rooftop mezcal tasting with the city lights below was pure magic. Our guide's passion for CDMX was contagious.",
    },
    {
      name: "Mei-Lin C.",
      location: "Singapore",
      stars: 5,
      tour: "Food & Markets",
      text: "From the first taco to the last churro, every bite told a story. The market visit in La Merced was the highlight of our entire trip.",
    },
  ];

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
          <div
            key={r.name}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-heading font-bold text-[#1c1b1b]">{r.name}</p>
                <p className="text-[#78716c] text-xs">{r.location}</p>
              </div>
              <span className="inline-block bg-[#f6f3f2] text-[#1c1b1b] text-xs font-heading font-bold px-3 py-1 rounded-full">
                {r.tour}
              </span>
            </div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: r.stars }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[#4cbb17] text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="text-[#1c1b1b]/80 text-sm leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   VISUAL JOURNAL
   ──────────────────────────────────────────────────── */
function VisualJournal() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=600&q=80",
      alt: "Colorful street in Coyoacán",
      className: "col-span-1 row-span-2 aspect-[3/4]",
    },
    {
      src: "https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=600&q=80",
      alt: "Mexico City architecture",
      className: "col-span-1 aspect-square",
    },
    {
      src: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&q=80",
      alt: "Bellas Artes Palace",
      className: "col-span-1 aspect-square",
    },
    {
      src: "https://images.unsplash.com/photo-1518659526054-190340b32735?w=600&q=80",
      alt: "Street food market",
      className: "col-span-1 row-span-2 aspect-[3/4]",
    },
    {
      src: "https://images.unsplash.com/photo-1570737543098-0c32dc185b5c?w=600&q=80",
      alt: "Local artisan workshop",
      className: "col-span-2 aspect-[2/1]",
    },
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-16">
      <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
        Visual Journal
      </p>
      <h2 className="font-heading font-black text-4xl md:text-6xl text-[#1c1b1b] tracking-tighter leading-[0.95] mb-12">
        Moments Captured
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
        {images.map((img) => (
          <div
            key={img.alt}
            className={`relative rounded-xl overflow-hidden group ${img.className}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   FINAL CTA
   ──────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="bg-[#1c1b1b] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 text-center">
        <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl text-white uppercase tracking-tighter leading-[0.9] max-w-3xl mx-auto">
          Become the Story
        </h2>
        <p className="mt-6 text-white/50 text-lg max-w-md mx-auto">
          Your Mexico City chapter starts here. Join thousands of travelers who left as storytellers.
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
