import type { Metadata } from "next";
import Link from "next/link";
import CustomTourForm from "./CustomTourForm";

export const metadata: Metadata = {
  title: "Private Tours | EMO Tours CDMX",
  description: "Book a private tour for your group in Mexico City. Fixed pricing, flexible scheduling.",
};

const PRIVATE_TOURS = [
  { name: "Historic Center Tour", pricePerPerson: 20, flatRate: 200, duration: "4 Hours" },
  { name: "Roma + Condesa Tour", pricePerPerson: 20, flatRate: 200, duration: "3.5 Hours" },
  { name: "Reforma + Juarez Tour", pricePerPerson: 20, flatRate: 200, duration: "3.5 Hours" },
  { name: "Coyoacan Tour", pricePerPerson: 20, flatRate: 200, duration: "4 Hours" },
  { name: "Chapultepec Day", pricePerPerson: 50, flatRate: 500, duration: "5 Hours" },
  { name: "Teotihuacan Tour", pricePerPerson: 100, flatRate: 1000, duration: "6 Hours" },
  { name: "Polanco Tour", pricePerPerson: 20, flatRate: 200, duration: "4 Hours" },
];

export default function PrivateToursPage() {
  return (
    <div className="bg-[#fcf8f8]">
      {/* Hero */}
      <section className="mx-auto max-w-[1440px] px-6 pt-12 md:pt-16 pb-8">
        <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">
          Private Experiences
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9] text-[#1c1b1b] mb-4">
          Private Tours
        </h1>
        <p className="text-[#78716c] text-base max-w-lg leading-relaxed">
          Any of our tours can be booked as a private experience for your group.
          Fixed pricing, flexible dates, 2 to 10 guests.
        </p>
      </section>

      {/* How pricing works */}
      <section className="mx-auto max-w-[1440px] px-6 pb-8">
        <div className="bg-[#1c1b1b] rounded-2xl p-6 md:p-8">
          <h2 className="font-heading font-bold text-xl text-white mb-3">How pricing works</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            Each private tour has a fixed group rate (public price × 10). The total is split
            among your group — the more people, the less each person pays. Groups from 2 to 10.
          </p>
        </div>
      </section>

      {/* Pricing table */}
      <section className="mx-auto max-w-[1440px] px-6 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ebe7e7]">
                <th className="text-left px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#78716c]">Tour</th>
                <th className="text-left px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#78716c]">Duration</th>
                <th className="text-right px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#78716c]">Public Price</th>
                <th className="text-right px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#78716c]">Private Group Rate</th>
                <th className="text-right px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#78716c]">Per Person (2 guests)</th>
                <th className="text-right px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#78716c]">Per Person (10 guests)</th>
              </tr>
            </thead>
            <tbody>
              {PRIVATE_TOURS.map((tour) => (
                <tr key={tour.name} className="border-b border-[#ebe7e7] last:border-b-0">
                  <td className="px-6 py-4 font-heading font-bold text-[#1c1b1b]">{tour.name}</td>
                  <td className="px-6 py-4 text-[#78716c]">{tour.duration}</td>
                  <td className="px-6 py-4 text-right text-[#78716c]">
                    {tour.pricePerPerson ? `$${tour.pricePerPerson}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-heading font-bold text-[#4cbb17]">
                    {tour.flatRate ? `$${tour.flatRate}` : "Upon request"}
                  </td>
                  <td className="px-6 py-4 text-right text-[#78716c]">
                    {tour.flatRate ? `$${tour.flatRate / 2}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-right text-[#78716c]">
                    {tour.flatRate ? `$${tour.flatRate / 10}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Request form */}
      <section className="mx-auto max-w-[1440px] px-6 pb-12">
        <div className="bg-[#f5f0ee] rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">
                Book Your Private Tour
              </p>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1c1b1b] tracking-tighter mb-4">
                Request a Date
              </h2>
              <p className="text-[#78716c] text-sm leading-relaxed mb-6">
                Tell us which tour you want, your preferred date, and group size.
                We&apos;ll confirm availability within 24 hours.
              </p>
              <ul className="space-y-3">
                {["Any tour available as private", "Flexible scheduling (any day)", "Groups from 2 to 10", "Fixed transparent pricing"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4cbb17] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    <span className="text-sm text-[#1c1b1b]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <CustomTourForm />
          </div>
        </div>
      </section>

      {/* Back to tours */}
      <section className="mx-auto max-w-[1440px] px-6 pb-12 text-center">
        <Link href="/tours" className="text-[#4cbb17] font-heading font-bold text-sm hover:underline">
          ← Back to weekly public tours
        </Link>
      </section>
    </div>
  );
}
