// Weekly schedule helpers for the one-guide model

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function weekdayName(weekday: number | null): string | null {
  if (weekday === null || weekday < 0 || weekday > 6) return null;
  return DAY_NAMES[weekday];
}

export function formatSchedule(weekday: number | null, time: string | null): string {
  if (weekday === null || time === null) return 'By request · Flexible scheduling';
  return `Every ${DAY_NAMES[weekday]} at ${time}`;
}

export function formatScheduleShort(weekday: number | null, time: string | null): string {
  if (weekday === null || time === null) return 'By request';
  return `${DAY_NAMES[weekday]}s at ${time}`;
}

export function formatPrice(basePrice: number): string {
  if (basePrice === 0) return 'Pricing upon request';
  return `$${basePrice} / person`;
}

export function isRequestOnly(type: string, weekday: number | null): boolean {
  return type === 'custom' || type === 'private' || weekday === null;
}
