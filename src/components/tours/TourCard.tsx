import Link from "next/link";
import Image from "next/image";
import type { Tour } from "@/types";
import { formatScheduleShort, formatPrice, isRequestOnly } from "@/lib/schedule";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const requestOnly = isRequestOnly(tour.type, tour.weekday);
  const href = requestOnly && tour.type === 'custom'
    ? '/custom-tours'
    : `/tours/${tour.slug}`;

  return (
    <Link href={href} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4">
        <Image
          src={tour.cover_image}
          alt={tour.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Schedule badge */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1c1b1b] text-xs font-heading font-bold px-3 py-1.5 rounded-full">
          {requestOnly ? 'Private · By request' : formatScheduleShort(tour.weekday, tour.departure_time)}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-2xl font-bold text-[#1c1b1b] leading-tight">
            {tour.title}
          </h3>
          <span className="font-heading text-lg font-bold text-[#4cbb17] shrink-0">
            {formatPrice(tour.base_price)}
          </span>
        </div>

        <p className="text-[#78716c] text-sm leading-relaxed line-clamp-2">
          {tour.short_description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-[#78716c] text-xs pt-1">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">group</span>
            {requestOnly ? 'Private' : 'Shared / Private'}
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="w-full mt-3 border border-[#1c1b1b] text-[#1c1b1b] font-heading font-bold text-sm py-3 rounded-full hover:bg-[#1c1b1b] hover:text-white transition-colors"
        >
          {requestOnly ? 'Request Info' : 'Book Now'}
        </button>
      </div>
    </Link>
  );
}
