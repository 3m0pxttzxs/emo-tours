'use client';

interface BookingBadgeProps {
  count: number | null;
}

export default function BookingBadge({ count }: BookingBadgeProps) {
  if (!count) return null;

  return (
    <span
      data-testid="booking-badge"
      className="inline-flex items-center justify-center rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700"
      aria-label={`${count} booked`}
    >
      {count}
    </span>
  );
}
