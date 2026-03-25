# Plan de Implementación: EMO Tours CDMX

## Resumen

Implementación incremental de la plataforma de reservas de tours en CDMX usando Next.js (App Router), Supabase, Stripe Checkout, Resend y Tailwind CSS. Cada tarea construye sobre la anterior, priorizando la funcionalidad core antes de integraciones externas. Todas las páginas públicas replican fielmente las pantallas aprobadas en Stitch.

## Tareas

- [x] 1. Configuración del proyecto y dependencias
  - [x] 1.1 Inicializar proyecto Next.js con App Router y TypeScript
    - Crear proyecto con `create-next-app` usando TypeScript y App Router
    - Instalar dependencias: `@supabase/supabase-js`, `stripe`, `resend`, `tailwindcss`
    - Instalar dependencias de desarrollo: `vitest`, `fast-check`
    - Configurar Tailwind CSS con los tokens de diseño (Kelly Green #4CBB17, Space Grotesk, Inter, glassmorphism)
    - Configurar variables de entorno en `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`
    - Configurar `vitest.config.ts` con paths aliases
    - _Requerimientos: 1.1, 1.2_

  - [x] 1.2 Crear tipos TypeScript y utilidades base
    - Crear `src/types/index.ts` con todas las interfaces: `Tour`, `Departure`, `Booking`, `CustomRequest`, `FaqItem` y los tipos de enum: `TourType`, `PaymentStatus`, `BookingStatus`, `CustomRequestStatus`
    - Crear `src/lib/supabase/client.ts` (browser client) y `src/lib/supabase/server.ts` (server client)
    - Crear `src/lib/stripe.ts` con la configuración de Stripe
    - Crear `src/lib/resend.ts` con la configuración de Resend
    - Crear `src/lib/validators.ts` con funciones de validación para checkout y custom requests
    - _Requerimientos: 1.1, 1.3, 1.4, 1.5_

- [x] 2. Esquema de base de datos y datos semilla
  - [x] 2.1 Crear esquema SQL de Supabase
    - Crear archivo `supabase/migrations/001_schema.sql` con las tablas: `tours`, `departures`, `bookings`, `custom_requests`
    - Definir tipos enum, constraints, foreign keys e índices según el modelo de datos del diseño
    - Incluir campos `created_at` y `updated_at` con defaults `now()`
    - _Requerimientos: 2.1, 3.1, 4.1, 5.1_

  - [x] 2.2 Crear script de datos semilla
    - Crear `src/seed/seed.ts` que inserte los 4 tours iniciales: Historic Center Tour, Bellas Artes + Alameda Tour, Coyoacán Tour y Custom Private Tour
    - Crear al menos 2 salidas por cada tour fijo con fechas futuras y capacidad definida
    - Incluir contenido placeholder realista (descripciones, highlights, FAQ, included_items) de CDMX
    - _Requerimientos: 22.1, 22.2, 22.3_

  - [x] 2.3 Crear lógica de capacidad
    - Crear `src/lib/capacity.ts` con la función de reducción atómica de `spots_left` usando UPDATE condicional
    - Implementar la función de validación pre-checkout (`spots_left >= guest_count`)
    - Implementar la lógica de marcado automático de `sold_out` cuando `spots_left == 0`
    - _Requerimientos: 3.5, 3.6, 20.1, 20.2, 20.3, 20.4_

  - [ ]* 2.4 Escribir property tests para lógica de capacidad
    - **Propiedad 4: Validación de capacidad pre-reserva** — Para cualquier salida y guest_count, permitir checkout sii `guest_count <= spots_left` y `sold_out = false`
    - **Valida: Requerimientos 9.6, 9.7, 9.8, 10.4, 10.5**
    - **Propiedad 5: Reducción atómica de spots_left** — Para cualquier reserva confirmada con guest_count=N, spots_left se reduce exactamente en N; si llega a 0, sold_out=true
    - **Valida: Requerimientos 3.5, 10.9, 10.10, 20.2, 20.3**
    - **Propiedad 6: Salida agotada bloquea nuevas reservas** — Para cualquier salida con sold_out=true, todo intento de reserva es rechazado
    - **Valida: Requerimientos 3.6, 20.4**

- [x] 3. Checkpoint — Verificar esquema, seed y lógica de capacidad
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 4. Componentes UI reutilizables
  - [x] 4.1 Crear componentes de layout: Navbar y Footer
    - Crear `src/components/layout/Navbar.tsx` con navegación principal, logo y links (Inicio, Tours, Custom Tours)
    - Crear `src/components/layout/Footer.tsx` con fondo oscuro (#0A0A0A), links, info de contacto
    - Crear `src/app/layout.tsx` (root layout) que incluya Navbar, Footer, fuentes (Space Grotesk + Inter) y metadata base
    - Replicar fielmente el estilo visual de **stitch-screens/homepage.html** para Navbar y Footer
    - _Requerimientos: 6.4, 19.1, 19.2, 19.3_

  - [x] 4.2 Crear componentes de tours: TourCard, MetadataChips, PriceBlock, FaqAccordion, TourGallery, TestimonialCard
    - Crear `src/components/tours/TourCard.tsx` — muestra título, cover_image, short_description, area, duration, base_price con efecto hover grayscale-to-color
    - Crear `src/components/tours/MetadataChips.tsx` — chips para area, duration, language, meeting_point
    - Crear `src/components/tours/PriceBlock.tsx` — muestra base_price, guest_count y total
    - Crear `src/components/tours/FaqAccordion.tsx` — acordeón expandible para FAQ items
    - Crear `src/components/tours/TourGallery.tsx` — galería de imágenes del tour
    - Crear `src/components/tours/TestimonialCard.tsx` — tarjeta de testimonio
    - Replicar estilos de **stitch-screens/tours-listing.html** y **stitch-screens/tour-detail.html**
    - _Requerimientos: 7.3, 8.2, 19.1, 19.2, 19.3_

  - [x] 4.3 Crear componentes UI base: Button, FormField, Badge
    - Crear `src/components/ui/Button.tsx` con variantes (primary, secondary, outline), tamaños, estados disabled/loading
    - Crear `src/components/ui/FormField.tsx` con label, input, mensaje de error, soporte para required
    - Crear `src/components/ui/Badge.tsx` con variantes de color
    - Usar tokens de diseño: Kelly Green para primary, glassmorphism para superficies
    - _Requerimientos: 19.1, 19.2, 19.3_

  - [ ]* 4.4 Escribir property tests para componentes de datos
    - **Propiedad 15: Contenido del TourCard en listado** — Para cualquier tour, TourCard debe contener título, cover_image, short_description, area, duration y base_price
    - **Valida: Requerimiento 7.3**
    - **Propiedad 3: Cálculo de precio total** — Para cualquier base_price (≥0) y guest_count (≥1), el total es exactamente base_price × guest_count
    - **Valida: Requerimientos 9.5, 10.6**

- [x] 5. Páginas públicas — Homepage y Tours Listing
  - [x] 5.1 Implementar Homepage
    - Crear `src/app/page.tsx` como Server Component con SSG y revalidación
    - Consultar tours featured, published y active desde Supabase
    - Renderizar hero section, tours destacados con TourCard, sección de testimonios
    - Replicar fielmente el layout, espaciado y estilo visual de **stitch-screens/homepage.html**
    - Implementar diseño responsive priorizando móvil
    - _Requerimientos: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.2 Implementar Tours Listing
    - Crear `src/app/tours/page.tsx` como Server Component con SSG y revalidación
    - Consultar todos los tours published y active desde Supabase
    - Renderizar grid de TourCards con links a `/tours/[slug]`
    - Replicar fielmente el layout y estilo visual de **stitch-screens/tours-listing.html**
    - Implementar diseño responsive priorizando móvil
    - _Requerimientos: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 5.3 Escribir property tests para visibilidad de tours
    - **Propiedad 1: Visibilidad pública de tours** — La consulta pública retorna únicamente tours con published=true AND active=true
    - **Valida: Requerimientos 2.2, 2.3, 7.2**

- [x] 6. Página Tour Detail y Módulo de Reserva
  - [x] 6.1 Implementar página Tour Detail
    - Crear `src/app/tours/[slug]/page.tsx` con SSG (generateStaticParams)
    - Consultar tour por slug + salidas activas, visibles y no agotadas
    - Renderizar: título, full_description, TourGallery, MetadataChips, PriceBlock, highlights, included_items, FaqAccordion
    - Si tour.type es "custom", redirigir a `/custom-tours`
    - Generar meta tags dinámicos (title, description, og:image) basados en el tour
    - Replicar fielmente el layout y estilo visual de **stitch-screens/tour-detail.html**
    - _Requerimientos: 8.1, 8.2, 8.3, 8.4, 8.5, 21.1, 21.2_

  - [x] 6.2 Implementar BookingModule y AvailabilitySelector
    - Crear `src/components/booking/BookingModule.tsx` (Client Component) con estado: selectedDate, selectedTime, guestCount
    - Crear `src/components/booking/AvailabilitySelector.tsx` — agrupa salidas por fecha, muestra horarios y spots_left
    - Crear `src/components/booking/GuestCounter.tsx` — selector de cantidad de personas
    - Calcular totalPrice = base_price × guestCount
    - Validar guestCount <= spots_left; deshabilitar CTA si sold_out o excede capacidad
    - Al confirmar, navegar a `/checkout` con query params: tourId, departureId, guestCount
    - Replicar el módulo de reserva de **stitch-screens/tour-detail.html**
    - _Requerimientos: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ]* 6.3 Escribir property tests para módulo de reserva
    - **Propiedad 2: Visibilidad pública de salidas** — Solo salidas con active=true, hidden=false, sold_out=false aparecen en vista pública
    - **Valida: Requerimientos 3.3, 3.4, 9.1, 20.5**
    - **Propiedad 11: Enrutamiento por tipo de tour** — Tours shared/private muestran módulo de reserva; tours custom redirigen a /custom-tours
    - **Valida: Requerimientos 8.3, 8.4**
    - **Propiedad 12: Generación de URLs por slug** — Para cualquier slug, la URL es /tours/{slug}
    - **Valida: Requerimientos 6.3, 7.4, 8.5**
    - **Propiedad 13: Filtrado de salidas por fecha** — Solo salidas cuya date coincida con la fecha seleccionada se muestran
    - **Valida: Requerimiento 9.2**
    - **Propiedad 14: Tour sin disponibilidad** — Tour con todas las salidas inactivas/ocultas/agotadas refleja sin disponibilidad
    - **Valida: Requerimiento 20.6**
    - **Propiedad 16: Contenido completo en Tour Detail** — La página muestra título, full_description, galería, area, duration, meeting_point, language, precio, highlights, included_items y FAQ
    - **Valida: Requerimiento 8.2**

- [x] 7. Checkpoint — Verificar páginas públicas y módulo de reserva
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 8. Flujo de Checkout y API de pago
  - [x] 8.1 Implementar API route POST /api/checkout
    - Crear `src/app/api/checkout/route.ts`
    - Validar datos del request (tour_id, departure_id, guest_count, customer_full_name, customer_email, customer_phone)
    - Verificar disponibilidad: spots_left >= guest_count y sold_out = false
    - Si no hay disponibilidad, retornar HTTP 409
    - Crear booking en Supabase con payment_status="pending" y booking_status="pending"
    - Crear Stripe Checkout Session con el monto total
    - Retornar checkout_url para redirect
    - _Requerimientos: 10.4, 10.5, 10.6, 10.7, 10.13_

  - [x] 8.2 Implementar página de Checkout
    - Crear `src/app/checkout/page.tsx` (SSR)
    - Crear `src/components/checkout/CheckoutForm.tsx` — formulario con campos: nombre completo, email, teléfono
    - Crear `src/components/checkout/OrderSummary.tsx` — resumen: tour, fecha, hora, guest_count, precio unitario, total
    - Leer query params (tourId, departureId, guestCount) y fetch datos del tour/departure
    - Validación client-side de campos requeridos, formato email y teléfono
    - Al submit, POST a /api/checkout y redirect a Stripe
    - Replicar fielmente el layout y estilo visual de **stitch-screens/checkout.html**
    - _Requerimientos: 10.1, 10.2, 10.3_

  - [ ]* 8.3 Escribir property tests para estado de booking
    - **Propiedad 7: Estado inicial de booking es pending** — Toda reserva creada en checkout tiene payment_status="pending" y booking_status="pending"
    - **Valida: Requerimiento 10.13**
    - **Propiedad 10: Validación de enums** — payment_status, booking_status y custom_request.status solo aceptan valores válidos del enum
    - **Valida: Requerimientos 4.2, 4.3, 5.2**

- [x] 9. Webhook de Stripe y confirmación de pago
  - [x] 9.1 Implementar webhook handler POST /api/webhooks/stripe
    - Crear `src/app/api/webhooks/stripe/route.ts`
    - Verificar firma del webhook con Stripe
    - Manejar evento `checkout.session.completed`: actualizar booking a paid/confirmed
    - Reducir spots_left de la salida usando la función atómica de capacity.ts
    - Si spots_left llega a 0, marcar sold_out=true
    - Manejar evento de fallo: actualizar payment_status a "failed"
    - Implementar idempotencia: verificar si booking ya está en estado "paid" antes de procesar
    - _Requerimientos: 10.8, 10.9, 10.10, 10.11, 10.12_

  - [x] 9.2 Implementar página de Booking Confirmation
    - Crear `src/app/confirmation/page.tsx` (SSR)
    - Crear `src/components/confirmation/ConfirmationSummary.tsx`
    - Leer session_id de query params, fetch booking por stripe_session_id
    - Mostrar: estado de éxito, nombre del tour, fecha, hora, guest_count, total, punto de encuentro, próximos pasos
    - Incluir CTA para explorar más tours
    - Si no hay booking válido confirmado, redirect a homepage
    - Replicar fielmente el layout y estilo visual de **stitch-screens/booking-confirmation.html**
    - _Requerimientos: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 9.3 Escribir property tests para webhook y confirmación
    - **Propiedad 8: Transición de estado por webhook** — Evento checkout.session.completed → booking pasa a paid/confirmed; evento de fallo → payment_status="failed"
    - **Valida: Requerimientos 10.8, 10.11**
    - **Propiedad 24: Guard de página de confirmación** — Acceso sin session_id válido redirige a homepage
    - **Valida: Requerimiento 11.4**

- [x] 10. Flujo de Tours Personalizados
  - [x] 10.1 Implementar API route POST /api/custom-requests
    - Crear `src/app/api/custom-requests/route.ts`
    - Validar campos requeridos (full_name, email, phone, group_size, interests)
    - Si hay campos vacíos, retornar HTTP 400 con errores por campo
    - Crear custom_request en Supabase con status="new"
    - Retornar éxito
    - _Requerimientos: 5.3, 12.3, 12.5_

  - [x] 10.2 Implementar página Custom Tours
    - Crear `src/app/custom-tours/page.tsx` (SSG)
    - Implementar formulario con campos: nombre completo, email, teléfono, fecha preferida, tamaño del grupo, intereses/preferencias, notas adicionales
    - Validación client-side de campos requeridos con mensajes específicos por campo
    - Al submit exitoso, mostrar mensaje de confirmación
    - Replicar fielmente el layout y estilo visual de **stitch-screens/custom-tours.html**
    - _Requerimientos: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 10.3 Escribir property tests para solicitudes custom
    - **Propiedad 9: Estado inicial de solicitud custom es "new"** — Toda solicitud creada tiene status="new"
    - **Valida: Requerimientos 5.3, 12.3**
    - **Propiedad 23: Validación de formulario custom** — Formulario con campos requeridos vacíos retorna errores específicos por campo y no crea la solicitud
    - **Valida: Requerimiento 12.5**

- [x] 11. Checkpoint — Verificar flujos de checkout, webhook y custom tours
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 12. Integración de email con Resend
  - [x] 12.1 Implementar envío de emails transaccionales
    - Crear templates de email para confirmación de reserva (nombre del tour, fecha, hora, guest_count, total, punto de encuentro, próximos pasos)
    - Crear template de email de notificación al admin para solicitudes custom (nombre del cliente, fecha preferida, tamaño del grupo, intereses, notas)
    - Integrar envío de email de confirmación en el webhook handler (después de confirmar booking)
    - Integrar envío de email de notificación al admin en POST /api/custom-requests (después de crear solicitud)
    - Implementar manejo de errores: registrar en logs sin afectar estado de booking/request
    - _Requerimientos: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 12.2 Escribir property tests para emails
    - **Propiedad 22: Contenido del email de confirmación** — El email contiene nombre del tour, fecha, hora, guest_count, total, punto de encuentro y próximos pasos
    - **Valida: Requerimientos 13.1, 13.2**
    - **Propiedad 26: Notificación al admin por solicitud custom** — El email al admin contiene nombre del cliente, fecha preferida, tamaño del grupo, intereses y notas
    - **Valida: Requerimiento 13.3**
    - **Propiedad 21: Aislamiento de errores de servicios externos** — Fallo en email o Google Calendar no afecta estado de booking/request
    - **Valida: Requerimientos 13.4, 14.4**

- [x] 13. Panel de Administración
  - [x] 13.1 Crear layout y dashboard del Admin
    - Crear `src/app/admin/layout.tsx` con sidebar de navegación (Tours, Salidas, Reservas, Solicitudes)
    - Crear `src/app/admin/page.tsx` como dashboard con resumen general
    - _Requerimientos: 15.1_

  - [x] 13.2 Implementar CRUD de Tours en Admin
    - Crear `src/app/api/tours/route.ts` con GET (listado) y POST (crear)
    - Crear `src/app/admin/tours/page.tsx` — listado de tours con acciones
    - Crear `src/app/admin/tours/new/page.tsx` — formulario de creación con todos los campos del modelo
    - Crear `src/app/admin/tours/[id]/page.tsx` — formulario de edición
    - Implementar: crear, editar, publicar/despublicar, marcar featured, cambiar precio, actualizar imágenes, cambiar tipo, desactivar
    - _Requerimientos: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

  - [x] 13.3 Implementar gestión de Salidas en Admin
    - Crear `src/app/api/departures/route.ts` con GET, POST y PUT
    - Crear `src/app/admin/departures/page.tsx` — listado de salidas con filtro por tour
    - Implementar: crear salida, editar fecha/hora, modificar capacidad, actualizar spots_left, ocultar, marcar sold_out, duplicar salida
    - _Requerimientos: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

  - [x] 13.4 Implementar gestión de Reservas en Admin
    - Crear `src/app/api/bookings/route.ts` con GET y PUT
    - Crear `src/app/admin/bookings/page.tsx` — listado con filtros por payment_status y fecha de salida
    - Implementar vista de detalle de reserva individual
    - Implementar acción de cancelar reserva manualmente (booking_status="cancelled")
    - _Requerimientos: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [x] 13.5 Implementar gestión de Solicitudes Custom en Admin
    - Crear `src/app/admin/custom-requests/page.tsx` — listado de solicitudes
    - Implementar actualización de status (new → contacted → closed)
    - Mostrar información completa de cada solicitud
    - _Requerimientos: 18.1, 18.2, 18.3_

  - [ ]* 13.6 Escribir property tests para Admin CRUD
    - **Propiedad 17: Round-trip CRUD de tours** — Crear tour con campos válidos, leerlo de vuelta retorna los mismos valores; actualizar y leer refleja el cambio
    - **Valida: Requerimientos 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8**
    - **Propiedad 18: Round-trip CRUD de salidas** — Crear salida, leerla retorna los mismos valores; actualizar campos y leer refleja el cambio
    - **Valida: Requerimientos 16.1, 16.2, 16.3, 16.4, 16.5, 16.6**
    - **Propiedad 19: Duplicación de salida** — Duplicar salida crea nueva con mismo tour_id/date/time/capacity pero id diferente y spots_left=capacity
    - **Valida: Requerimiento 16.7**
    - **Propiedad 20: Filtrado de reservas en Admin** — Filtrar por payment_status retorna solo reservas con ese status; filtrar por fecha retorna solo reservas de salidas en esa fecha
    - **Valida: Requerimientos 17.2, 17.3**

- [x] 14. Checkpoint — Verificar panel de administración completo
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 15. SEO, optimización de imágenes e integración opcional de Google Calendar
  - [x] 15.1 Implementar SEO y optimización de imágenes
    - Configurar meta tags dinámicos (title, description, og:image) en cada página de tour usando `generateMetadata` de Next.js
    - Verificar que las páginas públicas usan SSR/SSG correctamente
    - Reemplazar `<img>` por el componente `Image` de Next.js en todas las páginas para optimización automática
    - _Requerimientos: 21.1, 21.2, 21.3_

  - [x] 15.2 Implementar integración opcional con Google Calendar
    - Crear `src/lib/google-calendar.ts` con función para crear eventos de calendario
    - Integrar en el webhook handler: después de confirmar booking, crear evento con nombre del tour, nombre del cliente, resumen y fecha/hora
    - Implementar feature flag via variable de entorno para habilitar/deshabilitar
    - Manejar errores: registrar en logs sin afectar estado de booking
    - _Requerimientos: 14.1, 14.2, 14.3, 14.4_

  - [ ]* 15.3 Escribir property tests para SEO
    - **Propiedad 25: Meta tags dinámicos por tour** — La página de detalle genera title con el título del tour, meta description con short_description, y og:image con cover_image
    - **Valida: Requerimiento 21.1**

- [x] 16. Checkpoint final — Verificar integración completa
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requerimientos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los property tests validan propiedades universales de correctitud
- Todas las páginas públicas deben replicar fielmente las pantallas de Stitch en `stitch-screens/`
