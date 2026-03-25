"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";

interface CheckoutFormProps {
  tourId: string;
  departureId: string;
  guestCount: number;
  tourTitle: string;
  formId: string;
}

export default function CheckoutForm({
  tourId,
  departureId,
  guestCount,
  tourTitle,
  formId,
}: CheckoutFormProps) {
  const router = useRouter();
  const [customerFullName, setCustomerFullName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: tourId,
          departure_id: departureId,
          guest_count: guestCount,
          customer_full_name: customerFullName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.errors?.join(", ") || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (data.checkout_url) {
        router.push(data.checkout_url);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-10">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Section 01 — Customer Information */}
      <section>
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-heading font-bold text-4xl text-[#ebe7e7]">01</span>
          <h2 className="font-heading font-bold text-2xl text-[#1c1b1b]">Customer Information</h2>
        </div>
        <div className="space-y-5">
          <FormField
            label="Full Name"
            name="customer_full_name"
            placeholder="Enter your full name"
            required
            value={customerFullName}
            onChange={(e) => setCustomerFullName(e.target.value)}
          />
          <FormField
            label="Email Address"
            name="customer_email"
            type="email"
            placeholder="you@example.com"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <FormField
            label="Phone Number"
            name="customer_phone"
            type="tel"
            placeholder="+52 55 1234 5678"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </section>

      {/* Section 02 — Payment Method */}
      <section>
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-heading font-bold text-4xl text-[#ebe7e7]">02</span>
          <h2 className="font-heading font-bold text-2xl text-[#1c1b1b]">Payment Method</h2>
        </div>
        <div className="bg-[#f5f0ee] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#4CBB17]">credit_card</span>
            <span className="font-heading font-bold text-[#1c1b1b]">Secure Card Payment</span>
          </div>
          <p className="text-sm text-[#78716c]">
            You&apos;ll be redirected to Stripe&apos;s secure payment page to complete your booking for{" "}
            <span className="font-medium text-[#1c1b1b]">{tourTitle}</span>.
          </p>
        </div>
      </section>

      {/* Terms checkbox */}
      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[#ebe7e7] text-[#4CBB17] focus:ring-[#4CBB17]"
          required
        />
        <label htmlFor="terms" className="text-sm text-[#78716c]">
          I agree to the{" "}
          <span className="text-[#1c1b1b] font-medium underline cursor-pointer">Terms of Service</span>{" "}
          and{" "}
          <span className="text-[#1c1b1b] font-medium underline cursor-pointer">Cancellation Policy</span>.
        </label>
      </div>

      {/* Mobile submit button (visible on small screens only) */}
      <button
        type="submit"
        disabled={loading || !termsAccepted}
        className="lg:hidden block w-full bg-[#4CBB17] text-[#1c1b1b] text-center font-heading font-bold text-base py-4 rounded-full hover:bg-[#3a960e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing…
          </span>
        ) : (
          "Confirm & Pay"
        )}
      </button>
    </form>
  );
}
