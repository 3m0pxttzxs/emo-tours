-- Migration 006: Add cancel_token to bookings for self-service cancellation

ALTER TABLE bookings
  ADD COLUMN cancel_token text UNIQUE;

CREATE INDEX idx_bookings_cancel_token ON bookings(cancel_token);

-- Atomic spot restoration for cancellations
CREATE OR REPLACE FUNCTION increment_spots(dep_id uuid, amount integer)
RETURNS integer AS $
DECLARE
  new_spots integer;
BEGIN
  UPDATE departures
  SET spots_left = spots_left + amount,
      sold_out = false,
      updated_at = now()
  WHERE id = dep_id
  RETURNING spots_left INTO new_spots;

  RETURN new_spots;
END;
$ LANGUAGE plpgsql;
