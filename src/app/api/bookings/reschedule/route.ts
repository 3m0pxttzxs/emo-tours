import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  let body: { token?: string; new_departure_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { token, new_departure_id } = body;
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing cancel token' }, { status: 400 });
  }
  if (!new_departure_id || typeof new_departure_id !== 'string') {
    return NextResponse.json({ error: 'Missing new departure' }, { status: 400 });
  }

  // Find booking
  const { data: booking, error: fetchError } = await supabaseAdmin
    .from('bookings')
    .select('id, booking_status, departure_id, guest_count, tour_id, times_rescheduled')
    .eq('cancel_token', token)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });
  }

  if (booking.booking_status === 'cancelled') {
    return NextResponse.json({ error: 'This booking has been cancelled' }, { status: 410 });
  }

  if (booking.times_rescheduled >= 1) {
    return NextResponse.json({
      error: 'You have already rescheduled once. Please contact support for further changes.',
    }, { status: 403 });
  }

  // Validate new departure exists, belongs to same tour, has capacity
  const { data: newDep, error: depError } = await supabaseAdmin
    .from('departures')
    .select('id, tour_id, spots_left, sold_out, active, hidden')
    .eq('id', new_departure_id)
    .single();

  if (depError || !newDep) {
    return NextResponse.json({ error: 'Departure not found' }, { status: 404 });
  }

  if (newDep.tour_id !== booking.tour_id) {
    return NextResponse.json({ error: 'Departure does not match this tour' }, { status: 400 });
  }

  if (!newDep.active || newDep.hidden || newDep.sold_out || newDep.spots_left < booking.guest_count) {
    return NextResponse.json({ error: 'Not enough spots on the selected date' }, { status: 409 });
  }

  // Restore spots on old departure
  if (booking.departure_id) {
    await supabaseAdmin.rpc('increment_spots', {
      dep_id: booking.departure_id,
      amount: booking.guest_count,
    });
  }

  // Reduce spots on new departure
  const { error: reduceError } = await supabaseAdmin.rpc('reduce_spots', {
    p_departure_id: new_departure_id,
    p_guest_count: booking.guest_count,
  });

  if (reduceError) {
    // Rollback: restore old departure spots
    if (booking.departure_id) {
      await supabaseAdmin.rpc('increment_spots', {
        dep_id: new_departure_id,
        amount: booking.guest_count,
      });
    }
    return NextResponse.json({ error: 'Failed to reserve new date' }, { status: 500 });
  }

  // Update booking
  const { error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({
      departure_id: new_departure_id,
      times_rescheduled: booking.times_rescheduled + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', booking.id);

  if (updateError) {
    console.error('Failed to reschedule booking:', updateError);
    return NextResponse.json({ error: 'Failed to reschedule' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
