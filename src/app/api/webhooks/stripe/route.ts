import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { reduceSpots } from '@/lib/capacity';
import { sendBookingConfirmationEmail } from '@/lib/emails';
import { createCalendarEvent } from '@/lib/google-calendar';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handlePaymentFailed(session);
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt
        break;
    }
  } catch (err) {
    console.error(`Error handling event ${event.type}:`, err);
    // Return 200 to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id;

  if (!bookingId) {
    console.error('Webhook: Missing booking_id in session metadata', { sessionId: session.id });
    return;
  }

  // Fetch the booking
  const { data: booking, error: fetchError } = await supabaseAdmin
    .from('bookings')
    .select('id, payment_status, guest_count, departure_id, tour_id')
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking) {
    console.error('Webhook: Booking not found', { bookingId, error: fetchError });
    return;
  }

  // Idempotency check: if already paid, skip
  if (booking.payment_status === 'paid') {
    return;
  }

  // Update booking to paid/confirmed
  const { error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({
      payment_status: 'paid',
      booking_status: 'confirmed',
      stripe_payment_intent_id: session.payment_intent as string | null,
    })
    .eq('id', bookingId);

  if (updateError) {
    console.error('Webhook: Failed to update booking', { bookingId, error: updateError });
    return;
  }

  // Atomically reduce spots_left
  const result = await reduceSpots(supabaseAdmin, booking.departure_id, booking.guest_count);

  if (!result.success) {
    console.error('Webhook: reduceSpots failed (race condition or insufficient capacity)', {
      bookingId,
      departureId: booking.departure_id,
      guestCount: booking.guest_count,
      error: result.error,
    });
    // Booking stays confirmed — admin can resolve manually
  }

  // Send booking confirmation email
  const { data: tour } = await supabaseAdmin
    .from('tours')
    .select('title, meeting_point')
    .eq('id', booking.tour_id)
    .single();

  const { data: departure } = await supabaseAdmin
    .from('departures')
    .select('date, time')
    .eq('id', booking.departure_id)
    .single();

  const { data: fullBooking } = await supabaseAdmin
    .from('bookings')
    .select('customer_full_name, customer_email, guest_count, total')
    .eq('id', bookingId)
    .single();

  if (tour && departure && fullBooking) {
    await sendBookingConfirmationEmail({
      customerEmail: fullBooking.customer_email,
      customerName: fullBooking.customer_full_name,
      tourTitle: tour.title,
      date: departure.date,
      time: departure.time,
      guestCount: fullBooking.guest_count,
      total: fullBooking.total,
      meetingPoint: tour.meeting_point,
    });

    // Create Google Calendar event (optional — controlled by feature flag)
    await createCalendarEvent({
      tourTitle: tour.title,
      customerName: fullBooking.customer_full_name,
      date: departure.date,
      time: departure.time,
      guestCount: fullBooking.guest_count,
      meetingPoint: tour.meeting_point,
    });
  }
}

async function handlePaymentFailed(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id;

  if (!bookingId) {
    console.error('Webhook: Missing booking_id in session metadata (failed/expired)', { sessionId: session.id });
    return;
  }

  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ payment_status: 'failed' })
    .eq('id', bookingId);

  if (error) {
    console.error('Webhook: Failed to update booking to failed status', { bookingId, error });
  }
}
