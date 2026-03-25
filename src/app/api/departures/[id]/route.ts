import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ['date', 'time', 'capacity', 'spots_left', 'active', 'hidden', 'sold_out'];
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

    const { data: departure, error } = await supabaseAdmin
      .from('departures')
      .update(updateData)
      .eq('id', id)
      .select('*, tours(title)')
      .single();

    if (error || !departure) {
      console.error('Error updating departure:', error);
      return NextResponse.json({ error: 'Error al actualizar la salida' }, { status: 500 });
    }

    return NextResponse.json(departure);
  } catch (error) {
    console.error('Departure PUT error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action !== 'duplicate') {
      return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }

    // Fetch the original departure
    const { data: original, error: fetchError } = await supabaseAdmin
      .from('departures')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !original) {
      return NextResponse.json({ error: 'Salida no encontrada' }, { status: 404 });
    }

    // Create duplicate with spots_left = capacity
    const { data: duplicate, error: insertError } = await supabaseAdmin
      .from('departures')
      .insert({
        tour_id: original.tour_id,
        date: original.date,
        time: original.time,
        capacity: original.capacity,
        spots_left: original.capacity,
        active: true,
        sold_out: false,
        hidden: false,
      })
      .select('*, tours(title)')
      .single();

    if (insertError) {
      console.error('Error duplicating departure:', insertError);
      return NextResponse.json({ error: 'Error al duplicar la salida' }, { status: 500 });
    }

    return NextResponse.json(duplicate, { status: 201 });
  } catch (error) {
    console.error('Departure POST error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
