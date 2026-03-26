import { sanitize } from './sanitize';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized?: Record<string, unknown>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;

export function validateCheckoutRequest(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _form: 'Datos inválidos' } };
  }

  const d = data as Record<string, unknown>;

  // Sanitize string fields
  const tour_id = typeof d.tour_id === 'string' ? sanitize(d.tour_id) : d.tour_id;
  const departure_id = typeof d.departure_id === 'string' ? sanitize(d.departure_id) : d.departure_id;
  const customer_full_name = typeof d.customer_full_name === 'string' ? sanitize(d.customer_full_name) : d.customer_full_name;
  const customer_email = typeof d.customer_email === 'string' ? sanitize(d.customer_email) : d.customer_email;
  const customer_phone = typeof d.customer_phone === 'string' ? sanitize(d.customer_phone) : d.customer_phone;
  const guest_count = d.guest_count;

  if (!tour_id || typeof tour_id !== 'string') {
    errors.tour_id = 'El tour es requerido';
  }

  if (!departure_id || typeof departure_id !== 'string') {
    errors.departure_id = 'La salida es requerida';
  }

  if (
    guest_count == null ||
    typeof guest_count !== 'number' ||
    !Number.isInteger(guest_count) ||
    guest_count < 1
  ) {
    errors.guest_count = 'La cantidad de personas debe ser al menos 1';
  }

  if (!customer_full_name || typeof customer_full_name !== 'string' || customer_full_name.trim() === '') {
    errors.customer_full_name = 'El nombre completo es requerido';
  }

  if (!customer_email || typeof customer_email !== 'string' || !EMAIL_RE.test(customer_email)) {
    errors.customer_email = 'El email es inválido';
  }

  if (!customer_phone || typeof customer_phone !== 'string' || !PHONE_RE.test(customer_phone)) {
    errors.customer_phone = 'El teléfono es inválido';
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
    ...(valid && {
      sanitized: {
        tour_id,
        departure_id,
        guest_count,
        customer_full_name,
        customer_email,
        customer_phone,
      },
    }),
  };
}

export function validateCustomRequest(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _form: 'Datos inválidos' } };
  }

  const d = data as Record<string, unknown>;

  // Sanitize string fields
  const full_name = typeof d.full_name === 'string' ? sanitize(d.full_name) : d.full_name;
  const email = typeof d.email === 'string' ? sanitize(d.email) : d.email;
  const phone = typeof d.phone === 'string' ? sanitize(d.phone) : d.phone;
  const interests = typeof d.interests === 'string' ? sanitize(d.interests) : d.interests;
  const notes = typeof d.notes === 'string' ? sanitize(d.notes) : d.notes;
  const preferred_date = typeof d.preferred_date === 'string' ? sanitize(d.preferred_date) : d.preferred_date;
  const group_size = d.group_size;

  if (!full_name || typeof full_name !== 'string' || full_name.trim() === '') {
    errors.full_name = 'El nombre completo es requerido';
  }

  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    errors.email = 'El email es inválido';
  }

  if (!phone || typeof phone !== 'string' || !PHONE_RE.test(phone)) {
    errors.phone = 'El teléfono es inválido';
  }

  if (
    group_size == null ||
    typeof group_size !== 'number' ||
    !Number.isInteger(group_size) ||
    group_size < 1
  ) {
    errors.group_size = 'El tamaño del grupo debe ser al menos 1';
  }

  if (!interests || typeof interests !== 'string' || interests.trim() === '') {
    errors.interests = 'Los intereses son requeridos';
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
    ...(valid && {
      sanitized: {
        full_name,
        email,
        phone,
        group_size,
        interests,
        notes: notes ?? '',
        preferred_date: preferred_date ?? null,
      },
    }),
  };
}
