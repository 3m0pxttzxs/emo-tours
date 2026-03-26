-- Migration 007: Track cancellation and reschedule usage per booking
-- Each booking gets 1 free cancel and 1 free reschedule. Beyond that, contact support.

ALTER TABLE bookings
  ADD COLUMN times_cancelled integer NOT NULL DEFAULT 0,
  ADD COLUMN times_rescheduled integer NOT NULL DEFAULT 0;
