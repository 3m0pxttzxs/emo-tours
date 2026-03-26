import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateReviewToken } from '@/lib/review-tokens';
import { validateManualTokenRequest } from '@/lib/validators';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validation = validateManualTokenRequest(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.errors },
      { status: 400 },
    );
  }

  const { reviewer_name, email, tour_name } = validation.sanitized as {
    reviewer_name: string;
    email: string;
    tour_name: string;
  };

  const token = generateReviewToken();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://emo-tours.vercel.app';

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      booking_id: null,
      tour_id: null,
      reviewer_name,
      review_token: token,
      status: 'pending',
      token_used: false,
      email_sent: false,
    })
    .select('id, review_token')
    .single();

  if (error) {
    console.error('Failed to create manual review token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    token: data.review_token,
    link: `${baseUrl}/review/${data.review_token}`,
    reviewer_name,
    email,
    tour_name,
  });
}
