import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedStatuses = ['new', 'contacted', 'closed'];
    if (!body.status || !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Status inválido. Valores permitidos: new, contacted, closed' },
        { status: 400 }
      );
    }

    const { data: customRequest, error } = await supabaseAdmin
      .from('custom_requests')
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !customRequest) {
      console.error('Error updating custom request:', error);
      return NextResponse.json(
        { error: 'Error al actualizar la solicitud' },
        { status: 500 }
      );
    }

    return NextResponse.json(customRequest);
  } catch (error) {
    console.error('Custom request PUT error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
