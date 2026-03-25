-- EMO Tours CDMX — Migration 002: Atomic spot reduction RPC
-- Used by the webhook handler to atomically reduce spots_left after payment confirmation

CREATE OR REPLACE FUNCTION reduce_spots(p_departure_id uuid, p_guest_count integer)
RETURNS integer AS $$
DECLARE
  new_spots integer;
BEGIN
  UPDATE departures
  SET spots_left = spots_left - p_guest_count,
      sold_out = CASE WHEN spots_left - p_guest_count = 0 THEN true ELSE false END,
      updated_at = now()
  WHERE id = p_departure_id
    AND spots_left >= p_guest_count
  RETURNING spots_left INTO new_spots;

  RETURN new_spots;  -- Returns NULL if no row was updated
END;
$$ LANGUAGE plpgsql;
