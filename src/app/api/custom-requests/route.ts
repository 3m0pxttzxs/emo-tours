import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateCustomRequest } from '@/lib/validators';
import { sendAdminNotificationEmail } from '@/lib/emails';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate request body
    const validation = validateCustomRequest(body);
    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const { full_name, email, phone, preferred_date, group_size, interests, notes } = body;

    // 2. Create custom_request in Supabase with status='new'
    const { data: customRequest, error: insertError } = await supabaseAdmin
      .from('custom_requests')
      .insert({
        full_name,
        email,
        phone,
        preferred_date: preferred_date || null,
        group_size,
        interests,
        notes: notes || '',
        status: 'new',
      })
      .select()
      .single();

    if (insertError || !customRequest) {
      console.error('Error creating custom request:', insertError);
      return NextResponse.json(
        { error: 'Error al crear la solicitud' },
        { status: 500 }
      );
    }

    // 3. Send admin notification email and return success
    await sendAdminNotificationEmail({
      customerName: full_name,
      email,
      phone,
      preferredDate: preferred_date || null,
      groupSize: group_size,
      interests,
      notes: notes || '',
    });

    return NextResponse.json({ success: true, id: customRequest.id });
  } catch (error) {
    console.error('Custom request error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
