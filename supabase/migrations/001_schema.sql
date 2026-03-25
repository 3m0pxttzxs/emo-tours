-- EMO Tours CDMX — Database Schema
-- Migration 001: Create core tables

-- ============================================================
-- Table: tours
-- ============================================================
CREATE TABLE tours (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text        NOT NULL,
  slug              text        NOT NULL UNIQUE,
  short_description text        NOT NULL,
  full_description  text        NOT NULL,
  cover_image       text        NOT NULL,
  gallery_images    text[]      DEFAULT '{}',
  area              text        NOT NULL,
  duration          text        NOT NULL,
  meeting_point     text        NOT NULL,
  language          text        NOT NULL DEFAULT 'EN / ES',
  type              text        NOT NULL CHECK (type IN ('shared', 'private', 'custom')),
  base_price        numeric     NOT NULL DEFAULT 0,
  price_label       text        NOT NULL DEFAULT '',
  capacity_default  integer     NOT NULL DEFAULT 8,
  active            boolean     NOT NULL DEFAULT true,
  published         boolean     NOT NULL DEFAULT false,
  featured          boolean     NOT NULL DEFAULT false,
  highlights        jsonb       NOT NULL DEFAULT '[]',
  included_items    jsonb       NOT NULL DEFAULT '[]',
  faq_items         jsonb       NOT NULL DEFAULT '[]',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: departures
-- ============================================================
CREATE TABLE departures (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id     uuid        NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  date        date        NOT NULL,
  time        time        NOT NULL,
  capacity    integer     NOT NULL,
  spots_left  integer     NOT NULL,
  active      boolean     NOT NULL DEFAULT true,
  sold_out    boolean     NOT NULL DEFAULT false,
  hidden      boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: bookings
-- ============================================================
CREATE TABLE bookings (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id                   uuid        NOT NULL REFERENCES tours(id),
  departure_id              uuid        NOT NULL REFERENCES departures(id),
  customer_full_name        text        NOT NULL,
  customer_email            text        NOT NULL,
  customer_phone            text        NOT NULL,
  guest_count               integer     NOT NULL CHECK (guest_count >= 1),
  subtotal                  numeric     NOT NULL,
  total                     numeric     NOT NULL,
  payment_status            text        NOT NULL DEFAULT 'pending'
                            CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  booking_status            text        NOT NULL DEFAULT 'pending'
                            CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  stripe_session_id         text,
  stripe_payment_intent_id  text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: custom_requests
-- ============================================================
CREATE TABLE custom_requests (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       text        NOT NULL,
  email           text        NOT NULL,
  phone           text        NOT NULL,
  preferred_date  date,
  group_size      integer     NOT NULL CHECK (group_size >= 1),
  interests       text        NOT NULL,
  notes           text        DEFAULT '',
  status          text        NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'contacted', 'closed')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tours_published_active ON tours(published, active);
CREATE INDEX idx_departures_tour_date ON departures(tour_id, date);
CREATE INDEX idx_departures_visibility ON departures(active, hidden, sold_out);
CREATE INDEX idx_bookings_stripe_session ON bookings(stripe_session_id);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_custom_requests_status ON custom_requests(status);
