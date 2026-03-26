import { describe, it, expect, vi, beforeEach } from "vitest";
import fc from "fast-check";
import { computeDepartureDates } from "../generate";
import type { regenerateDepartures as RegenerateDeparturesType } from "../generate";

/**
 * Feature: auto-departure-generation
 * Property 1: Todas las fechas generadas coinciden con el weekday y caen dentro del horizonte
 *
 * Validates: Requirements 1.1, 2.2, 3.3
 */
describe("computeDepartureDates — Property 1", () => {
  it("all generated dates match the weekday and fall within the horizon", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 6 }),
        fc.date({
          min: new Date(2020, 0, 1),
          max: new Date(2030, 11, 31),
        }),
        fc.integer({ min: 1, max: 12 }),
        (weekday, startDate, horizonMonths) => {
          const dates = computeDepartureDates(weekday, startDate, horizonMonths);

          // Compute the expected end boundary
          const endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + horizonMonths,
            startDate.getDate()
          );

          // Normalise startDate to midnight for comparison
          const startMidnight = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );

          for (const dateStr of dates) {
            const parsed = new Date(dateStr + "T00:00:00");

            // Every date must land on the requested weekday
            expect(parsed.getDay()).toBe(weekday);

            // Every date must be >= startDate (midnight)
            expect(parsed.getTime()).toBeGreaterThanOrEqual(
              startMidnight.getTime()
            );

            // Every date must be < endDate
            expect(parsed.getTime()).toBeLessThan(endDate.getTime());
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});

/**
 * Feature: auto-departure-generation
 * Property 2: Todas las departures generadas tienen valores por defecto correctos
 *
 * **Validates: Requirements 1.2, 1.3, 1.4, 1.5**
 */
describe("generateDeparturesForTour — Property 2", () => {
  let insertedRows: Record<string, unknown>[] = [];

  beforeEach(() => {
    insertedRows = [];
    vi.resetModules();
  });

  it("all generated departures have correct default values", async () => {
    // Arbitrary for a valid HH:MM time string
    const timeArb = fc
      .tuple(fc.integer({ min: 0, max: 23 }), fc.integer({ min: 0, max: 59 }))
      .map(
        ([h, m]) =>
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // capacityDefault
        timeArb, // departureTime
        fc.integer({ min: 0, max: 6 }), // weekday
        fc.integer({ min: 1, max: 6 }), // horizonMonths
        async (capacityDefault, departureTime, weekday, horizonMonths) => {
          insertedRows = [];

          // Mock the Supabase module before importing generateDeparturesForTour
          vi.doMock("@/lib/supabase/server", () => ({
            supabaseAdmin: {
              from: () => ({
                select: () => ({
                  eq: () => ({
                    in: () =>
                      Promise.resolve({ data: [], error: null }),
                  }),
                }),
                insert: (rows: Record<string, unknown>[]) => {
                  insertedRows = rows;
                  return Promise.resolve({ error: null });
                },
              }),
            },
          }));

          const { generateDeparturesForTour } = await import("../generate");

          const tourId = "test-tour-id";
          await generateDeparturesForTour(
            tourId,
            weekday,
            departureTime,
            capacityDefault,
            horizonMonths
          );

          // Verify every inserted row has the correct default values
          for (const row of insertedRows) {
            expect(row.capacity).toBe(capacityDefault);
            expect(row.spots_left).toBe(capacityDefault);
            expect(row.time).toBe(departureTime);
            expect(row.active).toBe(true);
            expect(row.sold_out).toBe(false);
            expect(row.hidden).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: auto-departure-generation
 * Property 3: Weekday o departure_time nulos no producen departures nuevas
 *
 * **Validates: Requirements 1.6, 2.5**
 */
describe("regenerateDepartures — Property 3", () => {
  let insertCalled: boolean;

  beforeEach(() => {
    insertCalled = false;
    vi.resetModules();
  });

  /**
   * Arbitrary that generates one of three null-combinations:
   * 1. newWeekday = null, newDepartureTime = valid string
   * 2. newWeekday = valid number, newDepartureTime = null
   * 3. newWeekday = null, newDepartureTime = null
   */
  const nullCombinationArb = fc.oneof(
    // weekday null, departure_time valid
    fc
      .tuple(
        fc.constant(null as number | null),
        fc
          .tuple(
            fc.integer({ min: 0, max: 23 }),
            fc.integer({ min: 0, max: 59 })
          )
          .map(
            ([h, m]) =>
              `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
          )
      )
      .map(([weekday, time]) => ({
        newWeekday: weekday,
        newDepartureTime: time as string | null,
      })),
    // weekday valid, departure_time null
    fc
      .tuple(
        fc.integer({ min: 0, max: 6 }),
        fc.constant(null as string | null)
      )
      .map(([weekday, time]) => ({
        newWeekday: weekday as number | null,
        newDepartureTime: time,
      })),
    // both null
    fc.constant({
      newWeekday: null as number | null,
      newDepartureTime: null as string | null,
    })
  );

  it("null weekday or departure_time produces created === 0", async () => {
    await fc.assert(
      fc.asyncProperty(
        nullCombinationArb,
        fc.integer({ min: 1, max: 100 }), // capacityDefault
        async ({ newWeekday, newDepartureTime }, capacityDefault) => {
          insertCalled = false;

          vi.doMock("@/lib/supabase/server", () => ({
            supabaseAdmin: {
              from: () => ({
                select: () => ({
                  eq: () => ({
                    gte: () =>
                      Promise.resolve({ data: [], error: null }),
                    in: () =>
                      Promise.resolve({ data: [], error: null }),
                  }),
                }),
                insert: (rows: Record<string, unknown>[]) => {
                  insertCalled = true;
                  return Promise.resolve({ error: null });
                },
                delete: () => ({
                  in: () => Promise.resolve({ error: null }),
                }),
              }),
            },
          }));

          const { regenerateDepartures } = (await import(
            "../generate"
          )) as { regenerateDepartures: typeof RegenerateDeparturesType };

          const result = await regenerateDepartures(
            "test-tour-id",
            newWeekday,
            newDepartureTime,
            capacityDefault
          );

          expect(result.created).toBe(0);
          expect(insertCalled).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: auto-departure-generation
 * Property 4: La regeneración preserva departures pasadas y con reservas, elimina solo futuras sin reservas
 *
 * **Validates: Requirements 2.1, 2.3, 2.4, 4.2, 4.3**
 */
describe("regenerateDepartures — Property 4", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  /**
   * Helper: format a Date to "YYYY-MM-DD"
   */
  function fmtDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  /**
   * Arbitrary for a single departure record.
   * Generates a mix of:
   *  - past vs future dates
   *  - with bookings (spots_left < capacity) vs without (spots_left === capacity)
   */
  const departureArb = fc
    .record({
      id: fc.uuid(),
      // offset in days from today: negative = past, positive = future
      dayOffset: fc.integer({ min: -60, max: 60 }),
      capacity: fc.integer({ min: 1, max: 100 }),
      hasBookings: fc.boolean(),
    })
    .map(({ id, dayOffset, capacity, hasBookings }) => {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      const dateStr = fmtDate(date);

      // tomorrow boundary (same logic as regenerateDepartures)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = fmtDate(tomorrow);

      const isFuture = dateStr >= tomorrowStr;
      const spots_left = hasBookings
        ? Math.max(0, capacity - fc.sample(fc.integer({ min: 1, max: capacity }), 1)[0])
        : capacity;

      return {
        id,
        date: dateStr,
        capacity,
        spots_left,
        isFuture,
        hasBookings: spots_left < capacity,
      };
    });

  it("preserves past and booked departures, deletes only future unbooked ones", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(departureArb, { minLength: 1, maxLength: 20 }),
        async (allDepartures) => {
          vi.resetModules();

          // Separate departures into future (what the DB query returns) and past (never seen)
          const futureDepartures = allDepartures.filter((d) => d.isFuture);

          // Expected: only future departures with spots_left === capacity should be deleted
          const expectedDeletedIds = new Set(
            futureDepartures
              .filter((d) => d.spots_left === d.capacity)
              .map((d) => d.id)
          );

          // Track which IDs are actually passed to delete().in()
          let deletedIds: string[] = [];

          vi.doMock("@/lib/supabase/server", () => ({
            supabaseAdmin: {
              from: (table: string) => ({
                select: () => ({
                  eq: () => ({
                    // .gte('date', tomorrowStr) — returns only future departures
                    gte: () =>
                      Promise.resolve({
                        data: futureDepartures.map((d) => ({
                          id: d.id,
                          date: d.date,
                          capacity: d.capacity,
                          spots_left: d.spots_left,
                        })),
                        error: null,
                      }),
                    // .in('date', dates) — used by generateDeparturesForTour
                    in: () =>
                      Promise.resolve({ data: [], error: null }),
                  }),
                }),
                delete: () => ({
                  in: (_col: string, ids: string[]) => {
                    deletedIds = ids;
                    return Promise.resolve({ error: null });
                  },
                }),
                insert: () => Promise.resolve({ error: null }),
              }),
            },
          }));

          const { regenerateDepartures } = (await import(
            "../generate"
          )) as { regenerateDepartures: typeof RegenerateDeparturesType };

          const result = await regenerateDepartures(
            "test-tour-id",
            null, // pass null so no new departures are generated (focus on deletion logic)
            null,
            10
          );

          // Verify deleted count matches expected
          expect(result.deleted).toBe(expectedDeletedIds.size);

          // Verify exactly the right IDs were deleted
          const actualDeletedSet = new Set(deletedIds);
          expect(actualDeletedSet.size).toBe(expectedDeletedIds.size);
          for (const id of expectedDeletedIds) {
            expect(actualDeletedSet.has(id)).toBe(true);
          }

          // Verify NO future departure with bookings was deleted
          for (const dep of futureDepartures) {
            if (dep.spots_left < dep.capacity) {
              expect(actualDeletedSet.has(dep.id)).toBe(false);
            }
          }

          // Past departures are never even returned by the query,
          // so they can't appear in deletedIds — verify this implicitly
          const pastIds = new Set(
            allDepartures.filter((d) => !d.isFuture).map((d) => d.id)
          );
          for (const id of pastIds) {
            expect(actualDeletedSet.has(id)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: auto-departure-generation
 * Property 5: No se crean departures duplicadas por fecha
 *
 * **Validates: Requirements 4.4**
 */
describe("generateDeparturesForTour — Property 5", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("no duplicate dates are created — inserted dates don't overlap with existing and are unique", async () => {
    const timeArb = fc
      .tuple(fc.integer({ min: 0, max: 23 }), fc.integer({ min: 0, max: 59 }))
      .map(
        ([h, m]) =>
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 6 }), // weekday
        fc.integer({ min: 1, max: 6 }), // horizonMonths
        fc.integer({ min: 1, max: 100 }), // capacityDefault
        timeArb, // departureTime
        // Random fraction of dates to mark as "already existing"
        fc.double({ min: 0, max: 1, noNaN: true }),
        async (weekday, horizonMonths, capacityDefault, departureTime, existingFraction) => {
          vi.resetModules();

          // Pre-compute the dates that generateDeparturesForTour will calculate
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const allDates = computeDepartureDates(weekday, tomorrow, horizonMonths);

          // Pick a random subset of those dates to simulate "already existing" departures
          const existingCount = Math.floor(allDates.length * existingFraction);
          const existingDates = allDates.slice(0, existingCount);
          const existingSet = new Set(existingDates);

          // Track inserted rows
          let insertedRows: Record<string, unknown>[] = [];

          vi.doMock("@/lib/supabase/server", () => ({
            supabaseAdmin: {
              from: () => ({
                select: () => ({
                  eq: () => ({
                    in: () =>
                      Promise.resolve({
                        data: existingDates.map((d) => ({ date: d })),
                        error: null,
                      }),
                  }),
                }),
                insert: (rows: Record<string, unknown>[]) => {
                  insertedRows = rows;
                  return Promise.resolve({ error: null });
                },
              }),
            },
          }));

          const { generateDeparturesForTour } = await import("../generate");

          const result = await generateDeparturesForTour(
            "test-tour-id",
            weekday,
            departureTime,
            capacityDefault,
            horizonMonths
          );

          // 1. No inserted date should overlap with an existing date
          for (const row of insertedRows) {
            expect(existingSet.has(row.date as string)).toBe(false);
          }

          // 2. All inserted dates must be unique (no duplicates within the batch)
          const insertedDates = insertedRows.map((r) => r.date as string);
          const uniqueInserted = new Set(insertedDates);
          expect(uniqueInserted.size).toBe(insertedDates.length);

          // 3. created count matches actual inserted rows
          expect(result.created).toBe(insertedRows.length);

          // 4. Total coverage: existing + inserted should equal all computed dates
          const allCovered = new Set([...existingDates, ...insertedDates]);
          expect(allCovered.size).toBe(allDates.length);
          for (const d of allDates) {
            expect(allCovered.has(d)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
