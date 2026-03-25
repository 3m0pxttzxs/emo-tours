import type { Metadata } from "next";
import Image from "next/image";
import CustomTourForm from "./CustomTourForm";

export const metadata: Metadata = {
  title: "Private Tours | EMO Tours CDMX",
  description:
    "Private, bespoke tours tailored to your interests — Custom Private Tours and Polanco experiences. Pricing upon request.",
};

export default function CustomToursPage() {
  return (
    <div className="-mt-[72px]">
      <HeroSection />
      <PrivateOptions />
      <CurationRealms />

      {/* ═══════════════ INQUIRY FORM ═══════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="bg-[#f5f0ee] rounded-3xl p-8 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
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
                  schedule, and group. Pricing upon request.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    { icon: "route", title: "Bespoke Itinerary", desc: "Every route designed around your interests" },
                    { icon: "translate", title: "Multi-lingual Guides", desc: "English, Spanish, French & more" },
                    { icon: "directions_car", title: "Private Transport", desc: "Comfortable door-to-door transfers included" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-[#4CBB17] text-2xl mt-0.5">{item.icon}</span>
                      <div>
                        <p className="font-heading font-bold text-[#1c1b1b]">{item.title}</p>
                        <p className="text-sm text-[#78716c]">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <CustomTourForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── HERO — Two-column layout ── */
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center bg-[#fcf8f8] pt-[72px]">
      <div className="mx-auto max-w-[1440px] w-full px-6 py-16 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1">
            <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-4">
              Private · Pricing Upon Request
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
          <div className="flex-1 w-full">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=1200&q=80"
                alt="Custom tour experience in Mexico City"
                fill priority
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

/* ── PRIVATE OPTIONS — Custom + Polanco ── */
function PrivateOptions() {
  const options = [
    {
      title: "Custom Private Tours",
      description: "Design your own Mexico City experience — tell us your interests and we'll craft the perfect itinerary. Any neighborhood, any theme, any duration.",
      features: ["Fully customizable itinerary", "Private bilingual guide", "Flexible duration and schedule", "Access to exclusive venues"],
      image: "https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80",
    },
    {
      title: "Polanco Tour",
      description: "Discover the upscale elegance of Polanco — world-class dining, luxury boutiques, Museo Soumaya, and stunning public art. A 3-hour private experience.",
      features: ["Museo Soumaya visit", "Avenida Masaryk luxury corridor", "Contemporary art galleries", "Restaurant district"],
      image: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80",
    },
  ];

  return (
    <section className="bg-[#0A0A0A] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
          Private Experiences
        </p>
        <h2 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter leading-[0.95] mb-12">
          By Request Only
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt) => (
            <div key={opt.title} className="relative rounded-3xl overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <Image src={opt.image} alt={opt.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block border border-white/30 text-white/70 text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Pricing upon request
                </span>
                <h3 className="font-heading font-bold text-2xl text-white leading-tight mb-2">{opt.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md">{opt.description}</p>
                <div className="flex flex-wrap gap-2">
                  {opt.features.map((f) => (
                    <span key={f} className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CURATION REALMS ── */
function CurationRealms() {
  const realms = [
    { title: "Architecture", description: "From Baroque cathedrals to Brutalist icons — explore the built history of CDMX.", image: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80", span: "md:col-span-8", aspect: "aspect-[16/9]" },
    { title: "Landmarks", description: "The iconic sites that define the city's identity.", image: "https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&q=80", span: "md:col-span-4", aspect: "aspect-[4/5]" },
    { title: "Art & Culture", description: "Murals, galleries, and the creative pulse of a city that breathes art.", image: "https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=800&q=80", span: "md:col-span-4", aspect: "aspect-[4/5]" },
    { title: "Neighborhoods", description: "Each colonia tells a different story — discover the ones that resonate with you.", image: "https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80", span: "md:col-span-4", aspect: "aspect-[4/5]" },
    { title: "Private Groups", description: "Corporate retreats, family reunions, or friend getaways — we handle it all.", image: "https://images.unsplash.com/photo-1518659526054-190340b32735?w=600&q=80", span: "md:col-span-4", aspect: "aspect-[4/5]" },
  ];

  return (
    <section className="bg-[#fcf8f8] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-[#4CBB17] font-heading font-bold text-sm uppercase tracking-widest mb-3">What Moves You</p>
        <h2 className="font-heading font-black text-4xl md:text-6xl text-[#1c1b1b] tracking-tighter leading-[0.95] mb-12">Curation Realms</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {realms.map((realm) => (
            <div key={realm.title} className={`${realm.span} relative rounded-3xl overflow-hidden group ${realm.aspect}`}>
              <Image src={realm.image} alt={realm.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading font-bold text-xl text-white">{realm.title}</h3>
                <p className="text-white/60 text-sm mt-1 line-clamp-2">{realm.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
