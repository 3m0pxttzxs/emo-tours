/** Horizonte por defecto en meses */
export const DEFAULT_HORIZON_MONTHS = 3;

/**
 * Formats a Date to a YYYY-MM-DD string (manual formatting, no toISOString).
 */
function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calcula las fechas futuras que coinciden con el weekday dado,
 * desde `startDate` hasta `startDate + horizonMonths` meses.
 * Función PURA: no accede a DB.
 *
 * @param weekday - 0=Dom...6=Sáb
 * @param startDate - fecha de inicio
 * @param horizonMonths - meses hacia adelante
 * @returns array de "YYYY-MM-DD" strings
 */
export function computeDepartureDates(
  weekday: number,
  startDate: Date,
  horizonMonths: number
): string[] {
  if (weekday < 0 || weekday > 6 || horizonMonths <= 0) {
    return [];
  }

  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + horizonMonths,
    startDate.getDate()
  );

  // Find the first day >= startDate whose getDay() === weekday
  const cursor = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const diff = (weekday - cursor.getDay() + 7) % 7;
  cursor.setDate(cursor.getDate() + diff);

  const results: string[] = [];
  while (cursor < endDate) {
    results.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }

  return results;
}

/**
 * Genera departures para un tour. Inserta en DB solo las fechas
 * que no tengan ya una departure existente para ese tour.
 * Retorna el conteo de departures creadas.
 */
export async function generateDeparturesForTour(
  tourId: string,
  weekday: number,
  departureTime: string,
  capacityDefault: number,
  horizonMonths: number = DEFAULT_HORIZON_MONTHS
): Promise<{ created: number }> {
  // Lazy import to avoid initializing Supabase at module load (breaks tests)
  const { supabaseAdmin } = await import('@/lib/supabase/server');

  // 1. Compute dates starting from tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dates = computeDepartureDates(weekday, tomorrow, horizonMonths);

  if (dates.length === 0) {
    return { created: 0 };
  }

  // 2. Query existing departures for this tour on the computed dates
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('departures')
    .select('date')
    .eq('tour_id', tourId)
    .in('date', dates);

  if (fetchError) {
    throw fetchError;
  }

  // 3. Filter out dates that already have a departure
  const existingDates = new Set((existing ?? []).map((d: { date: string }) => d.date));
  const newDates = dates.filter((d) => !existingDates.has(d));

  if (newDates.length === 0) {
    return { created: 0 };
  }

  // 4. Insert batch of new departures
  const rows = newDates.map((date) => ({
    tour_id: tourId,
    date,
    time: departureTime,
    capacity: capacityDefault,
    spots_left: capacityDefault,
    active: true,
    sold_out: false,
    hidden: false,
  }));

  const { error: insertError } = await supabaseAdmin
    .from('departures')
    .insert(rows);

  if (insertError) {
    throw insertError;
  }

  // 5. Return count of created departures
  return { created: newDates.length };
}

/**
 * Regenera departures: elimina futuras sin reservas, luego genera nuevas.
 * Si newWeekday o newDepartureTime son null, solo elimina sin generar.
 * Retorna conteos de eliminadas y creadas.
 */
export async function regenerateDepartures(
  tourId: string,
  newWeekday: number | null,
  newDepartureTime: string | null,
  capacityDefault: number,
  horizonMonths: number = DEFAULT_HORIZON_MONTHS
): Promise<{ deleted: number; created: number }> {
  // Lazy import to avoid initializing Supabase at module load (breaks tests)
  const { supabaseAdmin } = await import('@/lib/supabase/server');

  // 1. tomorrow = fecha de mañana (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDateKey(tomorrow);

  // 2. Consultar departures del tour con fecha >= tomorrow
  const { data: futureDepartures, error: fetchError } = await supabaseAdmin
    .from('departures')
    .select('id, date, capacity, spots_left')
    .eq('tour_id', tourId)
    .gte('date', tomorrowStr);

  if (fetchError) {
    throw fetchError;
  }

  // 3. deletable = departures donde spots_left === capacity (sin reservas)
  const deletable = (futureDepartures ?? []).filter(
    (d: { capacity: number; spots_left: number }) => d.spots_left === d.capacity
  );

  // 4. Eliminar deletable
  let deleted = 0;
  if (deletable.length > 0) {
    const deletableIds = deletable.map((d: { id: string }) => d.id);
    const { error: deleteError } = await supabaseAdmin
      .from('departures')
      .delete()
      .in('id', deletableIds);

    if (deleteError) {
      throw deleteError;
    }

    deleted = deletable.length;
  }

  // 5. Si newWeekday !== null && newDepartureTime !== null → generar nuevas
  let created = 0;
  if (newWeekday !== null && newDepartureTime !== null) {
    const result = await generateDeparturesForTour(
      tourId,
      newWeekday,
      newDepartureTime,
      capacityDefault,
      horizonMonths
    );
    created = result.created;
  }

  // 6. Retornar { deleted, created }
  return { deleted, created };
}
