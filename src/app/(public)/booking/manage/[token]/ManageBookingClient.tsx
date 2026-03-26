"use client";

import { useState } from "react";

interface Departure {
  id: string;
  date: string;
  time: string;
  spots_left: number;
}

interface Props {
  token: string;
  bookingStatus: string;
  timesCancelled: number;
  timesRescheduled: number;
  departures: Departure[];
  currentDepartureId: string;
}

export default function ManageBookingClient({
  token,
  bookingStatus,
  timesCancelled,
  timesRescheduled,
  departures,
  currentDepartureId,
}: Props) {
  const [status, setStatus] = useState(bookingStatus);
  const [cancelled, setCancelled] = useState(timesCancelled);
  const [rescheduled, setRescheduled] = useState(timesRescheduled);
  const [selectedDep, setSelectedDep] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const isCancelled = status === "cancelled";
  const canCancel = !isCancelled && cancelled < 1;
  const canReschedule = !isCancelled && rescheduled < 1;

  async function handleCancel() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setStatus("cancelled");
      setCancelled((c) => c + 1);
      setMessage("Your booking has been cancelled. A refund will be processed within 5-10 business days.");
      setShowConfirmCancel(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReschedule() {
    if (!selectedDep) {
      setError("Please select a new date.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/bookings/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_departure_id: selectedDep }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setRescheduled((r) => r + 1);
      setMessage("Your booking has been rescheduled. You will receive an updated confirmation email.");
      setSelectedDep("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isCancelled && !message) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-[#d4d4d4] mb-4 block">event_busy</span>
        <h2 className="font-heading text-xl font-bold text-[#1c1b1b] mb-2">Booking Cancelled</h2>
        <p className="text-[#78716c] text-sm">This booking has already been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-green-50 text-green-800 rounded-xl p-4 text-sm">{message}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">{error}</div>
      )}

      {/* Reschedule section */}
      {canReschedule && departures.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="font-heading text-lg font-bold text-[#1c1b1b] mb-1">Reschedule</h2>
          <p className="text-[#78716c] text-sm mb-4">
            You can reschedule once for free. Select a new date below.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {departures.map((dep) => (
              <button
                key={dep.id}
                type="button"
                onClick={() => setSelectedDep(dep.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDep === dep.id
                    ? "border-2 border-[#4CBB17] bg-[#4CBB17]/10 text-[#1c1b1b]"
                    : "border border-[#ebe7e7] text-[#1c1b1b] hover:bg-[#f5f0ee]"
                }`}
              >
                {formatDateShort(dep.date)}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={loading || !selectedDep}
            onClick={handleReschedule}
            className="w-full bg-[#4cbb17] text-[#1c1b1b] font-heading font-bold text-sm py-3 rounded-full hover:bg-[#3a960e] transition-colors disabled:opacity-40"
          >
            {loading ? "Rescheduling..." : "Confirm New Date"}
          </button>
        </div>
      )}

      {!canReschedule && !isCancelled && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="font-heading text-lg font-bold text-[#1c1b1b] mb-1">Reschedule</h2>
          <p className="text-[#78716c] text-sm">
            You have already used your free reschedule. Please contact us at{" "}
            <a href="mailto:inkedsad@gmail.com" className="text-[#4cbb17] underline">inkedsad@gmail.com</a> for further changes.
          </p>
        </div>
      )}

      {/* Cancel section */}
      {canCancel && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="font-heading text-lg font-bold text-[#1c1b1b] mb-1">Cancel Booking</h2>
          <p className="text-[#78716c] text-sm mb-4">
            You can cancel once for a full refund. This action cannot be undone.
          </p>
          {!showConfirmCancel ? (
            <button
              type="button"
              onClick={() => setShowConfirmCancel(true)}
              className="w-full border-2 border-red-400 text-red-600 font-heading font-bold text-sm py-3 rounded-full hover:bg-red-50 transition-colors"
            >
              Cancel My Booking
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-600 text-sm font-medium">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 text-white font-heading font-bold text-sm py-3 rounded-full hover:bg-red-600 transition-colors disabled:opacity-40"
                >
                  {loading ? "Cancelling..." : "Yes, Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmCancel(false)}
                  className="flex-1 border border-[#ebe7e7] text-[#1c1b1b] font-heading font-bold text-sm py-3 rounded-full hover:bg-[#f5f0ee] transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-[#a8a29e]">
        Need help? Contact us at{" "}
        <a href="mailto:inkedsad@gmail.com" className="text-[#4cbb17] underline">inkedsad@gmail.com</a>
      </p>
    </div>
  );
}

function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
