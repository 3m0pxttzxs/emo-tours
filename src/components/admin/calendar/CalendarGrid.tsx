'use client';

import { Departure } from '@/types';
import { getCalendarDays, formatDateKey } from './calendarUtils';
import DateCell from './DateCell';

interface CalendarGridProps {
  currentMonth: Date;
  departureMap: Map<string, Departure>;
  selectedDates: string[];
  anchorDate: string | null;
  togglingIds: Set<string>;
  loading: boolean;
  onToggle: (departure: Departure) => void;
  onRangeSelect: (dateStr: string, isShift: boolean) => void;
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({
  currentMonth,
  departureMap,
  selectedDates,
  anchorDate,
  togglingIds,
  loading,
  onToggle,
  onRangeSelect,
}: CalendarGridProps) {
  if (loading) {
    return (
      <div data-testid="calendar-skeleton" className="grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase text-gray-500"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 42 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg min-h-[72px]"
          />
        ))}
      </div>
    );
  }

  const days = getCalendarDays(currentMonth);
  const currentMonthIndex = currentMonth.getMonth();
  const todayStr = formatDateKey(new Date());

  return (
    <div data-testid="calendar-grid" className="grid grid-cols-7 gap-1">
      {DAY_HEADERS.map((day) => (
        <div
          key={day}
          className="py-2 text-center text-xs font-semibold uppercase text-gray-500"
        >
          {day}
        </div>
      ))}
      {days.map((date) => {
        const dateKey = formatDateKey(date);
        const departure = departureMap.get(dateKey) ?? null;
        const isToday = dateKey === todayStr;
        const isPast = dateKey < todayStr;

        return (
          <DateCell
            key={dateKey}
            date={date}
            departure={departure}
            isCurrentMonth={date.getMonth() === currentMonthIndex}
            isInRange={selectedDates.includes(dateKey)}
            isRangeAnchor={dateKey === anchorDate}
            isToggling={departure ? togglingIds.has(departure.id) : false}
            isToday={isToday}
            isPast={isPast}
            onToggle={onToggle}
            onRangeSelect={onRangeSelect}
          />
        );
      })}
    </div>
  );
}
