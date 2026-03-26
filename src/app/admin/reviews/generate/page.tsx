"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Tour {
  id: string;
  title: string;
}

export default function GenerateTokenPage() {
  const [reviewerName, setReviewerName] = useState("");
  const [email, setEmail] = useState("");
  const [tourId, setTourId] = useState("");
  const [tourName, setTourName] = useState("");
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ link: string; token: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchTours() {
      const { data } = await supabase
        .from("tours")
        .select("id, title")
        .order("title");
      if (data) setTours(data);
      setLoadingTours(false);
    }
    fetchTours();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/reviews/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewer_name: reviewerName,
          email,
          tour_name: tourName,
          tour_id: tourId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate token");
        return;
      }

      setResult({ link: data.link, token: data.token });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/reviews" className="text-[#78716c] hover:text-[#1c1b1b]">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-heading font-bold text-[#1c1b1b]">
          Generate Review Link
        </h1>
      </div>

      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label htmlFor="reviewerName" className="block text-sm font-bold text-[#1c1b1b] mb-1">
              Client Name
            </label>
            <input
              id="reviewerName"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
              className="w-full border border-[#ebe7e7] rounded-xl py-2.5 px-4 text-sm text-[#1c1b1b] focus:border-[#4cbb17] outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#1c1b1b] mb-1">
              Client Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#ebe7e7] rounded-xl py-2.5 px-4 text-sm text-[#1c1b1b] focus:border-[#4cbb17] outline-none"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="tourSelect" className="block text-sm font-bold text-[#1c1b1b] mb-1">
              Tour
            </label>
            <select
              id="tourSelect"
              value={tourId}
              onChange={(e) => {
                const selected = tours.find((t) => t.id === e.target.value);
                setTourId(e.target.value);
                setTourName(selected?.title ?? "");
              }}
              required
              className="w-full border border-[#ebe7e7] rounded-xl py-2.5 px-4 text-sm text-[#1c1b1b] focus:border-[#4cbb17] outline-none bg-white"
            >
              <option value="">
                {loadingTours ? "Loading tours..." : "Select a tour"}
              </option>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.title}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4cbb17] text-[#1c1b1b] font-heading font-bold text-sm py-3 rounded-full hover:bg-[#3a960e] transition-colors disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Review Link"}
          </button>
        </form>

        {result && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <p className="text-sm font-bold text-[#1c1b1b] mb-2">Review Link Generated</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={result.link}
                className="flex-1 bg-[#f6f3f2] border border-[#ebe7e7] rounded-xl py-2.5 px-4 text-sm text-[#1c1b1b]"
              />
              <button
                onClick={handleCopy}
                className="bg-[#1c1b1b] text-white font-heading font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#333] transition-colors shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-[#a8a29e] mt-2">
              Share this link with the client so they can leave their review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
