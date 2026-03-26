'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Departure, Tour } from '@/types';
import TourSelector from './calendar/TourSelector';
import CalendarGrid from './calendar/CalendarGrid';
import CalendarLegend from './calendar/CalendarLegend';
import BulkActionBar from './calendar/BulkActionBar';
import { buildDepartureMap, getDateRange } from './calendar/calendarUtils';

interface DepartureCalendarProps {
  tours: Pick<Tour, 'id' | 'title'>[];
}

interface CalendarState {
  selectedTourId: string | null;
  currentMonth: Date;
  departures: Departure[];
  departureMap: Map<string, Departure>;
  loading: boolean;
  error: string | null;
}

interface RangeSelection {
  anchorDate: string | null;
  endDate: string | null;
  selectedDates: string[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function DepartureCalendar({ tours }: DepartureCalendarProps) {
  const [calendar, setCalendar] = useState<CalendarState>({
    selectedTourId: null,
    currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    departures: [],
    departureMap: new Map(),
    loading: false,
    error: null,
  });

  const [range, setRange] = useState<RangeSelection>({
    anchorDate: null,
    endDate: null,
    selectedDates: [],
  });

  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
      toastTimerRef.current = null;
    }, 4000);
  }

  // Clean up toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // --- Fetch departures ---
  const fetchDepartures = useCallback(async (tourId: string) => {
    setCalendar((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`/api/departures?tour_id=${tourId}`);
      if (!res.ok) throw new Error('Failed to fetch departures');
      const data: Departure[] = await res.json();
      setCalendar((prev) => ({
        ...prev,
        departures: data,
        departureMap: buildDepartureMap(data),
        loading: false,
      }));
    } catch {
      setCalendar((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load departures. Please try again.',
      }));
    }
  }, []);

  // Fetch on tour selection or month change
  useEffect(() => {
    if (calendar.selectedTourId) {
      fetchDepartures(calendar.selectedTourId);
    }
  }, [calendar.selectedTourId, calendar.currentMonth, fetchDepartures]);

  // --- Escape key clears range ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        clearRange();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Month navigation ---
  function goToPrevMonth() {
    setCalendar((prev) => {
      const d = prev.currentMonth;
      return { ...prev, currentMonth: new Date(d.getFullYear(), d.getMonth() - 1, 1) };
    });
    clearRange();
  }

  function goToNextMonth() {
    setCalendar((prev) => {
      const d = prev.currentMonth;
      return { ...prev, currentMonth: new Date(d.getFullYear(), d.getMonth() + 1, 1) };
    });
    clearRange();
  }

  // --- Tour selection ---
  function handleTourSelect(tourId: string) {
    setCalendar((prev) => ({
      ...prev,
      selectedTourId: tourId,
      departures: [],
      departureMap: new Map(),
      error: null,
    }));
    clearRange();
  }

  // --- Range selection ---
  function clearRange() {
    setRange({ anchorDate: null, endDate: null, selectedDates: [] });
  }

  function handleRangeSelect(dateStr: string, isShift: boolean) {
    if (isShift && range.anchorDate) {
      const dates = getDateRange(range.anchorDate, dateStr);
      setRange((prev) => ({ ...prev, endDate: dateStr, selectedDates: dates }));
    } else {
      setRange({ anchorDate: dateStr, endDate: null, selectedDates: [dateStr] });
    }
  }

  // --- Single toggle with optimistic update ---
  async function handleToggle(departure: Departure) {
    if (togglingIds.has(departure.id)) return;

    const newHidden = !departure.hidden;

    // Optimistically update local state
    setTogglingIds((prev) => new Set(prev).add(departure.id));
    setCalendar((prev) => {
      const updated = prev.departures.map((d) =>
        d.id === departure.id ? { ...d, hidden: newHidden } : d
      );
      return { ...prev, departures: updated, departureMap: buildDepartureMap(updated) };
    });

    try {
      const res = await fetch(`/api/departures/${departure.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: newHidden }),
      });
      if (!res.ok) throw new Error('Toggle failed');
    } catch {
      // Revert on failure
      setCalendar((prev) => {
        const reverted = prev.departures.map((d) =>
          d.id === departure.id ? { ...d, hidden: departure.hidden } : d
        );
        return {
          ...prev,
          departures: reverted,
          departureMap: buildDepartureMap(reverted),
        };
      });
      showToast('Failed to update departure. Please try again.');
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(departure.id);
        return next;
      });
    }
  }

  // --- Bulk toggle ---
  async function handleBulkToggle(targetHidden: boolean) {
    const departuresInRange = range.selectedDates
      .map((d) => calendar.departureMap.get(d))
      .filter((d): d is Departure => d !== undefined);

    if (departuresInRange.length === 0) {
      clearRange();
      return;
    }

    const ids = departuresInRange.map((d) => d.id);
    setTogglingIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });

    // Optimistically update all
    setCalendar((prev) => {
      const idSet = new Set(ids);
      const updated = prev.departures.map((d) =>
        idSet.has(d.id) ? { ...d, hidden: targetHidden } : d
      );
      return { ...prev, departures: updated, departureMap: buildDepartureMap(updated) };
    });

    // Save original states for revert
    const originals = new Map(departuresInRange.map((d) => [d.id, d.hidden]));

    const results = await Promise.allSettled(
      departuresInRange.map((dep) =>
        fetch(`/api/departures/${dep.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hidden: targetHidden }),
        }).then((res) => {
          if (!res.ok) throw new Error('Failed');
          return dep.id;
        })
      )
    );

    const failedIds = new Set<string>();
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        failedIds.add(departuresInRange[i].id);
      }
    });

    // Revert failed ones
    if (failedIds.size > 0) {
      setCalendar((prev) => {
        const reverted = prev.departures.map((d) => {
          if (failedIds.has(d.id)) {
            return { ...d, hidden: originals.get(d.id) ?? d.hidden };
          }
          return d;
        });
        return {
          ...prev,
          departures: reverted,
          departureMap: buildDepartureMap(reverted),
        };
      });
      showToast(`${failedIds.size} of ${departuresInRange.length} updates failed. Please retry.`);
    }

    setTogglingIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });

    clearRange();
  }

  // --- Render ---
  const monthLabel = `${MONTH_NAMES[calendar.currentMonth.getMonth()]} ${calendar.currentMonth.getFullYear()}`;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm" data-testid="departure-calendar">
      {/* Header row: Tour selector + Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Departure Calendar
          </h2>
          <TourSelector
            tours={tours}
            selectedTourId={calendar.selectedTourId}
            onSelect={handleTourSelect}
          />
        </div>
        <CalendarLegend />
      </div>

      {/* No tour selected prompt */}
      {!calendar.selectedTourId && (
        <div
          data-testid="no-tour-prompt"
          className="flex min-h-[400px] items-center justify-center text-gray-400"
        >
          <p className="text-lg">Select a tour to view its departure calendar.</p>
        </div>
      )}

      {/* Error state */}
      {calendar.error && (
        <div
          data-testid="calendar-error"
          className="mb-4 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{calendar.error}</span>
          <button
            type="button"
            data-testid="retry-button"
            onClick={() => {
              if (calendar.selectedTourId) {
                setCalendar((prev) => ({ ...prev, error: null }));
                fetchDepartures(calendar.selectedTourId);
              }
            }}
            className="ml-auto rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Calendar content */}
      {calendar.selectedTourId && (
        <>
          {/* Month navigation */}
          <div className="mb-4 flex items-center justify-center gap-4">
            <button
              type="button"
              data-testid="prev-month"
              onClick={goToPrevMonth}
              className="rounded-md p-1.5 text-[#4CBB17] hover:bg-green-50 transition-colors"
              aria-label="Previous month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3
              data-testid="month-heading"
              className="font-heading text-lg font-semibold text-gray-900 min-w-[180px] text-center"
            >
              {monthLabel}
            </h3>
            <button
              type="button"
              data-testid="next-month"
              onClick={goToNextMonth}
              className="rounded-md p-1.5 text-[#4CBB17] hover:bg-green-50 transition-colors"
              aria-label="Next month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Bulk action bar */}
          {range.selectedDates.length > 0 && (
            <div className="mb-4">
              <BulkActionBar
                selectedCount={range.selectedDates.filter((d) => calendar.departureMap.has(d)).length}
                onHideAll={() => handleBulkToggle(true)}
                onActivateAll={() => handleBulkToggle(false)}
                onClear={clearRange}
              />
            </div>
          )}

          {/* Calendar grid */}
          <CalendarGrid
            currentMonth={calendar.currentMonth}
            departureMap={calendar.departureMap}
            selectedDates={range.selectedDates}
            anchorDate={range.anchorDate}
            togglingIds={togglingIds}
            loading={calendar.loading}
            onToggle={handleToggle}
            onRangeSelect={handleRangeSelect}
          />
        </>
      )}

      {/* Toast notification for toggle failures */}
      {toast.visible && (
        <div
          data-testid="toast-notification"
          role="alert"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg"
        >
          <svg className="h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
            className="ml-2 rounded-md p-1 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
