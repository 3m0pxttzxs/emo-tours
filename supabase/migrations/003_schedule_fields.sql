-- Migration 003: Add schedule fields for weekly operating model
ALTER TABLE tours ADD COLUMN schedule_day text;
ALTER TABLE tours ADD COLUMN schedule_time text;
