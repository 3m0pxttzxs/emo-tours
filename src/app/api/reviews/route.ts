import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateReviewSubmission } from '@/lib/validators';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const { success: rl } = rateLimit(request, 5, 60_000);
  if (!rl) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validation = validateReviewSubmission(body);
  if (!validation.valid) {
    return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
  }

  const { token, rating, comment, photo_url } = validation.sanitized as {
    token: string;
    rating: number;
    comment: string;
    photo_url?: string;
  };

  // Look up the review by token
  const { data: review, error: fetchError } = await supabaseAdmin
    .from('reviews')
    .select('id, token_used')
    .eq('review_token', token)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ error: 'This review link is not valid.' }, { status: 404 });
  }

  if (review.token_used) {
    return NextResponse.json(
      { error: 'This review link has already been used. Thank you for your feedback!' },
      { status: 410 },
    );
  }

  // Update the review record
  const { error: updateError } = await supabaseAdmin
    .from('reviews')
    .update({
      rating,
      comment,
      photo_url: photo_url || null,
      token_used: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', review.id);

  if (updateError) {
    console.error('Failed to update review:', updateError);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Thank you for your review!' });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get('tour_id');
  const all = searchParams.get('all');

  // Admin mode: return all reviews
  if (all === 'true') {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*, tours(title)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({ reviews: data ?? [] });
  }

  let query = supabaseAdmin
    .from('reviews')
    .select('*, tours(title)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (tourId) {
    query = query.eq('tour_id', tourId);
  }

  const { data: reviews, error } = await query;

  if (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  // Calculate metrics
  const count = reviews?.length ?? 0;
  const avgRating = count > 0
    ? Math.round((reviews!.reduce((sum, r) => sum + (r.rating ?? 0), 0) / count) * 10) / 10
    : 0;

  const formatted = (reviews ?? []).map((r) => ({
    ...r,
    tour_title: ((r.tours as unknown as { title: string } | null))?.title ?? 'EMO Tour',
    tours: undefined,
  }));

  return NextResponse.json({
    reviews: formatted,
    metrics: { average_rating: avgRating, total_count: count },
  });
}
