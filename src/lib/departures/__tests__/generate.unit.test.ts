import { describe, it, expect } from "vitest";
import { computeDepartureDates, DEFAULT_HORIZON_MONTHS } from "../generate";

/**
 * Unit tests for computeDepartureDates
 * Validates: Requirements 1.1, 3.1
 */
describe("computeDepartureDates — unit tests", () => {
  it("weekday=1 (lunes) starting from a Monday includes that Monday", () => {
    // 2024-01-01 is a Monday
    const start = new Date(2024, 0, 1);
    const dates = computeDepartureDates(1, start, 1);

    expect(dates.length).toBeGreaterThan(0);
    expect(dates[0]).toBe("2024-01-01");
    // All dates should be Mondays
    for (const d of dates) {
      expect(new Date(d + "T00:00:00").getDay()).toBe(1);
    }
  });

  it("weekday=0 (domingo) starting from a Wednesday returns the next Sunday", () => {
    // 2024-01-03 is a Wednesday
    const start = new Date(2024, 0, 3);
    const dates = computeDepartureDates(0, start, 1);

    expect(dates.length).toBeGreaterThan(0);
    // The first Sunday after Wed Jan 3 is Jan 7
    expect(dates[0]).toBe("2024-01-07");
    for (const d of dates) {
      expect(new Date(d + "T00:00:00").getDay()).toBe(0);
    }
  });

  it("horizonMonths=0 returns an empty array", () => {
    const start = new Date(2024, 0, 1);
    const dates = computeDepartureDates(1, start, 0);
    expect(dates).toEqual([]);
  });

  it("weekday=-1 returns an empty array", () => {
    const start = new Date(2024, 0, 1);
    const dates = computeDepartureDates(-1, start, 3);
    expect(dates).toEqual([]);
  });

  it("weekday=7 returns an empty array", () => {
    const start = new Date(2024, 0, 1);
    const dates = computeDepartureDates(7, start, 3);
    expect(dates).toEqual([]);
  });

  it("DEFAULT_HORIZON_MONTHS equals 3", () => {
    expect(DEFAULT_HORIZON_MONTHS).toBe(3);
  });
});
