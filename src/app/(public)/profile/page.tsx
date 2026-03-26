import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Emo Puttzis | EMO Tours CDMX",
  description: "Guide, food designer, storyteller. The story behind EMO Tours CDMX.",
};

export default function ProfilePage() {
  return (
    <div className="bg-[#fcf8f8]">
      <HeroSection />
      <PhilosophySection />
      <HowItStarted />
      <TheApproach />
      <TheConnection />
      <ValuesSection />
      <FinalCTA />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   1. FOUNDER HERO
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-10 md:pt-14 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-7 flex flex-col justify-end">
          <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">
            Guide · Food Designer · Storyteller
          </p>
          <h1 className="font-heading text-4xl md:text-[5.5rem] font-bold tracking-tighter uppercase leading-[0.88] text-[#1c1b1b] mb-5">
            The Storyteller <span className="text-[#4cbb17]">of the City</span>
          </h1>
          <p className="text-[#78716c] text-base leading-relaxed max-w-md">
            &ldquo;I don&apos;t show people where to look — I show them how to see.
            My connection to Mexico City isn&apos;t built on postcards, but on the
            rhythm of the streets I&apos;ve walked for over fifteen years.&rdquo;
          </p>
        </div>
        <div className="md:col-span-5 relative">
          <div className="relative aspect-[3/4] max-h-[420px] rounded-2xl overflow-hidden">
            <Image
              src="https://jqvikplowgcaeawnjyov.supabase.co/storage/v1/object/public/Profile/About-photo.jpg"
              alt="Emo Puttzis"
              fill
              priority
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
          <div className="absolute -bottom-4 left-4 md:-left-8 md:w-[260px] bg-white/85 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/50">
            <p className="font-heading font-black text-lg text-[#1c1b1b]">Emo Puttzis</p>
            <p className="text-[#78716c] text-sm">Guide</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-[#f6f3f2] text-[#1c1b1b] text-[10px] font-heading font-bold px-2 py-0.5 rounded-full">Since 2010</span>
              <span className="bg-[#f6f3f2] text-[#1c1b1b] text-[10px] font-heading font-bold px-2 py-0.5 rounded-full">CDMX Native</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   2. PHILOSOPHY
   ═══════════════════════════════════════════════════ */
function PhilosophySection() {
  return (
    <section className="bg-[#f6f3f2] py-14 md:py-20 mt-8">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-4 text-center">
            Philosophy
          </p>
          <h2 className="font-heading font-black text-2xl md:text-4xl text-[#1c1b1b] tracking-tighter leading-tight mb-6 text-center">
            This is not a typical tour.
          </h2>
          <div className="space-y-4 text-[#78716c] text-base leading-relaxed">
            <p>
              I started Emo Tours because I was tired of experiences that felt overloaded
              with information, built for giant groups, and disconnected from the people
              actually taking them.
            </p>
            <p>
              Not everyone learns the same way. Not everyone travels the same way. And not
              everyone wants to move through a city as if they were checking boxes off a list.
            </p>
            <p>
              I want people to leave with more than facts — I want them to take a small piece
              of what it means to be Mexican, to live in a world capital, and to see this city
              through a local point of view.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   3. HOW IT STARTED
   ═══════════════════════════════════════════════════ */
function HowItStarted() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-14 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Story */}
        <div className="md:col-span-7">
          <span className="inline-block bg-[#1c1b1b] text-white text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            How It Started · 2010
          </span>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1c1b1b] tracking-tight leading-tight mb-5">
            A break from school turned into a calling.
          </h2>
          <div className="space-y-4 text-[#78716c] text-sm leading-relaxed">
            <p>
              I started giving tours in 2010, after a middle school history teacher
              encouraged me to follow my instinct for storytelling.
            </p>
            <p>
              What began as a break from school turned into something much bigger.
              I guided formally for two years, then kept doing it through friends,
              referrals, and word of mouth.
            </p>
            <p>
              Over time, that instinct took me to Paris, Boston, Munich, Mexico City,
              Queretaro, Puebla, and Tulum.
            </p>
            <p className="text-[#1c1b1b] font-medium">
              Today, Emo Tours brings together the things I care about most: history,
              anthropology, food, and a deep love for the city that raised me.
            </p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3 content-start">
          {[
            { label: "Started guiding", value: "2010" },
            { label: "Tours in", value: "7 cities" },
            { label: "Background", value: "Food design" },
            { label: "Built around", value: "Story & exchange" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-[#4cbb17] font-heading font-bold text-xl mb-1">{s.value}</p>
              <p className="text-[#78716c] text-xs uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   4. THE APPROACH
   ═══════════════════════════════════════════════════ */
function TheApproach() {
  return (
    <section className="bg-[#1c1b1b] py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">
              The Approach
            </p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white tracking-tight leading-tight mb-4">
              Every route is built around people.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              As a food designer, storyteller, and independent guide, I build experiences
              around feeling, curiosity, and cultural exchange.
            </p>
            <ul className="space-y-3">
              {["Story-led by design", "Personalized to the group", "Rooted in human connection", "Built for conversation"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cbb17] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  <span className="font-heading font-medium text-sm text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-white/20 font-heading font-black text-5xl md:text-7xl tracking-tighter uppercase leading-[0.9] text-center select-none">
              History<br />Anthropology<br />Food<br /><span className="text-[#4cbb17]/40">Feeling</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   5. THE CONNECTION
   ═══════════════════════════════════════════════════ */
function TheConnection() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-14 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src="https://jqvikplowgcaeawnjyov.supabase.co/storage/v1/object/public/Profile/connection.jpg"
            alt="Mexico City"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
        </div>
        <div className="md:col-span-7">
          <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">
            The Connection
          </p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1c1b1b] tracking-tight leading-tight mb-5">
            Why this city feels personal
          </h2>
          <div className="space-y-4 text-[#78716c] text-sm leading-relaxed">
            <p>
              Since I was a kid, I&apos;ve been obsessed with castles. The moment I had the
              chance, I moved closer to the part of the city I love most. To this day, some
              of my favorite rituals are long walks through Reforma, visits to Chapultepec
              Castle, and time in the forest just to appreciate how beautiful this city really is.
            </p>
            <p>
              I was born and raised in CDMX, with a Polish mother and a chilango father.
              That mix shaped the way I see culture, belonging, and exchange — and it shapes
              the way I guide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   6. VALUES
   ═══════════════════════════════════════════════════ */
function ValuesSection() {
  const values = [
    {
      num: "01",
      title: "Cultural Exchange",
      description:
        "Travel should create understanding, not just consumption. Every tour is a chance to share perspectives, stories, and ways of seeing the city that go beyond the surface.",
    },
    {
      num: "02",
      title: "Community First",
      description:
        "The city is made by the people who live it. Whenever possible, Emo Tours honors local neighborhoods, local rhythms, and the communities that give CDMX its soul.",
    },
    {
      num: "03",
      title: "Slower, Intentional Travel",
      description:
        "Not every experience needs to be rushed or overpacked. Some of the most meaningful moments happen when we slow down, pay attention, and let the city reveal itself.",
    },
  ];

  return (
    <section className="bg-[#f6f3f2] py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">
          What We Stand For
        </p>
        <h2 className="font-heading font-black text-2xl md:text-4xl text-[#1c1b1b] tracking-tighter leading-tight mb-10">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.num} className="bg-white rounded-xl p-6 group">
              <div className="h-[2px] bg-[#ebe7e7] mb-4 relative overflow-hidden">
                <div className="absolute inset-0 w-0 bg-[#4cbb17] group-hover:w-full transition-all duration-500" />
              </div>
              <span className="block font-heading font-black text-3xl text-[#1c1b1b]/10 mb-2 select-none">{v.num}</span>
              <h3 className="font-heading font-bold text-base text-[#1c1b1b] mb-2">{v.title}</h3>
              <p className="text-[#78716c] leading-relaxed text-sm">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   7. FINAL CTA
   ═══════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="bg-[#1c1b1b] py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6 text-center">
        <h2 className="font-heading font-black text-3xl md:text-5xl text-white uppercase tracking-tighter leading-[0.9] max-w-2xl mx-auto">
          Ready to feel the real CDMX?
        </h2>
        <p className="mt-4 text-white/50 text-sm max-w-md mx-auto">
          Explore routes shaped by history, food, feeling, and a local perspective
          you won&apos;t get from a script.
        </p>
        <div className="mt-6">
          <Link href="/tours" className="inline-flex items-center bg-[#4cbb17] text-[#1c1b1b] rounded-full px-8 py-3 font-heading font-bold text-sm hover:bg-[#3a960e] transition-colors">
            Explore Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
