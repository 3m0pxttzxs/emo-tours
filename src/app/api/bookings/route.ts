import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const paymentStatus = request.nextUrl.searchParams.get('payment_status');
    const date = request.nextUrl.searchParams.get('date');

    let query = supabaseAdmin
      .from('bookings')
      .select('*, tours(title), departures(date, time)')
      .order('created_at', { ascending: false });

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }

    if (date) {
      // Filter by departure date: need to get departure IDs for that date first
      const { data: deps } = await supabaseAdmin
        .from('departures')
        .select('id')
        .eq('date', date);

      const depIds = deps?.map((d) => d.id) ?? [];
      if (depIds.length === 0) {
        return NextResponse.json([]);
      }
      query = query.in('departure_id', depIds);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
