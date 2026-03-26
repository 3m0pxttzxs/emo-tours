"use client";

import { useState } from "react";
import type { Booking, PaymentStatus, BookingStatus } from "@/types";
import Badge from "@/components/ui/Badge";

interface BookingWithRelations extends Booking {
  tours: { title: string } | null;
  departures: { date: string; time: string } | null;
}

interface Props {
  initialBookings: BookingWithRelations[];
}

const paymentBadgeVariant: Record<PaymentStatus, "warning" | "success" | "error" | "info"> = {
  pending: "warning",
  paid: "success",
  failed: "error",
  refunded: "info",
};

const bookingBadgeVariant: Record<BookingStatus, "warning" | "success" | "error"> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "error",
};

export default function BookingsManager({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<BookingWithRelations[]>(initialBookings);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = bookings.filter((b) => {
    if (filterPaymentStatus && b.payment_status !== filterPaymentStatus) return false;
    if (filterDate && b.departures?.date !== filterDate) return false;
    return true;
  });

  async function fetchBookings() {
    const params = new URLSearchParams();
    if (filterPaymentStatus) params.set("payment_status", filterPaymentStatus);
    if (filterDate) params.set("date", filterDate);

    const res = await fetch(`/api/bookings?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setBookings(data);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("¿Estás seguro de cancelar esta reserva?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_status: "cancelled" }),
      });
      if (res.ok) {
        const updated: BookingWithRelations = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      }
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number) {
    return `${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#1c1b1b]">
          Bookings
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={filterPaymentStatus}
          onChange={(e) => setFilterPaymentStatus(e.target.value)}
          className="bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-xs text-[#1c1b1b] focus:border-[#4cbb17] outline-none"
        >
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-xs text-[#1c1b1b] focus:border-[#4cbb17] outline-none"
          placeholder="Filter by departure date"
        />
        {(filterPaymentStatus || filterDate) && (
          <button
            onClick={() => { setFilterPaymentStatus(""); setFilterDate(""); }}
            className="text-[#78716c] hover:text-[#1c1b1b] text-xs underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ebe7e7] bg-[#fafaf9]">
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Customer</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Tour</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Date</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Time</th>
              <th className="text-center px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Guests</th>
              <th className="text-right px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Total</th>
              <th className="text-center px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Payment</th>
              <th className="text-center px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Status</th>
              <th className="text-right px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking, i) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                index={i}
                expanded={expandedId === booking.id}
                onToggleExpand={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                onCancel={() => handleCancel(booking.id)}
                loading={loading}
                formatCurrency={formatCurrency}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <span className="material-symbols-outlined text-[32px] text-[#d6d3d1] mb-2 block">confirmation_number</span>
                  <p className="text-sm text-[#78716c]">No bookings found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface BookingRowProps {
  booking: BookingWithRelations;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onCancel: () => void;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

function BookingRow({ booking, index, expanded, onToggleExpand, onCancel, loading, formatCurrency }: BookingRowProps) {
  return (
    <>
      <tr
        className={`border-b border-[#ebe7e7] last:border-b-0 hover:bg-[#fafaf9] transition-colors cursor-pointer ${index % 2 === 1 ? "bg-[#fafaf9]/50" : ""}`}
        onClick={onToggleExpand}
      >
        <td className="px-4 py-2.5 font-medium text-[#1c1b1b]">
          {booking.customer_full_name}
        </td>
        <td className="px-4 py-2.5 text-[#1c1b1b]">
          {booking.tours?.title ?? "—"}
        </td>
        <td className="px-4 py-2.5 text-[#1c1b1b]">
          {booking.departures?.date ?? "—"}
        </td>
        <td className="px-4 py-2.5 text-[#1c1b1b]">
          {booking.departures?.time ?? "—"}
        </td>
        <td className="px-4 py-2.5 text-center">{booking.guest_count}</td>
        <td className="px-4 py-2.5 text-right font-medium">
          {formatCurrency(booking.total)}
        </td>
        <td className="px-4 py-2.5 text-center">
          <Badge
            text={booking.payment_status}
            variant={paymentBadgeVariant[booking.payment_status]}
          />
        </td>
        <td className="px-4 py-2.5 text-center">
          <Badge
            text={booking.booking_status}
            variant={bookingBadgeVariant[booking.booking_status]}
          />
        </td>
        <td className="px-4 py-2.5 text-right">
          {booking.booking_status !== "cancelled" && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(); }}
              disabled={loading}
              className="text-red-600 hover:underline text-xs font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-[#fafaf9]/60">
          <td colSpan={9} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Email</p>
                <p className="text-[#1c1b1b] font-body">{booking.customer_email}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Phone</p>
                <p className="text-[#1c1b1b] font-body">{booking.customer_phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Subtotal</p>
                <p className="text-[#1c1b1b] font-body">{formatCurrency(booking.subtotal)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Stripe Session</p>
                <p className="text-[#1c1b1b] font-body truncate">{booking.stripe_session_id || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Payment Intent</p>
                <p className="text-[#1c1b1b] font-body truncate">{booking.stripe_payment_intent_id || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Created</p>
                <p className="text-[#1c1b1b] font-body">{new Date(booking.created_at).toLocaleString()}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
