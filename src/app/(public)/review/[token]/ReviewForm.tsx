"use client";

import { useState } from "react";
import StarRating from "@/components/reviews/StarRating";
import PhotoUpload from "@/components/reviews/PhotoUpload";

interface ReviewFormProps {
  token: string;
}

export default function ReviewForm({ token }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (rating < 1 || rating > 5) newErrors.rating = "Please select a rating";
    if (comment.trim().length < 10) newErrors.comment = "Comment must be at least 10 characters";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      let photo_url: string | undefined;

      // Upload photo first if selected
      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        formData.append("token", token);

        const uploadRes = await fetch("/api/reviews/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photo_url = uploadData.url;
        }
        // If upload fails, continue without photo
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating, comment, photo_url }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        if (res.status === 410) {
          setErrors({ _form: data.error });
        } else if (res.status === 404) {
          setErrors({ _form: data.error });
        } else {
          setErrors({ _form: data.details?.comment || data.error || "Something went wrong" });
        }
      }
    } catch {
      setErrors({ _form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
        <span
          className="material-symbols-outlined text-6xl text-[#4cbb17] mb-4 block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          celebration
        </span>
        <h2 className="font-heading text-2xl font-bold text-[#1c1b1b] mb-2">
          Thank You!
        </h2>
        <p className="text-[#78716c]">
          Your review has been submitted and will be published after approval.
          We appreciate your feedback!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
      {errors._form && (
        <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">
          {errors._form}
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block font-heading font-bold text-[#1c1b1b] mb-3">
          Your Rating
        </label>
        <StarRating value={rating} onChange={setRating} />
        {errors.rating && <p className="text-red-500 text-sm mt-2">{errors.rating}</p>}
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block font-heading font-bold text-[#1c1b1b] mb-3">
          Your Experience
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          placeholder="Tell us about your tour experience (at least 10 characters)..."
          className="w-full border border-[#ebe7e7] rounded-xl p-4 text-sm focus:border-[#4cbb17] outline-none resize-none"
        />
        <div className="flex justify-between mt-1">
          {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
          <p className="text-xs text-[#a8a29e] ml-auto">{comment.length} characters</p>
        </div>
      </div>

      {/* Photo */}
      <div>
        <label className="block font-heading font-bold text-[#1c1b1b] mb-3">
          Add a Photo
        </label>
        <PhotoUpload onFileSelect={setPhoto} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#4cbb17] text-[#1c1b1b] font-heading font-bold text-base py-4 rounded-full hover:bg-[#3a960e] transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
