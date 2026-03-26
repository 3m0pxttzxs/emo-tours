import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateDeparturesForTour } from '@/lib/departures/generate';

export async function GET() {
  try {
    const { data: tours, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tours:', error);
      return NextResponse.json({ error: 'Error al obtener tours' }, { status: 500 });
    }

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Tours GET error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['title', 'short_description', 'type', 'base_price'];
    const errors: Record<string, string> = {};
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        errors[field] = `${field} es requerido`;
      }
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const slug = body.slug || generateSlug(body.title);

    const { data: tour, error } = await supabaseAdmin
      .from('tours')
      .insert({
        title: body.title,
        slug,
        short_description: body.short_description,
        full_description: body.full_description || '',
        cover_image: body.cover_image || '',
        gallery_images: body.gallery_images || [],
        area: body.area || '',
        duration: body.duration || '',
        meeting_point: body.meeting_point || '',
        language: body.language || 'Español',
        type: body.type,
        base_price: Number(body.base_price),
        price_label: body.price_label || 'por persona',
        capacity_default: Number(body.capacity_default) || 12,
        active: body.active ?? true,
        published: body.published ?? false,
        featured: body.featured ?? false,
        highlights: body.highlights || [],
        included_items: body.included_items || [],
        faq_items: body.faq_items || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tour:', error);
      return NextResponse.json({ error: 'Error al crear el tour' }, { status: 500 });
    }

    // Auto-generate departures if weekday and departure_time are non-null
    const weekday = body.weekday ?? null;
    const departureTime = body.departure_time ?? null;

    if (weekday !== null && departureTime !== null) {
      try {
        const { created } = await generateDeparturesForTour(
          tour.id,
          weekday,
          departureTime,
          Number(body.capacity_default) || 12
        );
        return NextResponse.json({ ...tour, departures_created: created }, { status: 201 });
      } catch (genError) {
        console.error('Error generating departures:', genError);
        return NextResponse.json(
          { ...tour, warning: 'Tour creado, pero falló la generación automática de departures' },
          { status: 201 }
        );
      }
    }

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Tours POST error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
