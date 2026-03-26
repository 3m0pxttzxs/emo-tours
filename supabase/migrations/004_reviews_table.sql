-- EMO Tours CDMX — Migration 004: Reviews table

CREATE TABLE reviews (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    uuid        REFERENCES bookings(id) ON DELETE SET NULL,
  tour_id       uuid        REFERENCES tours(id) ON DELETE SET NULL,
  reviewer_name text        NOT NULL,
  rating        integer     CHECK (rating >= 1 AND rating <= 5),
  comment       text,
  photo_url     text,
  status        text        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected')),
  review_token  text        NOT NULL UNIQUE,
  token_used    boolean     NOT NULL DEFAULT false,
  email_sent    boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- One review per booking (nullable for manual reviews)
CREATE UNIQUE INDEX idx_reviews_booking_id ON reviews(booking_id) WHERE booking_id IS NOT NULL;

-- Token lookups
CREATE INDEX idx_reviews_token ON reviews(review_token);

-- Public queries (approved reviews)
CREATE INDEX idx_reviews_status_created ON reviews(status, created_at DESC);

-- Email eligibility
CREATE INDEX idx_reviews_email_eligible ON reviews(token_used, email_sent);
