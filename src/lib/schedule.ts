// Weekly schedule helpers for the one-guide model

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function fmtTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}:00 ${period}` : `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function weekdayName(weekday: number | null): string | null {
  if (weekday === null || weekday < 0 || weekday > 6) return null;
  return DAY_NAMES[weekday];
}

export function formatSchedule(weekday: number | null, time: string | null): string {
  if (weekday === null || time === null) return 'By request · Flexible scheduling';
  return `Every ${DAY_NAMES[weekday]} at ${fmtTime(time)}`;
}

export function formatScheduleShort(weekday: number | null, time: string | null): string {
  if (weekday === null || time === null) return 'By request';
  return `${DAY_NAMES[weekday]}s at ${fmtTime(time)}`;
}

export function formatPrice(basePrice: number): string {
  if (basePrice === 0) return 'Pricing upon request';
  return `$${basePrice} / person`;
}

export function isRequestOnly(type: string, weekday: number | null): boolean {
  return type === 'custom' || weekday === null;
}
