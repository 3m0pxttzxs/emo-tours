// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import DateCell from '../DateCell';
import type { Departure } from '@/types';

/**
 * Feature: auto-departure-generation
 * Property 6: Fechas pasadas deshabilitan la interacción de toggle
 *
 * **Validates: Requirements 5.3**
 *
 * For any past date, DateCell rendered with isPast=true must NOT invoke
 * onToggle when clicked, even when a departure is provided.
 */

function makeDeparture(overrides: Partial<Departure> = {}): Departure {
  return {
    id: 'dep-1',
    tour_id: 'tour-1',
    date: '2024-01-01',
    time: '10:00',
    capacity: 10,
    spots_left: 10,
    active: true,
    sold_out: false,
    hidden: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/** Arbitrary that generates a past Date (1 to 3650 days before today). */
const pastDateArb = fc
  .integer({ min: 1, max: 3650 })
  .map((daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(0, 0, 0, 0);
    return d;
  });

function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('DateCell — Property 6: Past dates disable toggle interaction', () => {
  it('onToggle is never called when isPast=true, for any past date', () => {
    fc.assert(
      fc.property(pastDateArb, (pastDate) => {
        cleanup();

        const dateStr = fmtDate(pastDate);
        const departure = makeDeparture({ date: dateStr });
        const onToggle = vi.fn();
        const onRangeSelect = vi.fn();

        const { getByTestId } = render(
          <DateCell
            date={pastDate}
            departure={departure}
            isCurrentMonth={true}
            isInRange={false}
            isRangeAnchor={false}
            isToggling={false}
            isToday={false}
            isPast={true}
            onToggle={onToggle}
            onRangeSelect={onRangeSelect}
          />
        );

        const cell = getByTestId(`date-cell-${dateStr}`);
        fireEvent.click(cell);

        expect(onToggle).not.toHaveBeenCalled();
        expect(onRangeSelect).not.toHaveBeenCalled();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
