interface PriceBlockProps {
  basePrice: number;
  guestCount?: number;
  total?: number;
  priceLabel?: string;
}

export default function PriceBlock({
  basePrice,
  guestCount,
  total,
  priceLabel,
}: PriceBlockProps) {
  const computedTotal = total ?? (guestCount ? basePrice * guestCount : undefined);

  return (
    <div className="space-y-1">
      <span className="text-xs uppercase tracking-widest text-[#78716c]">
        {priceLabel ?? "From"}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-4xl font-bold text-[#1c1b1b]">
          ${basePrice}
        </span>
        <span className="text-[#78716c] text-sm">/person</span>
      </div>
      {guestCount != null && guestCount > 0 && computedTotal != null && (
        <p className="text-sm text-[#78716c]">
          {guestCount} {guestCount === 1 ? "guest" : "guests"} · Total{" "}
          <span className="font-bold text-[#1c1b1b]">${computedTotal}</span>
        </p>
      )}
    </div>
  );
}
