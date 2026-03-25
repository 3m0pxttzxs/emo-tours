import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select('*, tours(title, meeting_point), departures(date, time)')
      .eq('id', id)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking GET error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ['booking_status'];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select('*, tours(title), departures(date, time)')
      .single();

    if (error || !booking) {
      console.error('Error updating booking:', error);
      return NextResponse.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking PUT error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
