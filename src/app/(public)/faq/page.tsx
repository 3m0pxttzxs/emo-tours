import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ | EMO Tours CDMX" };

const faqs = [
  { q: "What language are the tours in?", a: "All tours are conducted in English and Spanish. If you need another language, let us know when booking a private tour." },
  { q: "How do I book a tour?", a: "Select a tour, choose an available date, pick the number of guests, and complete payment through our secure checkout. You'll receive a confirmation email immediately." },
  { q: "How do payments work?", a: "We accept all major credit and debit cards through Stripe. Payment is required at the time of booking. All prices are in USD." },
  { q: "What is the cancellation policy?", a: "Full refund if you cancel more than 24 hours before the tour. Cancellations within 24 hours are non-refundable. You can reschedule for free with 24 hours notice." },
  { q: "What happens if it rains?", a: "Tours run rain or shine. Many of our stops include indoor locations. In case of extreme weather, we'll offer a full reschedule or refund." },
  { q: "Where do we meet?", a: "Each tour has a specific meeting point listed on the tour detail page and in your confirmation email. Arrive 10 minutes early." },
  { q: "What should I wear?", a: "Comfortable walking shoes are essential. We recommend layers, sunscreen, and a water bottle. Some tours involve significant walking." },
  { q: "How do private tours work?", a: "Any of our public tours can be booked as a private experience for groups of 2-10. The group pays a fixed rate (public price x 10), split among the group. Request through our Private Tours page." },
  { q: "Can I book for a large group?", a: "Public tours are limited to 8 guests per date. For larger groups, book a private tour which accommodates up to 10 people." },
  { q: "What if I arrive late?", a: "Tours depart on time. If you're running late, contact us and we'll do our best to accommodate you, but we can't guarantee a modified experience." },
  { q: "Can I request a custom tour?", a: "Yes. Tell us your interests, preferred date, and group size through our Private Tours page. We'll design a bespoke itinerary and send you a quote within 24 hours." },
];

export default function FaqPage() {
  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">Support</p>
        <h1 className="font-heading font-black text-3xl md:text-5xl text-[#1c1b1b] tracking-tighter mb-10">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white border border-[#ebe7e7]/30 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-heading font-bold text-base text-[#1c1b1b] list-none [&::-webkit-details-marker]:hidden">
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-[#78716c] transition-transform duration-300 group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-5 text-[#78716c] text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
