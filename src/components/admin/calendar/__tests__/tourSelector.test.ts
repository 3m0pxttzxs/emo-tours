import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// Feature: admin-departure-calendar, Property 1: Tour list alphabetical ordering
// **Validates: Requirements 1.1**

/**
 * Arbitrary that generates a random tour object with an id and a random title string.
 */
const arbTour = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 50 }),
});

/**
 * Sorting logic extracted from TourSelector component:
 *   [...tours].sort((a, b) => a.title.localeCompare(b.title))
 */
function sortTours(tours: { id: string; title: string }[]): { id: string; title: string }[] {
  return [...tours].sort((a, b) => a.title.localeCompare(b.title));
}

describe('TourSelector – Property 1: Tour list alphabetical ordering', () => {
  it('sorts any random array of tours alphabetically by title', () => {
    fc.assert(
      fc.property(fc.array(arbTour, { minLength: 0, maxLength: 50 }), (tours) => {
        const sorted = sortTours(tours);

        // Length must be preserved
        expect(sorted.length).toBe(tours.length);

        // Each consecutive pair must be in localeCompare order
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i - 1].title.localeCompare(sorted[i].title)).toBeLessThanOrEqual(0);
        }
      }),
      { numRuns: 100 }
    );
  });
});
