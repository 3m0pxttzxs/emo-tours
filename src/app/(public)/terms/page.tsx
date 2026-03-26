import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions | EMO Tours CDMX" };

const sections = [
  { title: "Bookings", body: "All bookings are confirmed once payment is received. You will receive a confirmation email with your tour details, meeting point, and time." },
  { title: "Pricing", body: "All prices are listed in USD. Public tour prices are per person. Private tour pricing is based on a fixed group rate. Prices may be updated without prior notice." },
  { title: "Payments", body: "Payments are processed securely through Stripe. We accept all major credit and debit cards. Full payment is required at the time of booking." },
  { title: "Cancellations", body: "Cancellations made more than 24 hours before the tour start time are eligible for a full refund. Cancellations within 24 hours are non-refundable." },
  { title: "Rescheduling", body: "You may reschedule your tour up to 24 hours before the start time, subject to availability. Contact us directly to arrange a new date." },
  { title: "Late Arrivals & No-Shows", body: "Tours depart on time. If you arrive late, we will do our best to accommodate you, but we cannot guarantee a modified experience. No-shows are non-refundable." },
  { title: "Weather", body: "Tours operate rain or shine. In the event of extreme weather conditions that make the tour unsafe, we will offer a full reschedule or refund." },
  { title: "Route Changes", body: "We reserve the right to modify tour routes due to local events, construction, or safety concerns. The overall experience and quality will be maintained." },
  { title: "Guest Responsibility", body: "Guests are responsible for their personal belongings and safety during the tour. We recommend comfortable shoes, water, sunscreen, and weather-appropriate clothing." },
  { title: "Private & Custom Experiences", body: "Private tours are subject to availability and require a minimum of 48 hours advance booking. Custom itineraries are designed after consultation and confirmed via email." },
  { title: "Intellectual Property", body: "All content on this website, including text, images, and design, is the property of EMO Tours CDMX and may not be reproduced without permission." },
  { title: "Limitation of Liability", body: "EMO Tours CDMX acts as a guide service. We are not liable for accidents, injuries, or losses that occur during tours beyond our reasonable control." },
  { title: "Contact", body: "For questions about these terms, reach us at hello@emo-tours.org" },
];

export default function TermsPage() {
  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-heading font-black text-3xl md:text-5xl text-[#1c1b1b] tracking-tighter mb-10">Terms & Conditions</h1>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-heading font-bold text-lg text-[#1c1b1b] mb-2">{s.title}</h2>
              <p className="text-[#78716c] text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
