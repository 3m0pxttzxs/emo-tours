"use client";

import { useState } from "react";
import Image from "next/image";

interface TourGalleryProps {
  images: string[];
  alt: string;
}

export default function TourGallery({ images, alt }: TourGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={images[activeIndex]}
          alt={`${alt} — photo ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={activeIndex === 0}
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? "border-[#4cbb17] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
