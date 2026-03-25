import { describe, it, expect } from 'vitest';
import { validateCheckoutRequest, validateCustomRequest } from './validators';

describe('validateCheckoutRequest', () => {
  const validData = {
    tour_id: 'abc-123',
    departure_id: 'dep-456',
    guest_count: 2,
    customer_full_name: 'Juan Pérez',
    customer_email: 'juan@example.com',
    customer_phone: '+52 55 1234 5678',
  };

  it('returns valid for correct data', () => {
    const result = validateCheckoutRequest(validData);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('rejects null input', () => {
    const result = validateCheckoutRequest(null);
    expect(result.valid).toBe(false);
  });

  it('rejects missing tour_id', () => {
    const result = validateCheckoutRequest({ ...validData, tour_id: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.tour_id).toBeDefined();
  });

  it('rejects guest_count < 1', () => {
    const result = validateCheckoutRequest({ ...validData, guest_count: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.guest_count).toBeDefined();
  });

  it('rejects invalid email', () => {
    const result = validateCheckoutRequest({ ...validData, customer_email: 'not-an-email' });
    expect(result.valid).toBe(false);
    expect(result.errors.customer_email).toBeDefined();
  });

  it('rejects invalid phone', () => {
    const result = validateCheckoutRequest({ ...validData, customer_phone: 'abc' });
    expect(result.valid).toBe(false);
    expect(result.errors.customer_phone).toBeDefined();
  });

  it('rejects empty customer name', () => {
    const result = validateCheckoutRequest({ ...validData, customer_full_name: '   ' });
    expect(result.valid).toBe(false);
    expect(result.errors.customer_full_name).toBeDefined();
  });
});

describe('validateCustomRequest', () => {
  const validData = {
    full_name: 'María García',
    email: 'maria@example.com',
    phone: '+52 55 9876 5432',
    group_size: 4,
    interests: 'Historia y gastronomía',
  };

  it('returns valid for correct data', () => {
    const result = validateCustomRequest(validData);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('rejects null input', () => {
    const result = validateCustomRequest(null);
    expect(result.valid).toBe(false);
  });

  it('rejects missing full_name', () => {
    const result = validateCustomRequest({ ...validData, full_name: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.full_name).toBeDefined();
  });

  it('rejects invalid email', () => {
    const result = validateCustomRequest({ ...validData, email: 'bad' });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('rejects group_size < 1', () => {
    const result = validateCustomRequest({ ...validData, group_size: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.group_size).toBeDefined();
  });

  it('rejects empty interests', () => {
    const result = validateCustomRequest({ ...validData, interests: '  ' });
    expect(result.valid).toBe(false);
    expect(result.errors.interests).toBeDefined();
  });

  it('collects multiple errors at once', () => {
    const result = validateCustomRequest({ full_name: '', email: '', phone: '', group_size: -1, interests: '' });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(5);
  });
});
