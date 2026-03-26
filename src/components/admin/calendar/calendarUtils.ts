import { Departure } from '@/types';

/**
 * Returns 42 dates (6 rows × 7 cols) for a calendar month grid,
 * starting from the Sunday on or before the first of the month.
 */
export function getCalendarDays(month: Date): Date[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstOfMonth = new Date(year, m, 1);
  const startDay = firstOfMonth.getDay(); // 0 = Sunday

  const start = new Date(year, m, 1 - startDay);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}

/**
 * Formats a Date to a YYYY-MM-DD string.
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns all date strings between `start` and `end` inclusive, in chronological order.
 * Handles the case where start > end by swapping them.
 */
export function getDateRange(start: string, end: string): string[] {
  const a = new Date(start + 'T00:00:00');
  const b = new Date(end + 'T00:00:00');
  const from = a <= b ? a : b;
  const to = a <= b ? b : a;

  const result: string[] = [];
  const current = new Date(from);
  while (current <= to) {
    result.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
}

/**
 * Indexes departures by date string for O(1) lookup.
 * If multiple departures share the same date, the first one wins.
 */
export function buildDepartureMap(departures: Departure[]): Map<string, Departure> {
  const map = new Map<string, Departure>();
  for (const dep of departures) {
    if (!map.has(dep.date)) {
      map.set(dep.date, dep);
    }
  }
  return map;
}

/**
 * Pure function mapping a departure (or null) to a status string.
 */
export function getStatusIndicator(
  departure: Departure | null
): 'live' | 'sold_out' | 'inactive' | 'none' {
  if (!departure) return 'none';
  if (departure.hidden || !departure.active) return 'inactive';
  if (departure.sold_out) return 'sold_out';
  return 'live';
}

/**
 * Returns the number of booked spots (capacity - spots_left) if > 0, else null.
 */
export function getBookingCount(departure: Departure): number | null {
  const booked = departure.capacity - departure.spots_left;
  return booked > 0 ? booked : null;
}
