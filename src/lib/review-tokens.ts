import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Generate a cryptographically secure review token.
 * 32 random bytes encoded as base64url (≥43 chars).
 */
export function generateReviewToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Create a review record for a booking (idempotent).
 * If a review already exists for the booking_id, returns the existing one.
 */
export async function createReviewForBooking(
  bookingId: string,
  tourId: string,
  reviewerName: string,
): Promise<{ id: string; review_token: string }> {
  // Check if review already exists for this booking (idempotency)
  const { data: existing } = await supabaseAdmin
    .from('reviews')
    .select('id, review_token')
    .eq('booking_id', bookingId)
    .single();

  if (existing) {
    return { id: existing.id, review_token: existing.review_token };
  }

  const token = generateReviewToken();

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      booking_id: bookingId,
      tour_id: tourId,
      reviewer_name: reviewerName,
      review_token: token,
      status: 'pending',
      token_used: false,
      email_sent: false,
    })
    .select('id, review_token')
    .single();

  if (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }

  return { id: data.id, review_token: data.review_token };
}
