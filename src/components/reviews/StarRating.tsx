"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4cbb17] rounded"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          >
            <span
              className={`material-symbols-outlined text-3xl ${
                filled ? "text-[#4cbb17]" : "text-[#d4d4d4]"
              }`}
              style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );
}
