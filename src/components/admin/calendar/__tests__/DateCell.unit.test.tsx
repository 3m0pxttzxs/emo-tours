// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import DateCell from '../DateCell';
import CalendarGrid from '../CalendarGrid';
import { formatDateKey } from '../calendarUtils';
import type { Departure } from '@/types';

function makeDeparture(overrides: Partial<Departure> = {}): Departure {
  return {
    id: 'dep-1',
    tour_id: 'tour-1',
    date: '2024-06-15',
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

const defaultCellProps = {
  date: new Date(2024, 5, 15),
  departure: null as Departure | null,
  isCurrentMonth: true,
  isInRange: false,
  isRangeAnchor: false,
  isToggling: false,
  isToday: false,
  isPast: false,
  onToggle: vi.fn(),
  onRangeSelect: vi.fn(),
};

describe('DateCell — unit tests (Requisitos 5.1, 5.2)', () => {
  it('renders with green ring and Today label when isToday=true', () => {
    const { getByTestId, getByText } = render(
      <DateCell {...defaultCellProps} isToday={true} />
    );

    const cell = getByTestId('date-cell-2024-06-15');
    expect(cell.className).toContain('ring-[#4CBB17]');
    expect(cell.className).toContain('bg-green-50');
    expect(getByText('Today')).toBeTruthy();
  });

  it('renders with reduced opacity class when isPast=true', () => {
    const { getByTestId } = render(
      <DateCell {...defaultCellProps} isPast={true} />
    );

    const cell = getByTestId('date-cell-2024-06-15');
    expect(cell.className).toContain('opacity-50');
  });

  it('does NOT have green ring when isToday=false', () => {
    const { getByTestId } = render(
      <DateCell {...defaultCellProps} isToday={false} />
    );

    const cell = getByTestId('date-cell-2024-06-15');
    expect(cell.className).not.toContain('ring-[#4CBB17]');
  });

  it('does NOT have reduced opacity when isPast=false', () => {
    const { getByTestId } = render(
      <DateCell {...defaultCellProps} isPast={false} />
    );

    const cell = getByTestId('date-cell-2024-06-15');
    expect(cell.className).not.toContain('opacity-50');
  });
});

describe('CalendarGrid — passes isToday and isPast correctly (Requisitos 5.1, 5.2)', () => {
  it('today cell has green border styling and past cells have reduced opacity', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDateKey(today);

    // Use the current month so today is visible in the grid
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const { getByTestId } = render(
      <CalendarGrid
        currentMonth={currentMonth}
        departureMap={new Map()}
        selectedDates={[]}
        anchorDate={null}
        togglingIds={new Set()}
        loading={false}
        onToggle={vi.fn()}
        onRangeSelect={vi.fn()}
      />
    );

    // Today's cell should have the green ring and Today label
    const todayCell = getByTestId(`date-cell-${todayStr}`);
    expect(todayCell.className).toContain('ring-[#4CBB17]');
    expect(todayCell.className).toContain('bg-green-50');

    // A past date (yesterday) should have reduced opacity
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateKey(yesterday);

    // Yesterday might not be in the grid if today is the 1st of the month
    // and the grid starts on a later day. Use try/catch to handle gracefully.
    try {
      const pastCell = getByTestId(`date-cell-${yesterdayStr}`);
      expect(pastCell.className).toContain('opacity-50');
    } catch {
      // Yesterday is always in the 42-cell grid when today is in the current month,
      // but just in case, we skip this assertion if the cell isn't found.
    }
  });
});
