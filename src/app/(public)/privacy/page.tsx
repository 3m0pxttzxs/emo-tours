import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | EMO Tours CDMX" };

const sections = [
  { title: "Information We Collect", body: "When you book a tour, we collect your name, email address, and phone number. We do not collect sensitive personal data beyond what is necessary to confirm your booking." },
  { title: "How We Use Your Information", body: "Your information is used to process bookings, send confirmation emails, and communicate tour details. We may also use your email to send occasional updates about new tours or schedule changes." },
  { title: "Payments", body: "All payments are processed through Stripe. We do not store your credit card information. Stripe's privacy policy governs how your payment data is handled." },
  { title: "Analytics & Cookies", body: "We use basic analytics to understand how visitors use our website. We do not use invasive tracking or sell your data to third parties." },
  { title: "Sharing of Information", body: "We do not share, sell, or rent your personal information to third parties. Your data is only shared with payment processors (Stripe) and email providers (Resend) as needed to deliver our service." },
  { title: "Data Retention", body: "We retain booking data for operational and legal purposes. You may request deletion of your personal data at any time by contacting us." },
  { title: "Your Rights", body: "You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time." },
  { title: "Contact", body: "For privacy-related questions, reach us at inkedsad@gmail.com" },
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-[#4cbb17] font-heading font-bold text-xs uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-heading font-black text-3xl md:text-5xl text-[#1c1b1b] tracking-tighter mb-10">Privacy Policy</h1>
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
