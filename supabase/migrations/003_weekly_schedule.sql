-- EMO Tours CDMX — Migration 003: Add weekly schedule fields to tours
-- Supports the one-guide, one-tour-per-day weekly model

ALTER TABLE tours ADD COLUMN IF NOT EXISTS weekday integer;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS departure_time time;

COMMENT ON COLUMN tours.weekday IS '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday. NULL for request-only tours.';
COMMENT ON COLUMN tours.departure_time IS 'Fixed departure time for weekly scheduled tours. NULL for request-only tours.';
