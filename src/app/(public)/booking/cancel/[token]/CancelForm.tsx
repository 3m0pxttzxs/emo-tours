"use client";

import { useState } from "react";
import Link from "next/link";

interface CancelFormProps {
  token: string;
}

export default function CancelForm({ token }: CancelFormProps) {
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        setCancelled(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to cancel booking");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (cancelled) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <span
          className="material-symbols-outlined text-5xl text-[#4cbb17] mb-4 block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <h2 className="font-heading text-xl font-bold text-[#1c1b1b] mb-2">
          Booking Cancelled
        </h2>
        <p className="text-[#78716c] mb-6">
          Your booking has been cancelled. If you paid, a refund will be processed shortly.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1c1b1b] text-white font-heading font-bold text-sm px-6 py-3 rounded-full hover:bg-[#333] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      <button
        onClick={handleCancel}
        disabled={loading}
        className="w-full bg-[#ef4444] text-white font-heading font-bold text-sm py-3 rounded-full hover:bg-[#dc2626] transition-colors disabled:opacity-50"
      >
        {loading ? "Cancelling..." : "Yes, Cancel My Booking"}
      </button>
      <Link
        href="/"
        className="block w-full text-center bg-white border border-[#ebe7e7] text-[#1c1b1b] font-heading font-bold text-sm py-3 rounded-full hover:bg-[#f6f3f2] transition-colors"
      >
        No, Keep My Booking
      </Link>
    </div>
  );
}
