import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { validateCheckoutRequest } from '@/lib/validators';
import { validateAvailability, calculateTotal } from '@/lib/capacity';
import { rateLimit } from '@/lib/rate-limit';
import type { Tour, Departure } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per minute
    const { success: allowed } = rateLimit(request, 5, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    const body = await request.json();

    // 1. Validate request body
    const validation = validateCheckoutRequest(body);
    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const { tour_id, departure_id, guest_count, customer_full_name, customer_email, customer_phone } =
      validation.sanitized as { tour_id: string; departure_id: string; guest_count: number; customer_full_name: string; customer_email: string; customer_phone: string };

    // 2. Fetch tour
    const { data: tour, error: tourError } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('id', tour_id)
      .single();

    if (tourError || !tour) {
      return NextResponse.json({ error: 'Tour no encontrado' }, { status: 404 });
    }

    // 3. Fetch departure
    const { data: departure, error: departureError } = await supabaseAdmin
      .from('departures')
      .select('*')
      .eq('id', departure_id)
      .single();

    if (departureError || !departure) {
      return NextResponse.json({ error: 'Salida no encontrada' }, { status: 404 });
    }

    // 4. Validate availability
    const availability = validateAvailability(departure as Departure, guest_count);
    if (!availability.available) {
      return NextResponse.json({ error: availability.reason }, { status: 409 });
    }

    // 5. Calculate totals
    const typedTour = tour as Tour;
    const subtotal = calculateTotal(typedTour.base_price, guest_count);
    const total = subtotal;

    // 6. Create booking in Supabase
    const cancelToken = crypto.randomBytes(32).toString('hex');

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        tour_id,
        departure_id,
        customer_full_name,
        customer_email,
        customer_phone,
        guest_count,
        subtotal,
        total,
        payment_status: 'pending',
        booking_status: 'pending',
        cancel_token: cancelToken,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json({ error: 'Error al crear la reserva' }, { status: 500 });
    }

    // 7. Create Stripe Checkout Session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: typedTour.title,
              },
              unit_amount: Math.round(typedTour.base_price * 100),
            },
            quantity: guest_count,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tours/${typedTour.slug}`,
        metadata: {
          booking_id: booking.id,
          tour_id,
          departure_id,
        },
        customer_email,
      });
    } catch (stripeError) {
      console.error('Error creating Stripe session:', stripeError);
      return NextResponse.json(
        { error: 'Error al crear la sesión de pago' },
        { status: 502 }
      );
    }

    // 8. Update booking with stripe_session_id
    await supabaseAdmin
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id);

    // 9. Return checkout URL
    return NextResponse.json({ checkout_url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
