import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const VALID_STATUSES = ['approved', 'rejected'];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: 'Invalid status. Must be "approved" or "rejected".' },
      { status: 400 },
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .update({
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }

  return NextResponse.json(data);
}
