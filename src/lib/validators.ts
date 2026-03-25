export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;

export function validateCheckoutRequest(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _form: 'Datos inválidos' } };
  }

  const d = data as Record<string, unknown>;

  if (!d.tour_id || typeof d.tour_id !== 'string') {
    errors.tour_id = 'El tour es requerido';
  }

  if (!d.departure_id || typeof d.departure_id !== 'string') {
    errors.departure_id = 'La salida es requerida';
  }

  if (
    d.guest_count == null ||
    typeof d.guest_count !== 'number' ||
    !Number.isInteger(d.guest_count) ||
    d.guest_count < 1
  ) {
    errors.guest_count = 'La cantidad de personas debe ser al menos 1';
  }

  if (!d.customer_full_name || typeof d.customer_full_name !== 'string' || d.customer_full_name.trim() === '') {
    errors.customer_full_name = 'El nombre completo es requerido';
  }

  if (!d.customer_email || typeof d.customer_email !== 'string' || !EMAIL_RE.test(d.customer_email)) {
    errors.customer_email = 'El email es inválido';
  }

  if (!d.customer_phone || typeof d.customer_phone !== 'string' || !PHONE_RE.test(d.customer_phone)) {
    errors.customer_phone = 'El teléfono es inválido';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateCustomRequest(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _form: 'Datos inválidos' } };
  }

  const d = data as Record<string, unknown>;

  if (!d.full_name || typeof d.full_name !== 'string' || d.full_name.trim() === '') {
    errors.full_name = 'El nombre completo es requerido';
  }

  if (!d.email || typeof d.email !== 'string' || !EMAIL_RE.test(d.email)) {
    errors.email = 'El email es inválido';
  }

  if (!d.phone || typeof d.phone !== 'string' || !PHONE_RE.test(d.phone)) {
    errors.phone = 'El teléfono es inválido';
  }

  if (
    d.group_size == null ||
    typeof d.group_size !== 'number' ||
    !Number.isInteger(d.group_size) ||
    d.group_size < 1
  ) {
    errors.group_size = 'El tamaño del grupo debe ser al menos 1';
  }

  if (!d.interests || typeof d.interests !== 'string' || d.interests.trim() === '') {
    errors.interests = 'Los intereses son requeridos';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
