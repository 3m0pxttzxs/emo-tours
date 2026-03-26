# Requirements Document

## Introduction

Sistema de reseñas para EMO Tours CDMX que permite a los clientes dejar reseñas después de su tour. Incluye envío automático de emails de solicitud de reseña post-tour, una página de envío de reseña accesible mediante un token único, almacenamiento de reseñas con calificación de estrellas, comentario de texto y foto opcional, y la integración de reseñas reales en la página /reviews y la sección de testimonios del homepage (actualmente hardcodeadas). También incluye una mejora en el diseño del email de confirmación de reserva.

## Glossary

- **Review_System**: El sistema completo de reseñas de EMO Tours CDMX, incluyendo almacenamiento, envío de emails y páginas de UI
- **Review**: Un registro en la base de datos que contiene una calificación de estrellas, comentario de texto, foto opcional y metadatos asociados a un booking
- **Review_Token**: Un token criptográficamente seguro y único generado para cada booking que permite acceso a la página de envío de reseña sin autenticación
- **Review_Request_Email**: Un email enviado automáticamente al cliente después de la fecha de su tour, invitándolo a dejar una reseña
- **Review_Submission_Page**: La página pública accesible vía token donde el cliente completa y envía su reseña
- **Reviews_Page**: La página /reviews del sitio que muestra las reseñas de los clientes
- **Homepage_Testimonials**: La sección de testimonios en la página principal del sitio
- **Booking_Confirmation_Email**: El email enviado al cliente cuando su pago es confirmado
- **Supabase_Storage**: El servicio de almacenamiento de archivos de Supabase utilizado para guardar las fotos de reseñas
- **Resend**: El servicio de envío de emails utilizado por la plataforma

## Requirements

### Requirement 1: Reviews Database Table

**User Story:** As a platform operator, I want to store customer reviews in a structured database table, so that reviews can be queried, displayed, and managed.

#### Acceptance Criteria

1. THE Review_System SHALL store each Review with the following fields: id (UUID), booking_id (foreign key), tour_id (foreign key), reviewer_name (text), rating (integer 1-5), comment (text), photo_url (text, nullable), status (pending/approved/rejected), review_token (unique text), token_used (boolean), created_at (timestamp)
2. THE Review_System SHALL enforce a unique constraint on booking_id so that each booking produces at most one Review
3. THE Review_System SHALL enforce a unique constraint on review_token so that each token maps to exactly one Review
4. THE Review_System SHALL enforce a CHECK constraint on rating to accept only integer values between 1 and 5 inclusive

### Requirement 2: Review Token Generation

**User Story:** As a platform operator, I want a unique token generated for each confirmed booking, so that customers can access their review submission page securely without needing to log in.

#### Acceptance Criteria

1. WHEN a booking payment is confirmed via the Stripe webhook, THE Review_System SHALL generate a cryptographically secure Review_Token and create a Review record with status "pending" and token_used set to false
2. THE Review_System SHALL generate Review_Tokens using a minimum of 32 bytes of randomness encoded as a URL-safe string
3. IF a Review record already exists for a given booking_id, THEN THE Review_System SHALL skip token generation to maintain idempotency

### Requirement 3: Review Request Email

**User Story:** As a customer, I want to receive an email after my tour inviting me to leave a review, so that I can share my experience conveniently.

#### Acceptance Criteria

1. THE Review_Request_Email SHALL be sent to the customer_email associated with the booking after the departure date has passed
2. THE Review_Request_Email SHALL include the tour title, the departure date, and a unique link containing the Review_Token that directs to the Review_Submission_Page
3. THE Review_Request_Email SHALL follow the visual style of EMO Tours CDMX emails, using the brand colors (#1c1b1b, #4cbb17) and fonts (Space Grotesk, Inter)
4. THE Review_System SHALL provide an API endpoint or scheduled mechanism that identifies bookings eligible for review request emails (confirmed bookings where the departure date is in the past and no Review_Request_Email has been sent)
5. IF the Review_Token has already been used (token_used is true), THEN THE Review_System SHALL skip sending the Review_Request_Email for that booking

### Requirement 4: Review Submission Page

**User Story:** As a customer, I want to access a review submission page via the link in my email, so that I can rate my tour, write a comment, and optionally upload a photo.

#### Acceptance Criteria

1. WHEN a customer navigates to the Review_Submission_Page with a valid and unused Review_Token, THE Review_Submission_Page SHALL display a form with: a star rating selector (1-5), a text comment field, and an optional photo upload input
2. WHEN the customer submits the review form with a valid rating (1-5) and a non-empty comment, THE Review_System SHALL update the Review record with the submitted data and set token_used to true
3. IF the customer uploads a photo, THEN THE Review_System SHALL upload the image to Supabase_Storage and store the resulting public URL in the Review photo_url field
4. IF the Review_Token is invalid or already used, THEN THE Review_Submission_Page SHALL display a clear message indicating the link is expired or already used
5. THE Review_Submission_Page SHALL validate that the rating is between 1 and 5 and the comment has a minimum length of 10 characters before submission
6. WHEN the review is submitted successfully, THE Review_Submission_Page SHALL display a thank-you confirmation message
7. THE Review_System SHALL accept only image files (JPEG, PNG, WebP) with a maximum size of 5 MB for photo uploads

### Requirement 5: Reviews Page with Real Data

**User Story:** As a site visitor, I want to see real customer reviews on the /reviews page, so that I can read authentic experiences before booking a tour.

#### Acceptance Criteria

1. THE Reviews_Page SHALL fetch and display all Reviews with status "approved" from the database, ordered by created_at descending
2. THE Reviews_Page SHALL display each Review with the reviewer_name, rating (as stars), comment text, tour title, and photo (when available)
3. THE Reviews_Page SHALL calculate and display the real average rating and total review count in the metrics section
4. IF no approved Reviews exist, THEN THE Reviews_Page SHALL display a message encouraging visitors to book a tour

### Requirement 6: Homepage Testimonials with Real Data

**User Story:** As a site visitor, I want to see real testimonials on the homepage, so that I can trust the quality of the tours.

#### Acceptance Criteria

1. THE Homepage_Testimonials section SHALL fetch and display up to 3 approved Reviews with a rating of 4 or higher, ordered by created_at descending
2. THE Homepage_Testimonials section SHALL display each Review with the reviewer_name, rating, comment text, and associated tour title
3. IF fewer than 3 approved Reviews exist, THEN THE Homepage_Testimonials section SHALL display the available approved Reviews without showing empty slots

### Requirement 7: Booking Confirmation Email Redesign

**User Story:** As a customer, I want to receive a well-designed booking confirmation email, so that I have a clear and professional summary of my reservation.

#### Acceptance Criteria

1. THE Booking_Confirmation_Email SHALL use the EMO Tours CDMX brand colors (#1c1b1b background header, #4cbb17 accent) and fonts (Space Grotesk for headings, Inter for body)
2. THE Booking_Confirmation_Email SHALL include a branded header with the EMO Tours CDMX name
3. THE Booking_Confirmation_Email SHALL display the booking details (tour title, date, time, guest count, total paid, meeting point) in a structured card layout
4. THE Booking_Confirmation_Email SHALL include a "Next Steps" section with practical tips for the tour day
5. THE Booking_Confirmation_Email SHALL include a footer with contact information and social links

### Requirement 8: Review Administration

**User Story:** As a platform operator, I want to approve or reject submitted reviews, so that only appropriate content is displayed on the public site.

#### Acceptance Criteria

1. THE Review_System SHALL default new submitted Reviews to status "pending"
2. THE Review_System SHALL provide an API endpoint that allows updating a Review status to "approved" or "rejected"
3. WHEN a Review status is updated, THE Review_System SHALL record the updated_at timestamp

### Requirement 9: Manual Review Link Generation

**User Story:** As a platform operator, I want to manually generate review links for past clients who booked before the review system existed, so that I can collect reviews from them too.

#### Acceptance Criteria

1. THE Admin SHALL provide a page or form where the operator can enter a client name, email, and tour name to generate a Review_Token and review link without requiring an existing booking
2. THE Review_System SHALL create a Review record with status "pending", token_used set to false, and the provided client name and tour reference
3. THE Review_System SHALL display the generated review link (e.g., /review/[token]) so the operator can copy and share it manually via WhatsApp, email, or any channel
4. THE Review_Submission_Page SHALL work identically for manually generated tokens as for automatically generated ones
5. THE Review_System SHALL allow generating review links without a booking_id (booking_id nullable for manual reviews)
