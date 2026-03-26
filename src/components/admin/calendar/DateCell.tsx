'use client';

import { Departure } from '@/types';
import StatusIndicator from './StatusIndicator';
import BookingBadge from './BookingBadge';
import DepartureTooltip from './DepartureTooltip';
import { getStatusIndicator, getBookingCount } from './calendarUtils';

interface DateCellProps {
  date: Date;
  departure: Departure | null;
  isCurrentMonth: boolean;
  isInRange: boolean;
  isRangeAnchor: boolean;
  isToggling: boolean;
  isToday: boolean;
  isPast: boolean;
  onToggle: (departure: Departure) => void;
  onRangeSelect: (dateStr: string, isShift: boolean) => void;
}

export default function DateCell({
  date,
  departure,
  isCurrentMonth,
  isInRange,
  isRangeAnchor,
  isToggling,
  isToday,
  isPast,
  onToggle,
  onRangeSelect,
}: DateCellProps) {
  const day = date.getDate();
  const status = getStatusIndicator(departure);
  const bookingCount = departure ? getBookingCount(departure) : null;

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  function handleClick(e: React.MouseEvent) {
    if (isToggling || isPast) return;

    if (e.shiftKey) {
      onRangeSelect(dateStr, true);
      return;
    }

    if (departure) {
      onToggle(departure);
    } else {
      onRangeSelect(dateStr, false);
    }
  }

  return (
    <div
      data-testid={`date-cell-${dateStr}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      className={`group relative flex min-h-[72px] flex-col items-center gap-1 rounded-lg border p-2 text-sm transition-colors select-none
        ${isToggling ? 'pointer-events-none opacity-60' : isPast ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-gray-50'}
        ${!isCurrentMonth ? 'text-gray-300 border-gray-100 bg-gray-50/50' : 'text-gray-700 border-gray-200 bg-white'}
        ${isInRange && !isRangeAnchor ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-200' : ''}
        ${isRangeAnchor ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300' : ''}
        ${isToday ? 'border-[#4CBB17] border-2 bg-green-50/30' : ''}
      `}
    >
      {/* Day number */}
      <span className={`font-medium ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}`}>
        {day}
      </span>

      {/* Status dot + booking badge row */}
      <div className="flex items-center gap-1">
        <StatusIndicator status={status} />
        <BookingBadge count={bookingCount} />
      </div>

      {/* Loading spinner */}
      {isToggling && (
        <div data-testid="toggle-spinner" className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/60">
          <svg
            className="h-4 w-4 animate-spin text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* Tooltip on hover */}
      {departure && <DepartureTooltip departure={departure} />}
    </div>
  );
}
