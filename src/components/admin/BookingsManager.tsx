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
        await fetchBookings();
      }
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number) {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#1c1b1b]">
          Bookings
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={filterPaymentStatus}
          onChange={(e) => setFilterPaymentStatus(e.target.value)}
          className="bg-white border border-[#ebe7e7] rounded-xl py-2.5 px-4 text-sm focus:border-[#4cbb17] outline-none"
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
          className="bg-white border border-[#ebe7e7] rounded-xl py-2.5 px-4 text-sm focus:border-[#4cbb17] outline-none"
          placeholder="Filter by departure date"
        />
        {(filterPaymentStatus || filterDate) && (
          <button
            onClick={() => { setFilterPaymentStatus(""); setFilterDate(""); }}
            className="text-[#78716c] hover:text-[#1c1b1b] text-sm underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ebe7e7]">
              <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Customer</th>
              <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Tour</th>
              <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Date</th>
              <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Time</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Guests</th>
              <th className="text-right px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Total</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Payment</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Status</th>
              <th className="text-right px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                expanded={expandedId === booking.id}
                onToggleExpand={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                onCancel={() => handleCancel(booking.id)}
                loading={loading}
                formatCurrency={formatCurrency}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-[#78716c]">
                  No bookings found.
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
  expanded: boolean;
  onToggleExpand: () => void;
  onCancel: () => void;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

function BookingRow({ booking, expanded, onToggleExpand, onCancel, loading, formatCurrency }: BookingRowProps) {
  return (
    <>
      <tr
        className="border-b border-[#ebe7e7] last:border-b-0 hover:bg-[#f5f0ee]/50 transition-colors cursor-pointer"
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3 font-medium text-[#1c1b1b]">
          {booking.customer_full_name}
        </td>
        <td className="px-4 py-3 text-[#1c1b1b]">
          {booking.tours?.title ?? "—"}
        </td>
        <td className="px-4 py-3 text-[#1c1b1b]">
          {booking.departures?.date ?? "—"}
        </td>
        <td className="px-4 py-3 text-[#1c1b1b]">
          {booking.departures?.time ?? "—"}
        </td>
        <td className="px-4 py-3 text-center">{booking.guest_count}</td>
        <td className="px-4 py-3 text-right font-medium">
          {formatCurrency(booking.total)}
        </td>
        <td className="px-4 py-3 text-center">
          <Badge
            text={booking.payment_status}
            variant={paymentBadgeVariant[booking.payment_status]}
          />
        </td>
        <td className="px-4 py-3 text-center">
          <Badge
            text={booking.booking_status}
            variant={bookingBadgeVariant[booking.booking_status]}
          />
        </td>
        <td className="px-4 py-3 text-right">
          {booking.booking_status !== "cancelled" && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(); }}
              disabled={loading}
              className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-[#f5f0ee]/30">
          <td colSpan={9} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">Email</p>
                <p className="text-[#1c1b1b]">{booking.customer_email}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">Phone</p>
                <p className="text-[#1c1b1b]">{booking.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">Subtotal</p>
                <p className="text-[#1c1b1b]">{formatCurrency(booking.subtotal)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">Stripe Session</p>
                <p className="text-[#1c1b1b] truncate">{booking.stripe_session_id || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">Payment Intent</p>
                <p className="text-[#1c1b1b] truncate">{booking.stripe_payment_intent_id || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">Created</p>
                <p className="text-[#1c1b1b]">{new Date(booking.created_at).toLocaleString()}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
