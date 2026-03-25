import type { SupabaseClient } from '@supabase/supabase-js';
import type { Departure } from '@/types';

export function validateAvailability(
  departure: Departure,
  guestCount: number
): { available: boolean; reason?: string } {
  if (!departure.active) {
    return { available: false, reason: 'La salida no está activa' };
  }

  if (departure.hidden) {
    return { available: false, reason: 'La salida no está disponible' };
  }

  if (departure.sold_out) {
    return { available: false, reason: 'La salida está agotada' };
  }

  if (guestCount > departure.spots_left) {
    return {
      available: false,
      reason: `Solo quedan ${departure.spots_left} lugares disponibles`,
    };
  }

  return { available: true };
}

export async function reduceSpots(
  supabase: SupabaseClient,
  departureId: string,
  guestCount: number
): Promise<{ success: boolean; newSpotsLeft?: number; error?: string }> {
  const { data, error } = await supabase.rpc('reduce_spots', {
    p_departure_id: departureId,
    p_guest_count: guestCount,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // data is null when the UPDATE matched no rows (race condition / insufficient capacity)
  if (data === null) {
    return {
      success: false,
      error: 'No hay suficiente disponibilidad para esta salida',
    };
  }

  return { success: true, newSpotsLeft: data as number };
}

export function calculateTotal(basePrice: number, guestCount: number): number {
  return basePrice * guestCount;
}
