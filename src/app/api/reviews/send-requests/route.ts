import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendReviewRequestEmail } from '@/lib/emails';

export async function POST(request: Request) {
  // Simple API key auth for cron/admin calls
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.CRON_API_KEY;
  if (apiKey && authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  // Find eligible reviews: token not used, email not sent, departure date in the past
  const { data: eligible, error } = await supabaseAdmin
    .from('reviews')
    .select(`
      id,
      review_token,
      reviewer_name,
      booking_id,
      bookings!inner(
        customer_email,
        departure_id,
        departures!inner(date)
      )
    `)
    .eq('token_used', false)
    .eq('email_sent', false)
    .not('booking_id', 'is', null);

  if (error) {
    console.error('Failed to query eligible reviews:', error);
    return NextResponse.json({ error: 'Failed to query reviews' }, { status: 500 });
  }

  // Filter to only those with departure date in the past
  const toSend = (eligible ?? []).filter((r) => {
    const bookings = r.bookings as unknown as {
      customer_email: string;
      departure_id: string;
      departures: { date: string };
    };
    return bookings?.departures?.date && bookings.departures.date < today;
  });

  // Also need tour title for each
  let sent = 0;
  const errors: string[] = [];

  for (const review of toSend) {
    const bookings = review.bookings as unknown as {
      customer_email: string;
      departure_id: string;
      departures: { date: string };
    };

    // Get tour title
    const { data: reviewWithTour } = await supabaseAdmin
      .from('reviews')
      .select('tours(title)')
      .eq('id', review.id)
      .single();

    const tourTitle = ((reviewWithTour?.tours as unknown as { title: string } | null))?.title ?? 'your EMO Tour';

    try {
      await sendReviewRequestEmail({
        customerEmail: bookings.customer_email,
        customerName: review.reviewer_name,
        tourTitle,
        departureDate: bookings.departures.date,
        reviewToken: review.review_token,
      });

      await supabaseAdmin
        .from('reviews')
        .update({ email_sent: true, updated_at: new Date().toISOString() })
        .eq('id', review.id);

      sent++;
    } catch (err) {
      console.error(`Failed to send review request for review ${review.id}:`, err);
      errors.push(review.id);
    }
  }

  return NextResponse.json({
    total_eligible: toSend.length,
    sent,
    failed: errors.length,
  });
}
