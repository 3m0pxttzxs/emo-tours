# Requirements Document

## Introduction

The Admin Departure Calendar provides a visual, month-based calendar interface for managing tour departure dates within the existing admin panel. It replaces the current table-only departures view with an interactive calendar that allows administrators to see departure status at a glance, toggle individual dates on/off, and bulk-toggle date ranges. The calendar integrates with the existing `departures` table and API, and follows the admin design system (dark sidebar, white cards, green accents, Space Grotesk headings, Inter body text).

## Glossary

- **Calendar_View**: The month-grid calendar component that displays departure dates for a selected tour
- **Departure**: A record in the `departures` table representing a scheduled tour date with fields: id, tour_id, date, time, capacity, spots_left, active, sold_out, hidden
- **Tour_Selector**: A dropdown control that filters the calendar to show departures for a specific tour
- **Date_Cell**: A single day cell within the Calendar_View that displays departure status indicators
- **Range_Selection**: A user interaction where the administrator selects a start date and end date to apply a bulk action
- **Status_Indicator**: A visual marker (color, icon, or badge) on a Date_Cell conveying the departure state
- **Admin_Panel**: The existing Next.js admin interface at /admin with dark sidebar layout
- **Bulk_Action_Bar**: A contextual toolbar that appears when a Range_Selection is active, offering batch operations

## Requirements

### Requirement 1: Tour Selection and Calendar Navigation

**User Story:** As an admin, I want to select a tour and navigate between months, so that I can view departure dates for any tour in any time period.

#### Acceptance Criteria

1. THE Calendar_View SHALL display a Tour_Selector dropdown listing all active tours ordered alphabetically by title
2. WHEN the admin selects a tour from the Tour_Selector, THE Calendar_View SHALL display a month grid showing all departures for the selected tour in the current month
3. WHEN the admin clicks the next-month navigation control, THE Calendar_View SHALL display the following calendar month and its departures
4. WHEN the admin clicks the previous-month navigation control, THE Calendar_View SHALL display the preceding calendar month and its departures
5. THE Calendar_View SHALL display the current month name and year as a heading above the calendar grid
6. WHEN no tour is selected, THE Calendar_View SHALL display a prompt instructing the admin to select a tour

### Requirement 2: Departure Status Visualization

**User Story:** As an admin, I want to see the status of each departure date at a glance, so that I can quickly understand which dates are active, sold out, hidden, or have bookings.

#### Acceptance Criteria

1. WHEN a departure exists for a given date and the departure is active and not sold out and not hidden, THE Date_Cell SHALL display a green (#4CBB17) Status_Indicator
2. WHEN a departure exists for a given date and the departure is sold out, THE Date_Cell SHALL display a red Status_Indicator
3. WHEN a departure exists for a given date and the departure is hidden, THE Date_Cell SHALL display a gray Status_Indicator with a strikethrough or muted visual treatment
4. WHEN a departure exists for a given date and the departure has at least one booking (spots_left is less than capacity), THE Date_Cell SHALL display a booking count badge showing the number of booked spots
5. WHEN no departure exists for a given date, THE Date_Cell SHALL display with no Status_Indicator and appear as an empty calendar day
6. THE Calendar_View SHALL display a legend mapping each Status_Indicator color to its meaning

### Requirement 3: Single Date Toggle

**User Story:** As an admin, I want to toggle individual departure dates on or off, so that I can quickly hide or activate specific dates.

#### Acceptance Criteria

1. WHEN the admin clicks on a Date_Cell that has an active departure, THE Calendar_View SHALL set the departure hidden field to true and update the Status_Indicator to the hidden state
2. WHEN the admin clicks on a Date_Cell that has a hidden departure, THE Calendar_View SHALL set the departure hidden field to false and update the Status_Indicator to the active state
3. WHEN the admin toggles a departure, THE Calendar_View SHALL send a PUT request to the `/api/departures/{id}` endpoint with the updated hidden value
4. IF the PUT request fails, THEN THE Calendar_View SHALL revert the Status_Indicator to its previous state and display an error notification
5. WHILE a toggle request is in progress, THE Date_Cell SHALL display a loading indicator and prevent additional toggle actions on the same cell

### Requirement 4: Range Selection and Bulk Toggle

**User Story:** As an admin, I want to select a range of dates and toggle them all at once, so that I can efficiently manage departure availability for entire weeks or periods.

#### Acceptance Criteria

1. WHEN the admin holds Shift and clicks a Date_Cell after having clicked a previous Date_Cell, THE Calendar_View SHALL highlight all Date_Cells between the two selected dates (inclusive) as a Range_Selection
2. WHEN a Range_Selection is active, THE Bulk_Action_Bar SHALL appear displaying the number of selected departures and action buttons for "Hide All" and "Activate All"
3. WHEN the admin clicks "Hide All" on the Bulk_Action_Bar, THE Calendar_View SHALL set the hidden field to true for all departures within the Range_Selection
4. WHEN the admin clicks "Activate All" on the Bulk_Action_Bar, THE Calendar_View SHALL set the hidden field to false for all departures within the Range_Selection
5. WHEN the admin clicks outside the Range_Selection or presses Escape, THE Calendar_View SHALL clear the Range_Selection and hide the Bulk_Action_Bar
6. IF any bulk toggle request fails, THEN THE Calendar_View SHALL revert the affected departures to their previous states and display an error notification indicating how many updates failed
7. THE Calendar_View SHALL send bulk toggle requests in parallel for all departures in the Range_Selection

### Requirement 5: Calendar Layout and Design Consistency

**User Story:** As an admin, I want the calendar to match the existing admin panel design, so that the interface feels cohesive and professional.

#### Acceptance Criteria

1. THE Calendar_View SHALL use Space Grotesk for headings and Inter for body text, consistent with the Admin_Panel design system
2. THE Calendar_View SHALL use white (#FFFFFF) card backgrounds with rounded corners and subtle shadow, consistent with existing admin cards
3. THE Calendar_View SHALL use green (#4CBB17) as the primary accent color for active states, buttons, and interactive elements
4. THE Calendar_View SHALL render as a 7-column grid (Sunday through Saturday) with day-of-week headers
5. THE Calendar_View SHALL be responsive, maintaining usability on viewport widths from 768px to 1920px
6. THE Calendar_View SHALL display within the existing admin layout at the route `/admin/departures`, replacing or augmenting the current table view

### Requirement 6: Departure Detail on Hover/Click

**User Story:** As an admin, I want to see departure details when I interact with a date, so that I can make informed decisions about toggling dates.

#### Acceptance Criteria

1. WHEN the admin hovers over a Date_Cell that has a departure, THE Calendar_View SHALL display a tooltip showing: departure time, capacity, spots left, and current status (active/hidden/sold out)
2. THE tooltip SHALL appear within 200ms of the hover event and disappear when the cursor leaves the Date_Cell
3. WHEN a departure is sold out, THE tooltip SHALL display the sold-out status prominently so the admin is aware before toggling

### Requirement 7: Data Loading and Error Handling

**User Story:** As an admin, I want the calendar to load data reliably and handle errors gracefully, so that I can trust the information displayed.

#### Acceptance Criteria

1. WHEN the Calendar_View loads or the selected tour changes, THE Calendar_View SHALL fetch departures from the `/api/departures?tour_id={id}` endpoint
2. WHILE departure data is loading, THE Calendar_View SHALL display a skeleton loading state within the calendar grid
3. IF the departures fetch request fails, THEN THE Calendar_View SHALL display an error message with a retry button
4. WHEN the admin performs a toggle action, THE Calendar_View SHALL optimistically update the UI before the server response and revert on failure
