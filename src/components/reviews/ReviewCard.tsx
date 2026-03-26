import Image from "next/image";

interface ReviewCardProps {
  reviewer_name: string;
  rating: number;
  comment: string;
  tour_title: string;
  photo_url?: string | null;
}

export default function ReviewCard({
  reviewer_name,
  rating,
  comment,
  tour_title,
  photo_url,
}: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading font-bold text-[#1c1b1b]">{reviewer_name}</p>
        <span className="inline-block bg-[#f6f3f2] text-[#1c1b1b] text-xs font-heading font-bold px-3 py-1 rounded-full">
          {tour_title}
        </span>
      </div>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-lg ${
              i < rating ? "text-[#4cbb17]" : "text-[#d4d4d4]"
            }`}
            style={{
              fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            star
          </span>
        ))}
      </div>
      <p className="text-[#1c1b1b]/80 text-sm leading-relaxed">{comment}</p>
      {photo_url && (
        <div className="mt-4 relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={photo_url}
            alt={`Photo by ${reviewer_name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
    </div>
  );
}
