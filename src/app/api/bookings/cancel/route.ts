import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { token } = body;
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing cancel token' }, { status: 400 });
  }

  // Find booking by cancel_token
  const { data: booking, error: fetchError } = await supabaseAdmin
    .from('bookings')
    .select('id, booking_status, departure_id, guest_count, times_cancelled')
    .eq('cancel_token', token)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Invalid or expired cancellation link' }, { status: 404 });
  }

  if (booking.booking_status === 'cancelled') {
    return NextResponse.json({ error: 'This booking has already been cancelled' }, { status: 410 });
  }

  if (booking.times_cancelled >= 1) {
    return NextResponse.json({
      error: 'You have already used your free cancellation. Please contact support for assistance.',
    }, { status: 403 });
  }

  // Cancel the booking
  const { error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({
      booking_status: 'cancelled',
      times_cancelled: booking.times_cancelled + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', booking.id);

  if (updateError) {
    console.error('Failed to cancel booking:', updateError);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }

  // Restore spots on the departure
  if (booking.departure_id) {
    await supabaseAdmin.rpc('increment_spots', {
      dep_id: booking.departure_id,
      amount: booking.guest_count,
    });
  }

  return NextResponse.json({ success: true });
}
