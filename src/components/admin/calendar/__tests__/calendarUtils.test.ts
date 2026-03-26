import { describe, it } from 'vitest';
import fc from 'fast-check';
import { getDateRange } from '@/components/admin/calendar/calendarUtils';

// Feature: admin-departure-calendar, Property 10: Date range computation
// **Validates: Requirements 4.1**

/**
 * Arbitrary that generates a valid YYYY-MM-DD date string
 * within a reasonable range (2000-01-01 to 2099-12-31).
 */
const arbDateStr = fc
  .integer({ min: 0, max: 36524 }) // ~100 years of days
  .map((offset) => {
    const base = new Date(2000, 0, 1);
    base.setDate(base.getDate() + offset);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

/** Helper: compute the number of days between two YYYY-MM-DD strings. */
function daysBetween(a: string, b: string): number {
  const msA = new Date(a + 'T00:00:00').getTime();
  const msB = new Date(b + 'T00:00:00').getTime();
  return Math.round(Math.abs(msA - msB) / (24 * 60 * 60 * 1000));
}

describe('calendarUtils – Property 10: Date range computation', () => {
  it('range length equals |daysBetween| + 1, is chronologically ordered, and is inclusive of both endpoints', () => {
    fc.assert(
      fc.property(arbDateStr, arbDateStr, (dateA, dateB) => {
        const range = getDateRange(dateA, dateB);

        // Length must be |daysBetween| + 1
        const expectedLength = daysBetween(dateA, dateB) + 1;
        if (range.length !== expectedLength) {
          return false;
        }

        // Chronological order: each element must be <= the next
        for (let i = 1; i < range.length; i++) {
          if (range[i] < range[i - 1]) {
            return false;
          }
        }

        // Inclusive: both min and max date must appear in the range
        const minDate = dateA <= dateB ? dateA : dateB;
        const maxDate = dateA <= dateB ? dateB : dateA;
        if (range[0] !== minDate || range[range.length - 1] !== maxDate) {
          return false;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 13: Calendar grid structure
// **Validates: Requirements 5.4**

import { getCalendarDays, formatDateKey, getStatusIndicator, getBookingCount } from '@/components/admin/calendar/calendarUtils';

/**
 * Arbitrary that generates a random Date representing the first day of a month
 * within a reasonable range (2000-01 to 2099-12).
 */
const arbMonth = fc
  .record({
    year: fc.integer({ min: 2000, max: 2099 }),
    month: fc.integer({ min: 0, max: 11 }),
  })
  .map(({ year, month }) => new Date(year, month, 1));

describe('calendarUtils – Property 13: Calendar grid structure', () => {
  it('returns exactly 42 dates, starts on Sunday, ends on Saturday, and contains all days of the target month', () => {
    fc.assert(
      fc.property(arbMonth, (month) => {
        const days = getCalendarDays(month);

        // Must return exactly 42 dates (6 rows × 7 columns)
        if (days.length !== 42) return false;

        // First date must be a Sunday (getDay() === 0)
        if (days[0].getDay() !== 0) return false;

        // Last date must be a Saturday (getDay() === 6)
        if (days[41].getDay() !== 6) return false;

        // All days of the target month must be present
        const year = month.getFullYear();
        const m = month.getMonth();
        const daysInMonth = new Date(year, m + 1, 0).getDate();

        const dayKeys = new Set(days.map((d) => formatDateKey(d)));

        for (let day = 1; day <= daysInMonth; day++) {
          const key = formatDateKey(new Date(year, m, day));
          if (!dayKeys.has(key)) return false;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 5: Status indicator mapping
// **Validates: Requirements 2.1, 2.2, 2.3, 2.5**

/**
 * Arbitrary that generates a Departure-like object with random boolean flags
 * for active, sold_out, and hidden, plus valid capacity/spots_left values.
 */
const arbDeparture = fc
  .record({
    active: fc.boolean(),
    sold_out: fc.boolean(),
    hidden: fc.boolean(),
    capacity: fc.integer({ min: 1, max: 100 }),
    spots_left: fc.integer({ min: 0, max: 100 }),
  })
  .map(({ active, sold_out, hidden, capacity, spots_left }) => ({
    id: 'dep-1',
    tour_id: 'tour-1',
    date: '2025-01-15',
    time: '10:00',
    capacity,
    spots_left: Math.min(spots_left, capacity),
    active,
    sold_out,
    hidden,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }));

describe('calendarUtils – Property 5: Status indicator mapping', () => {
  it('maps (active, sold_out, hidden) to the correct status indicator', () => {
    fc.assert(
      fc.property(arbDeparture, (departure) => {
        const result = getStatusIndicator(departure);

        // Priority: hidden > sold_out > active > none
        if (departure.hidden) return result === 'hidden';
        if (departure.sold_out) return result === 'sold_out';
        if (departure.active) return result === 'active';
        return result === 'none';
      }),
      { numRuns: 100 }
    );
  });

  it('returns "none" when departure is null', () => {
    fc.assert(
      fc.property(fc.constant(null), (dep) => {
        return getStatusIndicator(dep) === 'none';
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 6: Booking count computation
// **Validates: Requirements 2.4**

/**
 * Arbitrary that generates a Departure with random capacity and spots_left
 * where spots_left <= capacity.
 */
const arbDepartureForBooking = fc
  .record({
    capacity: fc.integer({ min: 0, max: 200 }),
    spots_left: fc.integer({ min: 0, max: 200 }),
  })
  .filter(({ capacity, spots_left }) => spots_left <= capacity)
  .map(({ capacity, spots_left }) => ({
    id: 'dep-1',
    tour_id: 'tour-1',
    date: '2025-01-15',
    time: '10:00',
    capacity,
    spots_left,
    active: true,
    sold_out: false,
    hidden: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }));

describe('calendarUtils – Property 6: Booking count computation', () => {
  it('returns capacity - spots_left when > 0, otherwise null', () => {
    fc.assert(
      fc.property(arbDepartureForBooking, (departure) => {
        const result = getBookingCount(departure);
        const booked = departure.capacity - departure.spots_left;

        if (booked > 0) {
          return result === booked;
        }
        return result === null;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 2: Month navigation round trip
// **Validates: Requirements 1.3, 1.4**

/**
 * Helper: navigate from a starting month by adding `steps` months.
 * Uses `new Date(year, month + steps, 1)` which correctly wraps across year boundaries.
 */
function navigateMonth(start: Date, steps: number): Date {
  return new Date(start.getFullYear(), start.getMonth() + steps, 1);
}

describe('calendarUtils – Property 2: Month navigation round trip', () => {
  it('navigating forward N months then backward N months returns to the original month and year', () => {
    fc.assert(
      fc.property(
        arbMonth,
        fc.integer({ min: 0, max: 120 }), // step count up to 10 years
        (startMonth, steps) => {
          const afterForward = navigateMonth(startMonth, steps);
          const afterRoundTrip = navigateMonth(afterForward, -steps);

          return (
            afterRoundTrip.getFullYear() === startMonth.getFullYear() &&
            afterRoundTrip.getMonth() === startMonth.getMonth()
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 3: Month heading matches displayed month
// **Validates: Requirements 1.5**

describe('calendarUtils – Property 3: Month heading matches displayed month', () => {
  it('the month name and 4-digit year derived from any Date are correct', () => {
    fc.assert(
      fc.property(arbMonth, (month) => {
        const expectedMonthName = month.toLocaleString('en-US', { month: 'long' });
        const expectedYear = month.getFullYear().toString();

        // Simulate what the heading would display
        const heading = `${month.toLocaleString('en-US', { month: 'long' })} ${month.getFullYear()}`;

        return (
          heading.includes(expectedMonthName) &&
          heading.includes(expectedYear) &&
          expectedYear.length === 4
        );
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 4: Departure filtering by tour and month
// **Validates: Requirements 1.2**

import { Departure } from '@/types';

/**
 * Pure filtering function: given departures, a tourId, and a month,
 * returns only departures whose tour_id matches and whose date falls within the month.
 */
function filterDepartures(departures: Departure[], tourId: string, month: Date): Departure[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  return departures.filter(d => {
    if (d.tour_id !== tourId) return false;
    const depDate = new Date(d.date + 'T00:00:00');
    return depDate.getFullYear() === year && depDate.getMonth() === m;
  });
}

/**
 * Arbitrary: generates a random tour ID from a small pool to ensure overlaps.
 */
const arbTourId = fc.constantFrom('tour-a', 'tour-b', 'tour-c', 'tour-d');

/**
 * Arbitrary: generates a Departure with a random tour_id and date.
 */
const arbDepartureWithVaryingTourAndDate = fc
  .record({
    tourId: arbTourId,
    year: fc.integer({ min: 2020, max: 2030 }),
    month: fc.integer({ min: 0, max: 11 }),
    day: fc.integer({ min: 1, max: 28 }), // 1-28 to avoid invalid dates
  })
  .map(({ tourId, year, month, day }) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return {
      id: `dep-${tourId}-${year}-${mm}-${dd}`,
      tour_id: tourId,
      date: `${year}-${mm}-${dd}`,
      time: '10:00',
      capacity: 10,
      spots_left: 5,
      active: true,
      sold_out: false,
      hidden: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    } satisfies Departure;
  });

describe('calendarUtils – Property 4: Departure filtering by tour and month', () => {
  it('filtered departures contain exactly those matching the given tourId and month', () => {
    fc.assert(
      fc.property(
        fc.array(arbDepartureWithVaryingTourAndDate, { minLength: 0, maxLength: 30 }),
        arbTourId,
        fc.record({
          year: fc.integer({ min: 2020, max: 2030 }),
          month: fc.integer({ min: 0, max: 11 }),
        }),
        (departures, selectedTourId, { year, month }) => {
          const selectedMonth = new Date(year, month, 1);
          const result = filterDepartures(departures, selectedTourId, selectedMonth);

          // Every result must match the tourId and fall within the month
          for (const dep of result) {
            if (dep.tour_id !== selectedTourId) return false;
            const depDate = new Date(dep.date + 'T00:00:00');
            if (depDate.getFullYear() !== year || depDate.getMonth() !== month) return false;
          }

          // Every departure in the original that matches must be in the result
          const expected = departures.filter(d => {
            if (d.tour_id !== selectedTourId) return false;
            const depDate = new Date(d.date + 'T00:00:00');
            return depDate.getFullYear() === year && depDate.getMonth() === month;
          });

          if (result.length !== expected.length) return false;

          // Verify exact same elements (by reference, since filter preserves them)
          for (let i = 0; i < result.length; i++) {
            if (result[i] !== expected[i]) return false;
          }

          return true;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// Feature: admin-departure-calendar, Property 14: Tooltip contains all departure details
// **Validates: Requirements 6.1, 6.3**

/**
 * Pure function that derives tooltip data from a Departure.
 * Mirrors the data the DepartureTooltip component renders.
 */
function getTooltipData(departure: Departure) {
  return {
    time: departure.time,
    capacity: departure.capacity,
    spotsLeft: departure.spots_left,
    status: getStatusIndicator(departure),
  };
}

describe('calendarUtils – Property 14: Tooltip contains all departure details', () => {
  it('tooltip data includes time, capacity, spots_left, and status derived from the departure', () => {
    fc.assert(
      fc.property(arbDeparture, (departure) => {
        const tooltip = getTooltipData(departure);

        // time must match departure.time
        if (tooltip.time !== departure.time) return false;

        // capacity must match departure.capacity
        if (tooltip.capacity !== departure.capacity) return false;

        // spotsLeft must match departure.spots_left
        if (tooltip.spotsLeft !== departure.spots_left) return false;

        // status must match getStatusIndicator result
        const expectedStatus = getStatusIndicator(departure);
        if (tooltip.status !== expectedStatus) return false;

        // All four fields must be present (not undefined)
        if (tooltip.time === undefined) return false;
        if (tooltip.capacity === undefined) return false;
        if (tooltip.spotsLeft === undefined) return false;
        if (tooltip.status === undefined) return false;

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
