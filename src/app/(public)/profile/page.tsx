import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Curator Profile | EMO Tours CDMX",
};

export default function ProfilePage() {
  return (
    <div className="bg-[#fcf8f8]">
      <HeroSection />
      <PhilosophySection />
      <TheStory />
      <ValuesSection />
      <FinalCTA />
    </div>
  );
}

/* ────────────────────────────────────────────────────
   HERO
   ──────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-16 md:pt-24 pb-12 relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-7">
          <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-4">
            Meet the Curator
          </p>
          <h1 className="font-heading text-7xl md:text-[9rem] font-bold tracking-tighter uppercase leading-[0.85] text-[#1c1b1b]">
            The
            <br />
            Architect
            <br />
            <span className="text-[#4cbb17]">of Moments</span>
          </h1>
        </div>
        <div className="md:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              alt="Mateo Reyes portrait"
              fill
              priority
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
          {/* Glass card overlay */}
          <div className="absolute -bottom-6 left-4 right-4 md:-left-12 md:right-auto md:w-[320px] bg-white/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50">
            <p className="font-heading font-black text-xl text-[#1c1b1b]">Mateo Reyes</p>
            <p className="text-[#78716c] text-sm mt-1">Founder &amp; Curator</p>
            <div className="flex gap-3 mt-3">
              <span className="inline-block bg-[#f6f3f2] text-[#1c1b1b] text-xs font-heading font-bold px-3 py-1 rounded-full">
                12+ Years
              </span>
              <span className="inline-block bg-[#f6f3f2] text-[#1c1b1b] text-xs font-heading font-bold px-3 py-1 rounded-full">
                CDMX Native
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   PHILOSOPHY
   ──────────────────────────────────────────────────── */
function PhilosophySection() {
  return (
    <section className="bg-[#f6f3f2] py-20 md:py-28 mt-12">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-6">
            Philosophy
          </p>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-[#1c1b1b] tracking-tighter leading-tight mb-8">
            This is not a typical tour.
          </h2>
          <p className="text-[#78716c] text-lg md:text-xl leading-relaxed mb-6">
            &ldquo;I started EMO Tours because I was tired of seeing visitors leave Mexico City
            having only scratched the surface. The real city lives in the conversations at a
            corner taquería, in the murals hidden behind scaffolding, in the rhythm of a
            neighborhood that hasn&apos;t been &lsquo;discovered&rsquo; yet.&rdquo;
          </p>
          <p className="text-[#78716c] text-lg md:text-xl leading-relaxed">
            &ldquo;Every route we design is a love letter to this city. We don&apos;t follow
            guidebooks — we follow instinct, relationships, and 12 years of walking these
            streets with open eyes.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   THE STORY — Asymmetric Bento Grid
   ──────────────────────────────────────────────────── */
function TheStory() {
  const approaches = [
    { label: "Direct Sourcing", icon: "check" },
    { label: "Local Expertise Only", icon: "check" },
    { label: "Private Logistics", icon: "check" },
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-16 md:py-24">
      <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
        The Story
      </p>
      <h2 className="font-heading font-black text-4xl md:text-6xl text-[#1c1b1b] tracking-tighter leading-[0.95] mb-12">
        How It Started
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Origins card */}
        <div className="md:col-span-5 bg-[#1c1b1b] rounded-2xl p-8 md:p-10 flex flex-col justify-between min-h-[380px]">
          <div>
            <span className="inline-block border border-white/20 text-white/60 text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Origins
            </span>
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-white leading-tight tracking-tight">
              Born from a single walking tour in 2012
            </h3>
          </div>
          <p className="text-white/50 text-base leading-relaxed mt-6">
            What began as informal walks with friends visiting from abroad grew into a
            mission: to show the world the Mexico City that locals love. No scripts, no
            tourist traps — just authentic connection.
          </p>
        </div>

        {/* Street photo */}
        <div className="md:col-span-4 relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[380px] group">
          <Image
            src="https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=600&q=80"
            alt="Mexico City street"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Artisan photo */}
        <div className="md:col-span-3 relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[380px] group">
          <Image
            src="https://images.unsplash.com/photo-1570737543098-0c32dc185b5c?w=600&q=80"
            alt="Local artisan at work"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>

        {/* The Approach card */}
        <div className="md:col-span-7 bg-white rounded-2xl p-8 md:p-10 shadow-sm">
          <span className="inline-block bg-[#4cbb17]/10 text-[#256d00] text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            The Approach
          </span>
          <h3 className="font-heading font-bold text-2xl text-[#1c1b1b] mb-6">
            Every detail is intentional
          </h3>
          <ul className="space-y-4">
            {approaches.map((a) => (
              <li key={a.label} className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[#4cbb17] text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {a.icon}
                </span>
                <span className="font-heading font-medium text-[#1c1b1b]">{a.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Wide image */}
        <div className="md:col-span-5 relative rounded-2xl overflow-hidden min-h-[250px] group">
          <Image
            src="https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80"
            alt="Mexico City panoramic view"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   VALUES
   ──────────────────────────────────────────────────── */
function ValuesSection() {
  const values = [
    {
      num: "01",
      title: "Community First",
      description:
        "Every tour directly supports local businesses, artisans, and families. We partner exclusively with neighborhood establishments that share our values.",
    },
    {
      num: "02",
      title: "Zero Plastic",
      description:
        "All our tours are plastic-free. We provide reusable water bottles and partner with vendors who share our commitment to sustainability.",
    },
    {
      num: "03",
      title: "Fair Pay",
      description:
        "Our guides earn above-market rates with full benefits. Great experiences start with people who are valued and respected.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-16 md:py-24">
      <p className="text-[#4cbb17] font-heading font-bold text-sm uppercase tracking-widest mb-3">
        What We Stand For
      </p>
      <h2 className="font-heading font-black text-4xl md:text-6xl text-[#1c1b1b] tracking-tighter leading-[0.95] mb-16">
        Our Values
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((v) => (
          <div key={v.num} className="group relative pt-4">
            {/* Hover-animated top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ebe7e7]">
              <div className="h-full w-0 bg-[#4cbb17] group-hover:w-full transition-all duration-500" />
            </div>
            <span className="block font-heading font-black text-6xl text-[#1c1b1b]/10 mb-2 select-none">
              {v.num}
            </span>
            <h3 className="font-heading font-bold text-xl text-[#1c1b1b] mb-3">
              {v.title}
            </h3>
            <p className="text-[#78716c] leading-relaxed text-sm">
              {v.description}
            </p>
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
          Ready to see the real CDMX?
        </h2>
        <p className="mt-6 text-white/50 text-lg max-w-md mx-auto">
          Let Mateo and the team show you the city they call home.
        </p>
        <div className="mt-8">
          <Link
            href="/tours"
            className="inline-flex items-center bg-[#4cbb17] text-[#1c1b1b] rounded-full px-10 py-4 font-heading font-bold text-lg hover:bg-[#3a960e] transition-colors"
          >
            Explore Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
