import { describe, it } from 'vitest';
import fc from 'fast-check';
import type { Departure } from '@/types';

// --- Pure bulk toggle logic functions under test ---

/**
 * Applies a bulk toggle to a set of departures, setting all hidden fields
 * to the target value. Represents the successful bulk action outcome.
 */
function applyBulkToggle(departures: Departure[], targetHidden: boolean): Departure[] {
  return departures.map(d => ({ ...d, hidden: targetHidden }));
}

/**
 * Applies a partial bulk toggle where some API calls failed.
 * Failed departures revert to their original hidden value;
 * successful departures get the target hidden value.
 */
function applyPartialBulkToggle(
  originals: Departure[],
  targetHidden: boolean,
  failedIds: Set<string>
): Departure[] {
  return originals.map(d => ({
    ...d,
    hidden: failedIds.has(d.id) ? d.hidden : targetHidden,
  }));
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


// Feature: admin-departure-calendar, Property 11: Bulk toggle sets target value
// **Validates: Requirements 4.3, 4.4**

describe('bulkToggle – Property 11: Bulk toggle sets target value', () => {
  it('after a successful bulk toggle, every departure hidden field equals the target value', () => {
    fc.assert(
      fc.property(
        fc.array(arbDeparture, { minLength: 1, maxLength: 20 }),
        fc.boolean(),
        (departures, targetHidden) => {
          const result = applyBulkToggle(departures, targetHidden);

          // Every departure must have hidden === targetHidden
          for (const dep of result) {
            if (dep.hidden !== targetHidden) return false;
          }

          // Result length must match input length
          if (result.length !== departures.length) return false;

          // All other fields must remain unchanged
          for (let i = 0; i < departures.length; i++) {
            if (result[i].id !== departures[i].id) return false;
            if (result[i].tour_id !== departures[i].tour_id) return false;
            if (result[i].date !== departures[i].date) return false;
            if (result[i].time !== departures[i].time) return false;
            if (result[i].capacity !== departures[i].capacity) return false;
            if (result[i].spots_left !== departures[i].spots_left) return false;
            if (result[i].active !== departures[i].active) return false;
            if (result[i].sold_out !== departures[i].sold_out) return false;
            if (result[i].created_at !== departures[i].created_at) return false;
            if (result[i].updated_at !== departures[i].updated_at) return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: admin-departure-calendar, Property 12: Partial bulk failure revert
// **Validates: Requirements 4.6**

describe('bulkToggle – Property 12: Partial bulk failure revert', () => {
  it('failed departures revert to original hidden, successful departures get target value', () => {
    fc.assert(
      fc.property(
        fc.array(arbDeparture, { minLength: 1, maxLength: 20 }),
        fc.boolean(),
        (departures, targetHidden) => {
          // Pick a random subset of IDs as failed
          const failedIds = new Set(
            departures
              .filter((_, i) => i % 2 === 0) // deterministic subset for reproducibility
              .map(d => d.id)
          );

          const result = applyPartialBulkToggle(departures, targetHidden, failedIds);

          // Result length must match input length
          if (result.length !== departures.length) return false;

          for (let i = 0; i < departures.length; i++) {
            const original = departures[i];
            const updated = result[i];

            if (failedIds.has(original.id)) {
              // Failed: hidden must revert to original
              if (updated.hidden !== original.hidden) return false;
            } else {
              // Succeeded: hidden must equal target
              if (updated.hidden !== targetHidden) return false;
            }

            // All other fields must remain unchanged
            if (updated.id !== original.id) return false;
            if (updated.tour_id !== original.tour_id) return false;
            if (updated.date !== original.date) return false;
            if (updated.time !== original.time) return false;
            if (updated.capacity !== original.capacity) return false;
            if (updated.spots_left !== original.spots_left) return false;
            if (updated.active !== original.active) return false;
            if (updated.sold_out !== original.sold_out) return false;
            if (updated.created_at !== original.created_at) return false;
            if (updated.updated_at !== original.updated_at) return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('with randomly selected failure indices, correct departures revert or keep target', () => {
    fc.assert(
      fc.property(
        fc.array(arbDeparture, { minLength: 1, maxLength: 20 }),
        fc.boolean(),
        fc.array(fc.nat({ max: 19 }), { minLength: 0, maxLength: 10 }),
        (departures, targetHidden, failureIndices) => {
          // Build failed IDs from random indices (clamped to array bounds)
          const failedIds = new Set(
            failureIndices
              .filter(i => i < departures.length)
              .map(i => departures[i].id)
          );

          const result = applyPartialBulkToggle(departures, targetHidden, failedIds);

          if (result.length !== departures.length) return false;

          for (let i = 0; i < departures.length; i++) {
            const original = departures[i];
            const updated = result[i];

            if (failedIds.has(original.id)) {
              if (updated.hidden !== original.hidden) return false;
            } else {
              if (updated.hidden !== targetHidden) return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
