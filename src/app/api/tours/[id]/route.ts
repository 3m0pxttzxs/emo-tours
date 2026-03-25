import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: tour, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !tour) {
      return NextResponse.json({ error: 'Tour no encontrado' }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Tour GET error:', error);
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

    // Remove fields that shouldn't be updated directly
    const { id: _id, created_at: _ca, ...updateData } = body;

    const { data: tour, error } = await supabaseAdmin
      .from('tours')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !tour) {
      console.error('Error updating tour:', error);
      return NextResponse.json({ error: 'Error al actualizar el tour' }, { status: 500 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Tour PUT error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete: set active=false
    const { data: tour, error } = await supabaseAdmin
      .from('tours')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !tour) {
      return NextResponse.json({ error: 'Tour no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tour });
  } catch (error) {
    console.error('Tour DELETE error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
