import { describe, it, expect } from 'vitest';
import { validateAvailability, calculateTotal } from './capacity';
import type { Departure } from '@/types';

function makeDeparture(overrides: Partial<Departure> = {}): Departure {
  return {
    id: 'dep-1',
    tour_id: 'tour-1',
    date: '2025-08-01',
    time: '10:00',
    capacity: 8,
    spots_left: 5,
    active: true,
    sold_out: false,
    hidden: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('validateAvailability', () => {
  it('returns available when guest count fits within spots_left', () => {
    const result = validateAvailability(makeDeparture({ spots_left: 5 }), 3);
    expect(result).toEqual({ available: true });
  });

  it('returns available when guest count equals spots_left exactly', () => {
    const result = validateAvailability(makeDeparture({ spots_left: 4 }), 4);
    expect(result).toEqual({ available: true });
  });

  it('returns unavailable when guest count exceeds spots_left', () => {
    const result = validateAvailability(makeDeparture({ spots_left: 2 }), 3);
    expect(result.available).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('returns unavailable when departure is sold out', () => {
    const result = validateAvailability(
      makeDeparture({ sold_out: true, spots_left: 0 }),
      1
    );
    expect(result.available).toBe(false);
    expect(result.reason).toContain('agotada');
  });

  it('returns unavailable when departure is inactive', () => {
    const result = validateAvailability(
      makeDeparture({ active: false }),
      1
    );
    expect(result.available).toBe(false);
    expect(result.reason).toContain('activa');
  });

  it('returns unavailable when departure is hidden', () => {
    const result = validateAvailability(
      makeDeparture({ hidden: true }),
      1
    );
    expect(result.available).toBe(false);
    expect(result.reason).toContain('disponible');
  });

  it('checks active before sold_out', () => {
    const result = validateAvailability(
      makeDeparture({ active: false, sold_out: true }),
      1
    );
    expect(result.available).toBe(false);
    expect(result.reason).toContain('activa');
  });

  it('checks hidden before sold_out', () => {
    const result = validateAvailability(
      makeDeparture({ hidden: true, sold_out: true }),
      1
    );
    expect(result.available).toBe(false);
    expect(result.reason).toContain('disponible');
  });

  it('returns unavailable for guest count of 1 when spots_left is 0', () => {
    const result = validateAvailability(makeDeparture({ spots_left: 0 }), 1);
    expect(result.available).toBe(false);
  });
});

describe('calculateTotal', () => {
  it('multiplies base price by guest count', () => {
    expect(calculateTotal(500, 3)).toBe(1500);
  });

  it('returns 0 when base price is 0', () => {
    expect(calculateTotal(0, 5)).toBe(0);
  });

  it('returns base price for single guest', () => {
    expect(calculateTotal(750, 1)).toBe(750);
  });

  it('handles decimal prices', () => {
    expect(calculateTotal(99.99, 2)).toBeCloseTo(199.98);
  });
});
