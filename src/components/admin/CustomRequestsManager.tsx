"use client";

import { useState } from "react";
import type { CustomRequest, CustomRequestStatus } from "@/types";
import Badge from "@/components/ui/Badge";

interface Props {
  initialRequests: CustomRequest[];
}

const statusBadgeVariant: Record<CustomRequestStatus, "info" | "warning" | "default"> = {
  new: "info",
  contacted: "warning",
  closed: "default",
};

const statusOptions: CustomRequestStatus[] = ["new", "contacted", "closed"];

export default function CustomRequestsManager({ initialRequests }: Props) {
  const [requests, setRequests] = useState<CustomRequest[]>(initialRequests);
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = requests.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  async function handleStatusChange(id: string, newStatus: CustomRequestStatus) {
    setLoading(id);
    try {
      const res = await fetch(`/api/custom-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
        );
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#1c1b1b]">
          Custom Requests
        </h1>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-xs text-[#1c1b1b] focus:border-[#4cbb17] outline-none"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        {filterStatus && (
          <button
            onClick={() => setFilterStatus("")}
            className="text-[#78716c] hover:text-[#1c1b1b] text-xs underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ebe7e7] bg-[#fafaf9]">
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Name</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Email</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Phone</th>
              <th className="text-center px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Group Size</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Interests</th>
              <th className="text-center px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Created</th>
              <th className="text-right px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-[#a8a29e]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req, i) => (
              <RequestRow
                key={req.id}
                request={req}
                index={i}
                expanded={expandedId === req.id}
                onToggleExpand={() => setExpandedId(expandedId === req.id ? null : req.id)}
                onStatusChange={(status) => handleStatusChange(req.id, status)}
                isLoading={loading === req.id}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <span className="material-symbols-outlined text-[32px] text-[#d6d3d1] mb-2 block">contact_mail</span>
                  <p className="text-sm text-[#78716c]">No custom requests found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface RequestRowProps {
  request: CustomRequest;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (status: CustomRequestStatus) => void;
  isLoading: boolean;
}

function RequestRow({ request, index, expanded, onToggleExpand, onStatusChange, isLoading }: RequestRowProps) {
  return (
    <>
      <tr
        className={`border-b border-[#ebe7e7] last:border-b-0 hover:bg-[#fafaf9] transition-colors cursor-pointer ${index % 2 === 1 ? "bg-[#fafaf9]/50" : ""}`}
        onClick={onToggleExpand}
      >
        <td className="px-4 py-2.5 font-medium text-[#1c1b1b]">{request.full_name}</td>
        <td className="px-4 py-2.5 text-[#1c1b1b]">{request.email}</td>
        <td className="px-4 py-2.5 text-[#1c1b1b]">{request.phone}</td>
        <td className="px-4 py-2.5 text-center">{request.group_size}</td>
        <td className="px-4 py-2.5 text-[#1c1b1b] max-w-[200px] truncate">{request.interests}</td>
        <td className="px-4 py-2.5 text-center">
          <Badge text={request.status} variant={statusBadgeVariant[request.status]} />
        </td>
        <td className="px-4 py-2.5 text-[#1c1b1b]">
          {new Date(request.created_at).toLocaleDateString()}
        </td>
        <td className="px-4 py-2.5 text-right">
          <select
            value={request.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(e.target.value as CustomRequestStatus);
            }}
            onClick={(e) => e.stopPropagation()}
            disabled={isLoading}
            className="bg-white border border-[#ebe7e7] rounded-md py-1 px-1.5 text-[11px] text-[#1c1b1b] focus:border-[#4cbb17] outline-none disabled:opacity-50"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-[#fafaf9]/60">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Preferred Date</p>
                <p className="text-[#1c1b1b] font-body">{request.preferred_date || "Not specified"}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Group Size</p>
                <p className="text-[#1c1b1b] font-body">{request.group_size} people</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Interests</p>
                <p className="text-[#1c1b1b] font-body">{request.interests}</p>
              </div>
              <div className="sm:col-span-3">
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#a8a29e] mb-1">Notes</p>
                <p className="text-[#1c1b1b] font-body">{request.notes || "No notes"}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
