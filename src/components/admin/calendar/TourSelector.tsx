'use client';

import type { Tour } from '@/types';

interface TourSelectorProps {
  tours: Pick<Tour, 'id' | 'title'>[];
  selectedTourId: string | null;
  onSelect: (tourId: string) => void;
}

export default function TourSelector({ tours, selectedTourId, onSelect }: TourSelectorProps) {
  const sortedTours = [...tours].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <select
      data-testid="tour-selector"
      value={selectedTourId ?? ''}
      onChange={(e) => onSelect(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#4CBB17] focus:outline-none focus:ring-1 focus:ring-[#4CBB17]"
    >
      <option value="" disabled>
        Select a tour...
      </option>
      {sortedTours.map((tour) => (
        <option key={tour.id} value={tour.id}>
          {tour.title}
        </option>
      ))}
    </select>
  );
}
