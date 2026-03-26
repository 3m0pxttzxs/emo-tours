import { describe, it, expect } from 'vitest';
import { getStatusIndicator } from '@/components/admin/calendar/calendarUtils';
import type { Departure } from '@/types';

function makeDeparture(overrides: Partial<Departure> = {}): Departure {
  return {
    id: 'dep-1',
    tour_id: 'tour-1',
    date: '2025-06-15',
    time: '10:00',
    capacity: 10,
    spots_left: 10,
    active: true,
    sold_out: false,
    hidden: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('StatusIndicator – status mapping', () => {
  it('returns "active" for an active, non-sold-out, non-hidden departure', () => {
    expect(getStatusIndicator(makeDeparture())).toBe('active');
  });

  it('returns "sold_out" for a sold-out departure', () => {
    expect(getStatusIndicator(makeDeparture({ sold_out: true }))).toBe('sold_out');
  });

  it('returns "hidden" for a hidden departure', () => {
    expect(getStatusIndicator(makeDeparture({ hidden: true }))).toBe('hidden');
  });

  it('returns "none" when departure is null', () => {
    expect(getStatusIndicator(null)).toBe('none');
  });

  it('hidden takes priority over sold_out', () => {
    expect(getStatusIndicator(makeDeparture({ hidden: true, sold_out: true }))).toBe('hidden');
  });

  it('sold_out takes priority over active', () => {
    expect(getStatusIndicator(makeDeparture({ active: true, sold_out: true }))).toBe('sold_out');
  });

  it('returns "none" when departure is not active, not sold_out, not hidden', () => {
    expect(getStatusIndicator(makeDeparture({ active: false }))).toBe('none');
  });
});
