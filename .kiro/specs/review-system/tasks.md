# Plan de Implementación: Review System

## Resumen

Implementación incremental del sistema de reseñas para EMO Tours CDMX. Cada tarea construye sobre la anterior: primero la base de datos y tipos, luego la generación de tokens e integración con el webhook de Stripe, la página de envío de reseñas, subida de fotos, emails, páginas públicas con datos reales, y finalmente el panel de administración.

## Tasks

- [x] 1. Migración de base de datos y tipos TypeScript
  - [x] 1.1 Crear archivo de migración SQL `supabase/migrations/create_reviews_table.sql` con la tabla `reviews` según el diseño: columnas id, booking_id, tour_id, reviewer_name, rating, comment, photo_url, status, review_token, token_used, email_sent, created_at, updated_at. Incluir constraints (CHECK en rating 1-5, CHECK en status, UNIQUE en review_token), índice único parcial en booking_id (WHERE booking_id IS NOT NULL), e índices para token lookup, status+created_at, y email eligibility
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Agregar tipos `ReviewStatus`, `Review`, `ReviewSubmissionPayload`, `ManualTokenRequest`, y `ReviewWithTour` en `src/types/index.ts` según las interfaces definidas en el diseño
    - _Requirements: 1.1_

- [ ] 2. Generación de tokens e integración con webhook de Stripe
  - [x] 2.1 Crear `src/lib/review-tokens.ts` con función `generateReviewToken()` que genere un token criptográficamente seguro usando `crypto.randomBytes(32)` codificado como base64url. Crear función `createReviewForBooking(bookingId, tourId, reviewerName)` que verifique si ya existe un review para ese booking_id (idempotencia) y, si no, genere un token y cree el registro en la tabla reviews con status "pending" y token_used false
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 2.2 Escribir property test para generación de tokens
    - **Property 1: Token format and entropy**
    - **Validates: Requirements 2.2**

  - [ ]* 2.3 Escribir property test para idempotencia de generación de tokens
    - **Property 2: Token generation idempotency**
    - **Validates: Requirements 2.3**

  - [ ] 2.4 Modificar `src/app/api/webhooks/stripe/route.ts` en la función `handleCheckoutCompleted`: después de confirmar el booking y enviar el email, llamar a `createReviewForBooking` con el booking_id, tour_id y customer_full_name. Manejar errores sin afectar el flujo principal del webhook (log + continue)
    - _Requirements: 2.1, 2.3_

- [ ] 3. Validadores de reseñas
  - [ ] 3.1 Agregar en `src/lib/validators.ts` las funciones `validateReviewSubmission(data)` (valida rating entero 1-5, comment mínimo 10 caracteres, token presente) y `validateManualTokenRequest(data)` (valida reviewer_name no vacío, tour_name no vacío). Seguir el patrón existente de `ValidationResult` con sanitización
    - _Requirements: 4.5, 9.1_

  - [ ]* 3.2 Escribir property test para validación de review submission
    - **Property 3: Review submission validation**
    - **Validates: Requirements 1.4, 4.5**

  - [ ]* 3.3 Escribir property test para validación de upload de fotos
    - **Property 6: Photo upload validation**
    - **Validates: Requirements 4.7**

- [ ] 4. Página de envío de reseña y API de submission
  - [ ] 4.1 Crear API route `src/app/api/reviews/route.ts` con método POST: validar token, verificar que existe y no está usado, actualizar el registro con rating, comment, photo_url, marcar token_used=true, mantener status "pending". Retornar 404 para token inválido, 410 para token usado, 400 para validación fallida
    - _Requirements: 4.2, 4.4, 4.5, 8.1_

  - [ ]* 4.2 Escribir property test para submission con token válido
    - **Property 4: Review submission updates record and marks token used**
    - **Validates: Requirements 4.2, 8.1**

  - [ ]* 4.3 Escribir property test para rechazo de token inválido/usado
    - **Property 5: Invalid or used token rejection**
    - **Validates: Requirements 4.4**

  - [ ] 4.4 Crear componente `src/components/reviews/StarRating.tsx`: selector interactivo de estrellas 1-5 con hover state, click para seleccionar, accesible con teclado (aria-labels). Referencia visual: stitch-screens/reviews.html
    - _Requirements: 4.1_

  - [ ] 4.5 Crear componente `src/components/reviews/PhotoUpload.tsx`: input de archivo con preview de imagen, validación client-side de tipo (JPEG, PNG, WebP) y tamaño (máx 5 MB), mensaje de error inline
    - _Requirements: 4.3, 4.7_

  - [ ] 4.6 Crear página `src/app/(public)/review/[token]/page.tsx`: server component que valida el token contra la DB. Si es válido y no usado, renderiza el formulario con StarRating, campo de comentario, PhotoUpload, y botón de envío. Si es inválido o usado, muestra mensaje apropiado. Al enviar exitosamente, muestra mensaje de agradecimiento
    - _Requirements: 4.1, 4.2, 4.4, 4.6_

- [ ] 5. Checkpoint - Verificar funcionalidad base
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Subida de fotos a Supabase Storage
  - [ ] 6.1 Crear API route `src/app/api/reviews/upload/route.ts` con método POST: recibir archivo via FormData, validar tipo MIME (image/jpeg, image/png, image/webp) y tamaño (≤ 5 MB), subir a bucket `review-photos` en Supabase Storage con path `{review_id}/{timestamp}.{ext}`, retornar URL pública. Retornar 400 para tipo/tamaño inválido
    - _Requirements: 4.3, 4.7_

  - [ ] 6.2 Integrar el upload en la página `/review/[token]`: al enviar el formulario, si hay foto seleccionada, primero subir vía `/api/reviews/upload`, obtener la URL, y luego incluirla en el POST a `/api/reviews`
    - _Requirements: 4.3_

- [ ] 7. Email de solicitud de reseña
  - [ ] 7.1 Agregar función `sendReviewRequestEmail(params)` en `src/lib/emails.ts` que genere un email HTML con brand colors (#1c1b1b, #4cbb17), fonts (Space Grotesk, Inter), incluyendo tour title, departure date, y link `/review/[token]`. Seguir el estilo visual de los emails existentes
    - _Requirements: 3.2, 3.3_

  - [ ]* 7.2 Escribir property test para contenido del email de review request
    - **Property 8: Review request email content**
    - **Validates: Requirements 3.2**

  - [ ] 7.3 Crear API route `src/app/api/reviews/send-requests/route.ts` con método POST: consultar reviews donde token_used=false, email_sent=false, y el departure date del booking asociado ya pasó (JOIN con bookings y departures). Para cada uno, enviar el email y marcar email_sent=true. Incluir protección con API key o auth check
    - _Requirements: 3.1, 3.4, 3.5_

  - [ ]* 7.4 Escribir property test para filtro de elegibilidad de email
    - **Property 7: Review request email eligibility**
    - **Validates: Requirements 3.1, 3.4, 3.5**

- [ ] 8. Página /reviews con datos reales
  - [ ] 8.1 Agregar método GET en `src/app/api/reviews/route.ts`: retornar reviews con status "approved" ordenadas por created_at DESC, incluyendo tour title via JOIN. Soportar query params opcionales para filtrar por tour_id. Calcular y retornar average rating y total count en la respuesta
    - _Requirements: 5.1, 5.3_

  - [ ]* 8.2 Escribir property test para query de reviews aprobadas
    - **Property 9: Approved reviews query returns only approved, ordered by date**
    - **Validates: Requirements 5.1**

  - [ ]* 8.3 Escribir property test para cálculo de promedio y conteo
    - **Property 11: Average rating and count calculation**
    - **Validates: Requirements 5.3**

  - [ ] 8.4 Crear componente `src/components/reviews/ReviewCard.tsx`: card reutilizable que muestra reviewer_name, rating (estrellas), comment, tour title, y foto (si existe). Referencia visual: stitch-screens/reviews.html
    - _Requirements: 5.2_

  - [ ]* 8.5 Escribir property test para campos requeridos en display de reviews
    - **Property 10: Reviews display contains required fields**
    - **Validates: Requirements 5.2, 6.2**

  - [ ] 8.6 Refactorizar `src/app/(public)/reviews/page.tsx`: reemplazar datos hardcodeados con fetch a `/api/reviews` (o query directa a Supabase). Mostrar métricas reales (promedio, conteo), listar ReviewCards con datos reales. Si no hay reviews aprobadas, mostrar mensaje invitando a reservar un tour. Usar revalidate para ISR
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 9. Testimonios del homepage con datos reales
  - [ ] 9.1 Refactorizar la función `Testimonials()` en `src/app/(public)/page.tsx`: reemplazar datos hardcodeados con query a Supabase que obtenga hasta 3 reviews aprobadas con rating ≥ 4, ordenadas por created_at DESC. Mostrar las disponibles sin slots vacíos si hay menos de 3. Usar revalidate para ISR
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 9.2 Escribir property test para constraints del query de homepage testimonials
    - **Property 12: Homepage testimonials query constraints**
    - **Validates: Requirements 6.1**

- [ ] 10. Checkpoint - Verificar flujo público completo
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Rediseño del email de confirmación de reserva
  - [ ] 11.1 Refactorizar `sendBookingConfirmationEmail` en `src/lib/emails.ts`: rediseñar el HTML con header branded (#1c1b1b fondo, nombre EMO Tours CDMX), card estructurada con detalles del booking (tour, fecha, hora, guests, total, meeting point), sección "Next Steps" con tips, y footer con contacto y social links. Referencia visual: stitch-screens/booking-confirmation.html
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 11.2 Escribir property test para contenido del email de confirmación
    - **Property 13: Booking confirmation email contains all booking details**
    - **Validates: Requirements 7.3**

- [ ] 12. Admin: gestión de reseñas
  - [ ] 12.1 Crear API route `src/app/api/reviews/[id]/route.ts` con método PATCH: recibir nuevo status ("approved" o "rejected"), actualizar el registro y el campo updated_at. Retornar 400 para status inválido, 404 si no existe
    - _Requirements: 8.2, 8.3_

  - [ ]* 12.2 Escribir property test para actualización de status con timestamp
    - **Property 14: Admin status update with timestamp**
    - **Validates: Requirements 8.2, 8.3**

  - [ ] 12.3 Crear componente `src/components/admin/ReviewsManager.tsx`: tabla con listado de reviews (todas), columnas para reviewer_name, tour, rating, status, fecha. Botones de acción para aprobar/rechazar. Filtros por status. Seguir el patrón de los managers existentes (BookingsManager, CustomRequestsManager)
    - _Requirements: 8.1, 8.2_

  - [ ] 12.4 Crear página `src/app/admin/reviews/page.tsx` que renderice ReviewsManager
    - _Requirements: 8.2_

- [ ] 13. Admin: generación manual de tokens
  - [ ] 13.1 Crear API route `src/app/api/reviews/generate-token/route.ts` con método POST: recibir reviewer_name, email, tour_name. Validar con `validateManualTokenRequest`. Generar token, crear review con booking_id null, status "pending", token_used false. Retornar el token y el link `/review/[token]`
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ]* 13.2 Escribir property test para generación manual de tokens
    - **Property 15: Manual token generation creates valid review record**
    - **Validates: Requirements 9.2, 9.5**

  - [ ] 13.3 Crear página `src/app/admin/reviews/generate/page.tsx` con formulario para ingresar nombre del cliente, email y nombre del tour. Al enviar, llamar al API y mostrar el link generado con botón para copiar al clipboard. La página de submission debe funcionar idénticamente para tokens manuales y automáticos
    - _Requirements: 9.1, 9.3, 9.4_

- [ ] 14. Checkpoint final - Verificar sistema completo
  - Ensure all tests pass, ask the user if questions arise.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los property tests validan propiedades universales de correctitud
- Referencia visual en `stitch-screens/` para estilos de UI y emails
