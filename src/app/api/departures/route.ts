import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const tourId = request.nextUrl.searchParams.get('tour_id');

    let query = supabaseAdmin
      .from('departures')
      .select('*, tours(title)')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (tourId) {
      query = query.eq('tour_id', tourId);
    }

    const { data: departures, error } = await query;

    if (error) {
      console.error('Error fetching departures:', error);
      return NextResponse.json({ error: 'Error al obtener salidas' }, { status: 500 });
    }

    return NextResponse.json(departures);
  } catch (error) {
    console.error('Departures GET error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['tour_id', 'date', 'time', 'capacity'];
    const errors: Record<string, string> = {};
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        errors[field] = `${field} es requerido`;
      }
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const capacity = Number(body.capacity);

    const { data: departure, error } = await supabaseAdmin
      .from('departures')
      .insert({
        tour_id: body.tour_id,
        date: body.date,
        time: body.time,
        capacity,
        spots_left: capacity,
        active: body.active ?? true,
        sold_out: false,
        hidden: body.hidden ?? false,
      })
      .select('*, tours(title)')
      .single();

    if (error) {
      console.error('Error creating departure:', error);
      return NextResponse.json({ error: 'Error al crear la salida' }, { status: 500 });
    }

    return NextResponse.json(departure, { status: 201 });
  } catch (error) {
    console.error('Departures POST error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
