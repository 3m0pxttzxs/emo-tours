import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import TestimonialCard from "@/components/tours/TestimonialCard";
import { weekdayName, formatPrice } from "@/lib/schedule";
import type { Tour } from "@/types";

export const revalidate = 3600;

async function getWeeklyTours(): Promise<Tour[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("tours")
      .select("*")
      .eq("published", true)
      .eq("active", true)
      .not("weekday", "is", null)
      .order("weekday", { ascending: true });
    if (error || !data || data.length === 0) return [];
    // Sort so Monday (1) comes first, then Tue-Sun
    const sorted = [...(data as Tour[])].sort((a, b) => {
      const dayA = a.weekday === 0 ? 7 : a.weekday!;
      const dayB = b.weekday === 0 ? 7 : b.weekday!;
      return dayA - dayB;
    });
    return sorted;
  } catch {
    return [];
  }
}

function fmtTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}:00 ${period}` : `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function dayLabel(tour: Tour): string {
  const name = weekdayName(tour.weekday);
  if (!name) return "By request";
  return `${name}s at ${fmtTime(tour.departure_time)}`;
}

export default async function HomePage() {
  const tours = await getWeeklyTours();
  return (
    <div className="-mt-[72px]">
      <HeroSection />
      <WeeklyExperiences tours={tours} />
      <WhyEmoTours />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}

/* ────────────────────────────────────────────────────
   HERO
   ──────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1518659526054-190340b32735?w=1920&q=80"
        alt="Mexico City skyline"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="relative z-10 mx-auto max-w-[1440px] w-full px-6">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-heading font-black uppercase text-white leading-[0.9] tracking-tighter max-w-4xl">
          Not your average Mexico City tour.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
          A weekly curated program of walking tours led by locals who live it.
          One signature route each day — architecture, food, and culture — the real CDMX.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/tours" className="inline-flex items-center bg-[#4CBB17] text-[#1c1b1b] rounded-full px-8 py-4 font-heading font-bold text-base hover:bg-[#3a960e] transition-colors">
            Book a tour
          </Link>
          <Link href="/tours" className="inline-flex items-center border border-white text-white rounded-full px-8 py-4 font-heading font-bold text-base hover:bg-white/10 transition-colors">
            Explore routes
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   WEEKLY EXPERIENCES — Asymmetric Bento Grid (6 public tours)
   ──────────────────────────────────────────────────── */
function WeeklyExperiences({ tours }: { tours: Tour[] }) {
  return (
    <section className="bg-[#fcf8f8] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
          Weekly Curated Program
        </p>
        <h2 className="font-heading font-black text-4xl md:text-6xl text-[#1c1b1b] tracking-tighter leading-[0.95]">
          One Signature Route Each Day
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Card 1 — Large horizontal (col-span-8) */}
          {tours[0] && (
            <Link href={`/tours/${tours[0].slug}`} className="group md:col-span-8 relative rounded-3xl overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[420px]">
              <Image src={tours[0].cover_image} alt={tours[0].title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block bg-[#4CBB17] text-[#1c1b1b] text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  {dayLabel(tours[0])}
                </span>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-white leading-tight">{tours[0].title}</h3>
                <p className="text-white/70 text-sm mt-2 max-w-md line-clamp-2">{tours[0].short_description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">schedule</span>{tours[0].duration}</span>
                    <span>${tours[0].base_price} / person</span>
                  </div>
                  <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          )}

          {/* Card 2 — Vertical (col-span-4) */}
          {tours[1] && (
            <Link href={`/tours/${tours[1].slug}`} className="group md:col-span-4 relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[420px]">
              <Image src={tours[1].cover_image} alt={tours[1].title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">{dayLabel(tours[1])}</span>
                <h3 className="font-heading font-bold text-xl text-white leading-tight">{tours[1].title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/60 text-sm">${tours[1].base_price} / person · {fmtTime(tours[1].departure_time)}</span>
                  <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          )}

          {/* Card 3 — (col-span-5) */}
          {tours[2] && (
            <Link href={`/tours/${tours[2].slug}`} className="group md:col-span-5 relative rounded-3xl overflow-hidden aspect-square md:aspect-auto md:min-h-[380px]">
              <Image src={tours[2].cover_image} alt={tours[2].title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 42vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">{dayLabel(tours[2])}</span>
                <h3 className="font-heading font-bold text-xl text-white leading-tight">{tours[2].title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/60 text-sm">${tours[2].base_price} / person · {fmtTime(tours[2].departure_time)}</span>
                  <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          )}

          {/* Card 4 — (col-span-7) */}
          {tours[3] && (
            <Link href={`/tours/${tours[3].slug}`} className="group md:col-span-7 relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto md:min-h-[380px]">
              <Image src={tours[3].cover_image} alt={tours[3].title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 58vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">{dayLabel(tours[3])}</span>
                <h3 className="font-heading font-bold text-xl text-white leading-tight">{tours[3].title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/60 text-sm">${tours[3].base_price} / person · {fmtTime(tours[3].departure_time)}</span>
                  <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          )}

          {/* Card 5 — (col-span-4) */}
          {tours[4] && (
            <Link href={`/tours/${tours[4].slug}`} className="group md:col-span-4 relative rounded-3xl overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[360px]">
              <Image src={tours[4].cover_image} alt={tours[4].title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">{dayLabel(tours[4])}</span>
                <h3 className="font-heading font-bold text-xl text-white leading-tight">{tours[4].title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/60 text-sm">${tours[4].base_price} / person · {fmtTime(tours[4].departure_time)}</span>
                  <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          )}

          {/* Card 6 — (col-span-6) */}
          {tours[5] && (
            <Link href={`/tours/${tours[5].slug}`} className="group md:col-span-4 relative rounded-3xl overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[360px]">
              <Image src={tours[5].cover_image} alt={tours[5].title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">{dayLabel(tours[5])}</span>
                <h3 className="font-heading font-bold text-xl text-white leading-tight">{tours[5].title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/60 text-sm">${tours[5].base_price} / person · {fmtTime(tours[5].departure_time)}</span>
                  <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          )}

          {/* Card 7 — Polanco (col-span-4) */}
          {tours[6] && (
            <Link href={`/tours/${tours[6].slug}`} className="group md:col-span-4 relative rounded-3xl overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[360px]">
              <Image src={tours[6].cover_image} alt={tours[6].title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">{dayLabel(tours[6])}</span>
                <h3 className="font-heading font-bold text-xl text-white leading-tight">{tours[6].title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/60 text-sm">${tours[6].base_price} / person · {fmtTime(tours[6].departure_time)}</span>
                  <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Private tours CTA */}
        <div className="mt-8 bg-[#1c1b1b] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="inline-block border border-white/20 text-white/60 text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">Private Experience</span>
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-white leading-tight tracking-tight">Custom Private Tours</h3>
            <p className="text-white/50 text-base mt-2 max-w-md leading-relaxed">Design your own Mexico City experience — pricing upon request.</p>
          </div>
          <Link href="/custom-tours" className="inline-flex items-center gap-2 border border-[#4CBB17] text-[#4CBB17] rounded-full px-6 py-3 font-heading font-bold text-sm hover:bg-[#4CBB17] hover:text-[#1c1b1b] transition-colors shrink-0">
            Design your tour
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   WHY EMO TOURS
   ──────────────────────────────────────────────────── */
function WhyEmoTours() {
  const reasons = [
    { num: "01", title: "Local Perspective", description: "Our guides are born-and-raised locals who share the city's hidden stories, not just the tourist highlights." },
    { num: "02", title: "Direct Booking", description: "No middlemen, no markups. Book directly with us and get the best price with instant confirmation." },
    { num: "03", title: "Private Options", description: "Every tour can be private. Customize the experience to match your pace, interests, and schedule." },
  ];
  return (
    <section className="bg-[#0A0A0A] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">The Difference</p>
        <h2 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter leading-[0.95]">Why EMO Tours</h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {reasons.map((r) => (
            <div key={r.num} className="relative">
              <span className="block font-heading font-black text-[120px] md:text-[160px] leading-none text-white/[0.04] select-none -mb-16 md:-mb-20">{r.num}</span>
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl text-white mb-3">{r.title}</h3>
                <p className="text-white/50 leading-relaxed">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   HOW IT WORKS
   ──────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { num: 1, title: "Choose your route", description: "Browse our weekly curated tours or design a custom private experience tailored to your interests." },
    { num: 2, title: "Pick a date", description: "Each tour runs on a fixed weekday. Select the next available date that works for you." },
    { num: 3, title: "Reserve & Pay", description: "Secure your spot with instant online payment. You'll receive a confirmation email right away." },
  ];
  return (
    <section className="bg-[#fcf8f8] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="text-center mb-16">
          <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="font-heading font-black text-4xl md:text-6xl text-[#1c1b1b] tracking-tighter leading-[0.95]">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-full border-2 border-[#4CBB17] flex items-center justify-center mb-6">
                <span className="font-heading font-bold text-xl text-[#4CBB17]">{step.num}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)]">
                  <div className="border-t-2 border-dashed border-[#4CBB17]/30 w-full" />
                </div>
              )}
              <h3 className="font-heading font-bold text-xl text-[#1c1b1b] mb-2">{step.title}</h3>
              <p className="text-[#78716c] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   TESTIMONIALS
   ──────────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section className="bg-[#0A0A0A] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <TestimonialCard
              quote="This wasn't just a tour — it was a *deep dive into the soul* of Mexico City. Our guide knew every hidden corner and story."
              name="Sarah M."
              title="New York, USA"
            />
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <Image src="https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400&q=80" alt="Tour moment" fill className="object-cover" sizes="200px" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <Image src="https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=400&q=80" alt="Tour moment" fill className="object-cover" sizes="200px" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-square col-span-2">
              <Image src="https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=400&q=80" alt="Tour moment" fill className="object-cover" sizes="400px" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   FINAL CTA
   ──────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      <Image src="https://jqvikplowgcaeawnjyov.supabase.co/storage/v1/object/public/homepage/footer-home.jpg" alt="Mexico City" fill className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center">
        <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl text-white uppercase tracking-tighter leading-[0.9] max-w-3xl mx-auto">
          Explore CDMX like a local
        </h2>
        <p className="mt-6 text-white/60 text-lg max-w-md mx-auto">
          Ready to discover the real Mexico City? Book your experience today.
        </p>
        <div className="mt-8">
          <Link href="/tours" className="inline-flex items-center bg-[#4CBB17] text-[#1c1b1b] rounded-full px-10 py-4 font-heading font-bold text-lg hover:bg-[#3a960e] transition-colors">
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}
