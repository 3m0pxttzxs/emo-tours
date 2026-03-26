import { describe, it } from 'vitest';
import fc from 'fast-check';
import type { Departure } from '@/types';

// --- Pure toggle logic functions under test ---

/**
 * Applies a toggle to a departure by negating the hidden field.
 * All other fields remain unchanged.
 */
function applyToggle(departure: Departure): Departure {
  return { ...departure, hidden: !departure.hidden };
}

/**
 * Reverts a toggle by restoring the original hidden value.
 * Simulates optimistic revert on API failure.
 */
function revertToggle(original: Departure, toggled: Departure): Departure {
  return { ...toggled, hidden: original.hidden };
}

/**
 * Determines whether a departure should be toggled given the set of
 * currently-toggling IDs. Returns false (no-op) if the departure is
 * already being toggled.
 */
function shouldToggle(departureId: string, togglingIds: Set<string>): boolean {
  return !togglingIds.has(departureId);
}

// --- Arbitrary generators ---

/**
 * Generates a random Departure object with all fields populated.
 */
const arbDeparture: fc.Arbitrary<Departure> = fc
  .record({
    id: fc.uuid(),
    tour_id: fc.uuid(),
    date: fc.integer({ min: 0, max: 36524 }).map((offset) => {
      const base = new Date(2000, 0, 1);
      base.setDate(base.getDate() + offset);
      const y = base.getFullYear();
      const m = String(base.getMonth() + 1).padStart(2, '0');
      const d = String(base.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }),
    time: fc
      .record({
        hour: fc.integer({ min: 0, max: 23 }),
        minute: fc.integer({ min: 0, max: 59 }),
      })
      .map(({ hour, minute }) =>
        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      ),
    capacity: fc.integer({ min: 1, max: 100 }),
    spots_left: fc.integer({ min: 0, max: 100 }),
    active: fc.boolean(),
    sold_out: fc.boolean(),
    hidden: fc.boolean(),
    created_at: fc.constant('2025-01-01T00:00:00Z'),
    updated_at: fc.constant('2025-01-01T00:00:00Z'),
  })
  .map((rec) => ({
    ...rec,
    spots_left: Math.min(rec.spots_left, rec.capacity),
  }));

// Feature: admin-departure-calendar, Property 7: Toggle flips hidden field
// **Validates: Requirements 3.1, 3.2**

describe('toggleLogic – Property 7: Toggle flips hidden field', () => {
  it('toggling negates hidden and leaves all other fields identical', () => {
    fc.assert(
      fc.property(arbDeparture, (departure) => {
        const toggled = applyToggle(departure);

        // hidden must be negated
        if (toggled.hidden !== !departure.hidden) return false;

        // all other fields must be identical
        if (toggled.id !== departure.id) return false;
        if (toggled.tour_id !== departure.tour_id) return false;
        if (toggled.date !== departure.date) return false;
        if (toggled.time !== departure.time) return false;
        if (toggled.capacity !== departure.capacity) return false;
        if (toggled.spots_left !== departure.spots_left) return false;
        if (toggled.active !== departure.active) return false;
        if (toggled.sold_out !== departure.sold_out) return false;
        if (toggled.created_at !== departure.created_at) return false;
        if (toggled.updated_at !== departure.updated_at) return false;

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 8: Optimistic revert on failure
// **Validates: Requirements 3.4, 7.4**

describe('toggleLogic – Property 8: Optimistic revert on failure', () => {
  it('reverting a toggled departure restores the original state exactly', () => {
    fc.assert(
      fc.property(arbDeparture, (departure) => {
        const toggled = applyToggle(departure);
        const reverted = revertToggle(departure, toggled);

        // After revert, the departure must be identical to the original
        if (reverted.hidden !== departure.hidden) return false;
        if (reverted.id !== departure.id) return false;
        if (reverted.tour_id !== departure.tour_id) return false;
        if (reverted.date !== departure.date) return false;
        if (reverted.time !== departure.time) return false;
        if (reverted.capacity !== departure.capacity) return false;
        if (reverted.spots_left !== departure.spots_left) return false;
        if (reverted.active !== departure.active) return false;
        if (reverted.sold_out !== departure.sold_out) return false;
        if (reverted.created_at !== departure.created_at) return false;
        if (reverted.updated_at !== departure.updated_at) return false;

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 9: Loading state prevents re-toggle
// **Validates: Requirements 3.5**

describe('toggleLogic – Property 9: Loading state prevents re-toggle', () => {
  it('shouldToggle returns false when the departure ID is in the toggling set', () => {
    fc.assert(
      fc.property(
        arbDeparture,
        fc.array(fc.uuid(), { minLength: 0, maxLength: 10 }),
        (departure, extraIds) => {
          // Build a toggling set that includes this departure's ID
          const togglingIds = new Set([departure.id, ...extraIds]);

          // Should be a no-op — must return false
          return shouldToggle(departure.id, togglingIds) === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('shouldToggle returns true when the departure ID is NOT in the toggling set', () => {
    fc.assert(
      fc.property(
        arbDeparture,
        fc.array(fc.uuid(), { minLength: 0, maxLength: 10 }),
        (departure, otherIds) => {
          // Build a toggling set that does NOT include this departure's ID
          const togglingIds = new Set(otherIds.filter((id) => id !== departure.id));

          // Should allow toggle — must return true
          return shouldToggle(departure.id, togglingIds) === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
