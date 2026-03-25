import Link from "next/link";
import Image from "next/image";
import type { Tour } from "@/types";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4">
        <Image
          src={tour.cover_image}
          alt={tour.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {tour.featured && (
          <span className="absolute top-4 left-4 bg-[#4cbb17] text-[#1c1b1b] text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Best Seller
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-3xl font-bold text-[#1c1b1b] leading-tight">
            {tour.title}
          </h3>
          <span className="font-heading text-2xl font-bold text-[#4cbb17] shrink-0">
            ${tour.base_price}
          </span>
        </div>

        <p className="text-[#78716c] text-sm leading-relaxed line-clamp-2">
          {tour.short_description}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-4 text-[#78716c] text-sm pt-1">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">schedule</span>
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">group</span>
            {tour.capacity_default} max
          </span>
        </div>

        {/* Book Now button */}
        <button
          type="button"
          className="w-full mt-3 border border-[#1c1b1b] text-[#1c1b1b] font-heading font-bold text-sm py-3 rounded-full hover:bg-[#1c1b1b] hover:text-white transition-colors"
        >
          Book Now
        </button>
      </div>
    </Link>
  );
}
