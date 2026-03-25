import type { Metadata } from "next";
import Image from "next/image";
import CustomTourForm from "./CustomTourForm";

export const metadata: Metadata = {
  title: "Custom Tours | EMO Tours CDMX",
  description:
    "Design your own Mexico City experience — private, bespoke tours tailored to your interests.",
};

export default function CustomToursPage() {
  return (
    <div className="-mt-[72px]">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <HeroSection />

      {/* ═══════════════ CURATION REALMS ═══════════════ */}
      <CurationRealms />

      {/* ═══════════════ INQUIRY FORM ═══════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="bg-[#f5f0ee] rounded-3xl p-8 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left — Info */}
              <div className="flex flex-col justify-center">
                <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
                  Private Commissions
                </p>
                <h2 className="font-heading font-black text-4xl md:text-5xl text-[#1c1b1b] tracking-tighter leading-[0.95]">
                  Initiate Your Curated Journey
                </h2>
                <p className="mt-4 text-[#78716c] leading-relaxed">
                  Tell us about your ideal Mexico City experience and our team
                  will craft a bespoke itinerary tailored to your interests,
                  schedule, and group.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    {
                      icon: "route",
                      title: "Bespoke Itinerary",
                      desc: "Every route designed around your interests",
                    },
                    {
                      icon: "translate",
                      title: "Multi-lingual Guides",
                      desc: "English, Spanish, French & more",
                    },
                    {
                      icon: "directions_car",
                      title: "Private Transport",
                      desc: "Comfortable door-to-door transfers included",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-[#4CBB17] text-2xl mt-0.5">
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-[#1c1b1b]">
                          {item.title}
                        </p>
                        <p className="text-sm text-[#78716c]">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — Form */}
              <CustomTourForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   HERO — Two-column layout
   ──────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center bg-[#fcf8f8] pt-[72px]">
      <div className="mx-auto max-w-[1440px] w-full px-6 py-16 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left — Text */}
          <div className="flex-1">
            <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-4">
              Private Commissions Only
            </p>
            <h1 className="text-7xl md:text-8xl font-heading font-black tracking-tighter uppercase text-[#1c1b1b] leading-[0.9]">
              Tailor-Made
              <br />
              CDMX
            </h1>
            <p className="mt-6 text-lg text-[#78716c] max-w-md leading-relaxed">
              Your city. Your pace. Your story. We design private experiences
              that go beyond the guidebook — crafted around what moves you.
            </p>
          </div>

          {/* Right — Image */}
          <div className="flex-1 w-full">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=1200&q=80"
                alt="Custom tour experience in Mexico City"
                fill
                priority
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   CURATION REALMS — Editorial grid
   ──────────────────────────────────────────────────── */
function CurationRealms() {
  const realms = [
    {
      title: "Architecture",
      description:
        "From Baroque cathedrals to Brutalist icons — explore the built history of CDMX.",
      image:
        "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80",
      span: "md:col-span-8",
      aspect: "aspect-[16/9]",
    },
    {
      title: "Landmarks",
      description: "The iconic sites that define the city's identity.",
      image:
        "https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&q=80",
      span: "md:col-span-4",
      aspect: "aspect-[4/5]",
    },
    {
      title: "Art & Culture",
      description:
        "Murals, galleries, and the creative pulse of a city that breathes art.",
      image:
        "https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=800&q=80",
      span: "md:col-span-4",
      aspect: "aspect-[4/5]",
    },
    {
      title: "Neighborhoods",
      description:
        "Each colonia tells a different story — discover the ones that resonate with you.",
      image:
        "https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80",
      span: "md:col-span-4",
      aspect: "aspect-[4/5]",
    },
    {
      title: "Private Groups",
      description:
        "Corporate retreats, family reunions, or friend getaways — we handle it all.",
      image:
        "https://images.unsplash.com/photo-1518659526054-190340b32735?w=600&q=80",
      span: "md:col-span-4",
      aspect: "aspect-[4/5]",
    },
  ];

  return (
    <section className="bg-[#0A0A0A] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
          What Moves You
        </p>
        <h2 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter leading-[0.95] mb-12">
          Curation Realms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {realms.map((realm) => (
            <div
              key={realm.title}
              className={`${realm.span} relative rounded-3xl overflow-hidden group ${realm.aspect}`}
            >
              <Image
                src={realm.image}
                alt={realm.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading font-bold text-xl text-white">
                  {realm.title}
                </h3>
                <p className="text-white/60 text-sm mt-1 line-clamp-2">
                  {realm.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
