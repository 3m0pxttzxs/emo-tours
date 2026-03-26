'use client';

import { Departure } from '@/types';
import { getStatusIndicator } from './calendarUtils';

interface DepartureTooltipProps {
  departure: Departure;
}

const statusLabels: Record<string, string> = {
  live: 'Live',
  sold_out: 'Sold Out',
  inactive: 'Inactive',
  none: '—',
};

const statusStyles: Record<string, string> = {
  live: 'bg-green-100 text-green-800',
  sold_out: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-600',
  none: '',
};

export default function DepartureTooltip({ departure }: DepartureTooltipProps) {
  const status = getStatusIndicator(departure);
  const label = statusLabels[status];

  return (
    <div
      data-testid="departure-tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-white p-3 text-sm shadow-lg ring-1 ring-gray-200 opacity-0 transition-opacity duration-200 delay-0 group-hover:opacity-100 group-hover:delay-[200ms]"
      role="tooltip"
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Time</span>
          <span className="font-medium text-gray-900">{departure.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Capacity</span>
          <span className="font-medium text-gray-900">{departure.capacity}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Spots left</span>
          <span className="font-medium text-gray-900">{departure.spots_left}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${statusStyles[status]}`}>
            {label}
          </span>
        </div>
      </div>
      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
    </div>
  );
}
