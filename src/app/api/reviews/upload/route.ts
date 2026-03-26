import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  const { success: rl } = rateLimit(request, 5, 60_000);
  if (!rl) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const token = formData.get('token') as string | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, and WebP images are accepted.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File must be 5 MB or less.' },
      { status: 400 },
    );
  }

  // Look up review by token to get review_id for path
  let reviewId = 'unknown';
  if (token) {
    const { data: review } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('review_token', token)
      .single();
    if (review) reviewId = review.id;
  }

  const ext = EXT_MAP[file.type] || 'jpg';
  const timestamp = Date.now();
  const path = `${reviewId}/${timestamp}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from('review-photos')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('Failed to upload photo:', uploadError);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }

  const { data: publicUrl } = supabaseAdmin.storage
    .from('review-photos')
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrl.publicUrl });
}
