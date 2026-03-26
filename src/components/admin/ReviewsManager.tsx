"use client";

import { useState } from "react";
import type { ReviewStatus } from "@/types";
import Badge from "@/components/ui/Badge";

interface ReviewRow {
  id: string;
  reviewer_name: string;
  rating: number | null;
  comment: string | null;
  status: ReviewStatus;
  token_used: boolean;
  created_at: string;
  tours: { title: string } | null;
}

interface Props {
  initialReviews: ReviewRow[];
}

const statusBadgeVariant: Record<ReviewStatus, "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

export default function ReviewsManager({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<ReviewRow[]>(initialReviews);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = reviews.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  async function fetchReviews() {
    const res = await fetch("/api/reviews?all=true");
    if (res.ok) {
      const data = await res.json();
      setReviews(data.reviews ?? data);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    setLoading(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: status as ReviewStatus } : r
          )
        );
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#1c1b1b]">Reviews</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-xs text-[#1c1b1b] focus:border-[#4cbb17] outline-none"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        {filterStatus && (
          <button
            onClick={() => setFilterStatus("")}
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
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Reviewer</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Tour</th>
              <th className="text-center px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Rating</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Comment</th>
              <th className="text-center px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Date</th>
              <th className="text-right px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review, i) => (
              <tr key={review.id} className={`border-b border-[#ebe7e7] last:border-b-0 hover:bg-[#fafaf9] transition-colors ${i % 2 === 1 ? "bg-[#fafaf9]/50" : ""}`}>
                <td className="px-4 py-2.5 font-medium text-[#1c1b1b]">{review.reviewer_name}</td>
                <td className="px-4 py-2.5 text-[#1c1b1b]">{review.tours?.title ?? "—"}</td>
                <td className="px-4 py-2.5 text-center">
                  {review.rating ? (
                    <span className="flex items-center justify-center gap-0.5">
                      <span className="material-symbols-outlined text-[#4cbb17] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {review.rating}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-2.5 text-[#1c1b1b] max-w-[200px] truncate">{review.comment || "—"}</td>
                <td className="px-4 py-2.5 text-center">
                  <Badge text={review.status} variant={statusBadgeVariant[review.status]} />
                </td>
                <td className="px-4 py-2.5 text-[#78716c]">{new Date(review.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex gap-1.5 justify-end">
                    {review.status !== "approved" && review.token_used && (
                      <button
                        onClick={() => handleStatusChange(review.id, "approved")}
                        disabled={loading === review.id}
                        className="text-[#4cbb17] hover:underline text-xs font-medium disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {review.status !== "rejected" && review.token_used && (
                      <button
                        onClick={() => handleStatusChange(review.id, "rejected")}
                        disabled={loading === review.id}
                        className="text-red-600 hover:underline text-xs font-medium disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    {!review.token_used && (
                      <span className="text-[#a8a29e] text-[11px]">Awaiting submission</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <span className="material-symbols-outlined text-[32px] text-[#d6d3d1] mb-2 block">rate_review</span>
                  <p className="text-sm text-[#78716c]">No reviews found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
