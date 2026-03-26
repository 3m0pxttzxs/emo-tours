-- Migration 005: Support manual bookings (no departure, no payment)
-- For tours done outside the booking system (e.g. walk-ins, direct contacts)

ALTER TABLE bookings
  ALTER COLUMN departure_id DROP NOT NULL,
  ADD COLUMN source text NOT NULL DEFAULT 'online'
    CHECK (source IN ('online', 'manual'));
