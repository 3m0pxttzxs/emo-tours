# Implementation Plan: Admin Departure Calendar

## Overview

Replace the current table-based `DeparturesManager` at `/admin/departures` with an interactive month-grid calendar. Implementation proceeds bottom-up: pure utility functions first, then atomic UI components, then the main calendar component with state management, and finally wiring into the existing page route.

## Tasks

- [x] 1. Create calendar utility functions
  - [x] 1.1 Create `src/components/admin/calendar/calendarUtils.ts` with pure utility functions
    - Implement `getCalendarDays(month: Date): Date[]` — returns 42 dates (6 rows × 7 cols) starting from Sunday before the first of the month
    - Implement `formatDateKey(date: Date): string` — formats a Date to `YYYY-MM-DD`
    - Implement `getDateRange(start: string, end: string): string[]` — returns all dates between two date strings inclusive, in chronological order
    - Implement `buildDepartureMap(departures: Departure[]): Map<string, Departure>` — indexes departures by date for O(1) lookup
    - Implement `getStatusIndicator(departure: Departure | null): 'active' | 'sold_out' | 'hidden' | 'none'` — pure function mapping departure state to status
    - Implement `getBookingCount(departure: Departure): number | null` — returns `capacity - spots_left` if > 0, else null
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 5.4_

  - [x] 1.2 Write property tests for calendar utility functions in `src/components/admin/calendar/__tests__/calendarUtils.test.ts`
    - **Property 10: Date range computation** — generate random date pairs, verify range length = |daysBetween| + 1, chronological order, inclusive
    - **Validates: Requirements 4.1**

  - [x] 1.3 Write property tests for calendar grid structure
    - **Property 13: Calendar grid structure** — generate random months, verify 42 days, Sunday start, Saturday end, all month days present
    - **Validates: Requirements 5.4**

  - [x] 1.4 Write property tests for status indicator and booking count
    - **Property 5: Status indicator mapping** — generate random (active, sold_out, hidden) tuples, verify correct indicator
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5**
    - **Property 6: Booking count computation** — generate random capacity/spots_left pairs, verify badge value
    - **Validates: Requirements 2.4**

  - [x] 1.5 Write property tests for month navigation and heading
    - **Property 2: Month navigation round trip** — generate random months and step counts, verify round trip
    - **Validates: Requirements 1.3, 1.4**
    - **Property 3: Month heading matches displayed month** — generate random Date values, verify heading text
    - **Validates: Requirements 1.5**

- [x] 2. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Build atomic calendar UI components
  - [x] 3.1 Create `src/components/admin/calendar/StatusIndicator.tsx`
    - Render a colored dot: green (#4CBB17) for active, red for sold_out, gray/muted for hidden, nothing for none
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 3.2 Create `src/components/admin/calendar/BookingBadge.tsx`
    - Render a small badge with the booked-spot count when > 0
    - _Requirements: 2.4_

  - [x] 3.3 Create `src/components/admin/calendar/DepartureTooltip.tsx`
    - Show departure time, capacity, spots left, and status on hover
    - Appear within 200ms, disappear on mouse leave
    - Display sold-out status prominently
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 3.4 Create `src/components/admin/calendar/CalendarLegend.tsx`
    - Render a legend mapping each status color to its meaning (active/green, sold out/red, hidden/gray)
    - _Requirements: 2.6_

  - [x] 3.5 Create `src/components/admin/calendar/TourSelector.tsx`
    - Dropdown listing all tours ordered alphabetically by title
    - Show prompt text when no tour is selected
    - _Requirements: 1.1, 1.6_

  - [x] 3.6 Write property test for tour list ordering
    - **Property 1: Tour list alphabetical ordering** — generate random tour arrays, verify sorted output
    - **Validates: Requirements 1.1**

  - [x] 3.7 Create `src/components/admin/calendar/BulkActionBar.tsx`
    - Contextual bar showing selected count, "Hide All" and "Activate All" buttons, and a clear/cancel button
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [x] 4. Build DateCell and CalendarGrid components
  - [x] 4.1 Create `src/components/admin/calendar/DateCell.tsx`
    - Render a single day cell composing StatusIndicator, BookingBadge, and DepartureTooltip
    - Handle click for single toggle (no Shift) and range select (Shift+click)
    - Show loading spinner and disable click while toggling
    - Visually distinguish cells in range selection, cells outside current month
    - _Requirements: 2.1–2.5, 3.1, 3.2, 3.5, 4.1, 6.1_

  - [x] 4.2 Create `src/components/admin/calendar/CalendarGrid.tsx`
    - Render 7-column CSS Grid with day-of-week headers (Sun–Sat)
    - Use `getCalendarDays` to produce 42 cells for the displayed month
    - Pass departure data from the map to each DateCell
    - Render skeleton loading state (42 placeholder cells with pulse animation) while loading
    - _Requirements: 5.4, 7.2_

- [x] 5. Build main DepartureCalendar component with state management
  - [x] 5.1 Create `src/components/admin/DepartureCalendar.tsx`
    - Manage CalendarState: selectedTourId, currentMonth, departures, departureMap, loading, error
    - Manage RangeSelection state: anchorDate, endDate, selectedDates
    - Fetch departures from `GET /api/departures?tour_id={id}` on tour selection and month change
    - Implement month navigation (prev/next) with month name + year heading
    - Compose TourSelector, CalendarGrid, CalendarLegend, BulkActionBar
    - _Requirements: 1.1–1.6, 5.1–5.6, 7.1_

  - [x] 5.2 Implement single-date toggle with optimistic update
    - On click: optimistically flip `hidden` in local state, send `PUT /api/departures/{id}` with `{ hidden: !current }`
    - On success: keep new state; on failure: revert and show error notification
    - Prevent re-toggle while request is in flight
    - _Requirements: 3.1–3.5, 7.4_

  - [x] 5.3 Write property tests for toggle logic
    - **Property 7: Toggle flips hidden field** — generate random departures, verify hidden negation with all other fields unchanged
    - **Validates: Requirements 3.1, 3.2**
    - **Property 8: Optimistic revert on failure** — generate random departures, simulate failure, verify state restored
    - **Validates: Requirements 3.4, 7.4**
    - **Property 9: Loading state prevents re-toggle** — generate random departures in toggling state, verify no-op
    - **Validates: Requirements 3.5**

  - [x] 5.4 Implement range selection and bulk toggle
    - Click sets anchorDate; Shift+click sets endDate and computes selectedDates via `getDateRange`
    - Show BulkActionBar with count and actions
    - "Hide All" / "Activate All" fire parallel `PUT` requests via `Promise.allSettled`
    - On partial failure: revert failed departures, keep successful ones, show error with count
    - Escape or click outside clears selection
    - _Requirements: 4.1–4.7_

  - [x] 5.5 Write property tests for bulk toggle logic
    - **Property 11: Bulk toggle sets target value** — generate random departure sets and target boolean, verify all match target after success
    - **Validates: Requirements 4.3, 4.4**
    - **Property 12: Partial bulk failure revert** — generate random departure sets with random failure indices, verify correct revert/keep
    - **Validates: Requirements 4.6**

  - [x] 5.6 Write property test for departure filtering
    - **Property 4: Departure filtering by tour and month** — generate random departures across tours/months, verify filter correctness
    - **Validates: Requirements 1.2**

  - [x] 5.7 Write property test for tooltip data completeness
    - **Property 14: Tooltip contains all departure details** — generate random departures, verify tooltip data includes time, capacity, spots_left, and status
    - **Validates: Requirements 6.1, 6.3**

- [x] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement error handling and loading states
  - [x] 7.1 Add fetch error state with retry button
    - If `GET /api/departures` fails, display inline error message within the calendar card with a "Retry" button
    - _Requirements: 7.2, 7.3_

  - [x] 7.2 Add error notification (toast) for toggle failures
    - Single toggle failure: show toast with error message
    - Bulk toggle failure: show toast with "X of Y updates failed" message
    - _Requirements: 3.4, 4.6_

- [x] 8. Wire into existing admin page
  - [x] 8.1 Update `src/app/admin/departures/page.tsx`
    - Replace `DeparturesManager` import with `DepartureCalendar`
    - Pass `tours` prop (keep existing `getTours()` server fetch)
    - Remove the `getDepartures()` server fetch (calendar fetches client-side per tour)
    - _Requirements: 5.6_

  - [x] 8.2 Apply design system styling
    - Ensure Space Grotesk for headings, Inter for body text
    - White card backgrounds with rounded corners and subtle shadow
    - Green (#4CBB17) accent for active states and buttons
    - Responsive layout from 768px to 1920px
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- No backend changes needed — all work is frontend using existing API endpoints
