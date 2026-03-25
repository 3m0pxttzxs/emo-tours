// Types and interfaces for EMO Tours CDMX

export type TourType = 'shared' | 'private' | 'custom';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type CustomRequestStatus = 'new' | 'contacted' | 'closed';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  gallery_images: string[];
  area: string;
  duration: string;
  meeting_point: string;
  language: string;
  type: TourType;
  base_price: number;
  price_label: string;
  capacity_default: number;
  active: boolean;
  published: boolean;
  featured: boolean;
  highlights: string[];
  included_items: string[];
  faq_items: FaqItem[];
  created_at: string;
  updated_at: string;
}

export interface Departure {
  id: string;
  tour_id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  capacity: number;
  spots_left: number;
  active: boolean;
  sold_out: boolean;
  hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  tour_id: string;
  departure_id: string;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  guest_count: number;
  subtotal: number;
  total: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string | null;
  group_size: number;
  interests: string;
  notes: string;
  status: CustomRequestStatus;
  created_at: string;
  updated_at: string;
}

// API interfaces

export interface CheckoutRequest {
  tour_id: string;
  departure_id: string;
  guest_count: number;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface CustomRequestPayload {
  full_name: string;
  email: string;
  phone: string;
  preferred_date?: string;
  group_size: number;
  interests: string;
  notes?: string;
}
