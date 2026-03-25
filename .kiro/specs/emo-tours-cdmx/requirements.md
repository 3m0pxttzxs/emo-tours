# Documento de Requerimientos — EMO Tours CDMX

## Introducción

EMO Tours CDMX es un sitio web de reservas de tours en la Ciudad de México. El sistema soporta dos tipos de producto: tours fijos con reserva y pago directo, y tours personalizados (custom) con flujo de solicitud/lead. El MVP debe implementar las 6 pantallas aprobadas en Stitch sin rediseñar la UI, integrando Next.js, Supabase, Stripe, Resend y opcionalmente Google Calendar.

## Glosario

- **Sistema**: La aplicación web EMO Tours CDMX en su conjunto (frontend + backend + integraciones)
- **Tour_Fijo**: Un tour con ruta, duración, precio, punto de encuentro y capacidad predefinidos, reservable directamente con pago
- **Tour_Personalizado**: Una experiencia privada solicitada por el usuario mediante formulario, sin checkout directo en V1
- **Salida**: Una ocurrencia específica de un Tour_Fijo en una fecha, hora y capacidad determinadas (tabla departures)
- **Reserva**: Un registro de compra de un Tour_Fijo vinculado a una Salida específica (tabla bookings)
- **Solicitud_Custom**: Un registro de solicitud de Tour_Personalizado almacenado como lead (tabla custom_requests)
- **Módulo_de_Reserva**: El componente interactivo en la página de detalle del tour que permite seleccionar fecha, hora, cantidad de personas y ver disponibilidad
- **Admin**: El panel interno de administración para gestionar tours, salidas, reservas y solicitudes
- **Capacidad**: El número máximo de lugares disponibles por Salida, gestionado exclusivamente a nivel de Salida
- **Lugares_Restantes**: El campo spots_left de una Salida, que se reduce con cada Reserva confirmada
- **Agotado**: Estado de una Salida cuando Lugares_Restantes llega a 0
- **Pantallas_Aprobadas**: Las 6 pantallas de diseño del proyecto Stitch que son la fuente de verdad para el frontend
- **Webhook_Stripe**: El endpoint que recibe notificaciones de Stripe sobre el estado de los pagos

## Requerimientos

### Requerimiento 1: Arquitectura y Stack Tecnológico

**User Story:** Como desarrollador, quiero que el proyecto use un stack definido y consistente, para que el desarrollo sea predecible y el despliegue sea directo.

#### Criterios de Aceptación

1. THE Sistema SHALL usar Next.js como framework de frontend y backend (API routes)
2. THE Sistema SHALL usar Tailwind CSS para estilos, respetando los tokens de diseño de las Pantallas_Aprobadas
3. THE Sistema SHALL usar Supabase como base de datos y fuente de verdad para tours, salidas, reservas y solicitudes
4. THE Sistema SHALL usar Stripe Checkout para procesar pagos de Tour_Fijo
5. THE Sistema SHALL usar Resend para envío de correos transaccionales
6. THE Sistema SHALL desplegarse en Vercel
7. WHERE la integración con Google Calendar esté habilitada, THE Sistema SHALL crear eventos de calendario únicamente después de una Reserva confirmada

### Requerimiento 2: Modelo de Datos — Tours

**User Story:** Como administrador, quiero que los tours se almacenen con toda su información relevante, para poder gestionarlos y mostrarlos al público.

#### Criterios de Aceptación

1. THE Sistema SHALL almacenar cada tour con los campos: id, title, slug, short_description, full_description, cover_image, gallery_images, area, duration, meeting_point, language, type (shared/private/custom), base_price, price_label, capacity_default, active, published, featured, highlights, included_items, faq_items, created_at, updated_at
2. WHEN un tour tiene published igual a false, THE Sistema SHALL excluir ese tour de todas las páginas públicas
3. WHEN un tour tiene active igual a false, THE Sistema SHALL excluir ese tour de todas las páginas públicas
4. THE Sistema SHALL pre-cargar 4 tours iniciales: Historic Center Tour, Bellas Artes + Alameda Tour, Coyoacán Tour y Custom Private Tour

### Requerimiento 3: Modelo de Datos — Salidas (Departures)

**User Story:** Como administrador, quiero gestionar salidas individuales por tour, para controlar la disponibilidad y capacidad de cada ocurrencia.

#### Criterios de Aceptación

1. THE Sistema SHALL almacenar cada Salida con los campos: id, tour_id, date, time, capacity, spots_left, active, sold_out, hidden, created_at, updated_at
2. THE Sistema SHALL gestionar la Capacidad exclusivamente a nivel de Salida, no a nivel de tour global
3. WHEN una Salida tiene hidden igual a true, THE Sistema SHALL excluir esa Salida de la vista pública
4. WHEN una Salida tiene active igual a false, THE Sistema SHALL excluir esa Salida de la vista pública
5. WHEN Lugares_Restantes de una Salida llega a 0, THE Sistema SHALL marcar sold_out como true automáticamente
6. WHEN una Salida tiene sold_out igual a true, THE Sistema SHALL impedir nuevas reservas para esa Salida

### Requerimiento 4: Modelo de Datos — Reservas (Bookings)

**User Story:** Como operador, quiero que cada reserva quede registrada con toda la información del cliente y el pago, para tener trazabilidad completa.

#### Criterios de Aceptación

1. THE Sistema SHALL almacenar cada Reserva con los campos: id, tour_id, departure_id, customer_full_name, customer_email, customer_phone, guest_count, subtotal, total, payment_status, booking_status, stripe_session_id, stripe_payment_intent_id, created_at, updated_at
2. THE Sistema SHALL soportar los valores de payment_status: pending, paid, failed, refunded
3. THE Sistema SHALL soportar los valores de booking_status: pending, confirmed, cancelled

### Requerimiento 5: Modelo de Datos — Solicitudes Custom

**User Story:** Como operador, quiero almacenar las solicitudes de tours personalizados como leads, para poder dar seguimiento y contactar a los clientes.

#### Criterios de Aceptación

1. THE Sistema SHALL almacenar cada Solicitud_Custom con los campos: id, full_name, email, phone, preferred_date, group_size, interests, notes, status, created_at, updated_at
2. THE Sistema SHALL soportar los valores de status: new, contacted, closed
3. WHEN una Solicitud_Custom es creada, THE Sistema SHALL asignar el status inicial como "new"

### Requerimiento 6: Homepage

**User Story:** Como visitante, quiero ver una página de inicio atractiva con tours destacados, para descubrir rápidamente las experiencias disponibles en CDMX.

#### Criterios de Aceptación

1. THE Sistema SHALL renderizar la Homepage siguiendo fielmente el layout, espaciado, jerarquía y estilo visual de la Pantalla_Aprobada de Homepage
2. THE Sistema SHALL mostrar en la Homepage los tours marcados como featured que estén published y active
3. WHEN el visitante hace clic en un tour destacado, THE Sistema SHALL navegar a la página de detalle de ese tour
4. THE Sistema SHALL incluir navegación (Navbar) y pie de página (Footer) consistentes en la Homepage
5. THE Sistema SHALL renderizar la Homepage de forma responsive, priorizando la experiencia móvil

### Requerimiento 7: Tours Listing

**User Story:** Como visitante, quiero ver un listado de todos los tours disponibles, para comparar opciones y elegir el que más me interese.

#### Criterios de Aceptación

1. THE Sistema SHALL renderizar la página Tours Listing siguiendo fielmente la Pantalla_Aprobada de Tours Listing
2. THE Sistema SHALL mostrar únicamente tours que estén published y active
3. THE Sistema SHALL mostrar para cada tour en el listado: título, imagen de portada, descripción corta, área, duración y precio base
4. WHEN el visitante hace clic en un tour del listado, THE Sistema SHALL navegar a la página de detalle de ese tour
5. THE Sistema SHALL renderizar la página Tours Listing de forma responsive, priorizando la experiencia móvil

### Requerimiento 8: Tour Detail

**User Story:** Como visitante, quiero ver toda la información de un tour específico y poder reservarlo, para tomar una decisión informada y proceder al pago.

#### Criterios de Aceptación

1. THE Sistema SHALL renderizar la página Tour Detail siguiendo fielmente la Pantalla_Aprobada de Tour Detail
2. THE Sistema SHALL mostrar en Tour Detail: título, descripción completa, galería de imágenes, área, duración, punto de encuentro, idioma, precio, highlights, items incluidos y FAQ
3. THE Sistema SHALL incluir el Módulo_de_Reserva en la página Tour Detail para tours de tipo shared o private
4. WHEN el tour es de tipo custom, THE Sistema SHALL redirigir al visitante a la página de Custom Tours en lugar de mostrar el Módulo_de_Reserva
5. THE Sistema SHALL generar rutas dinámicas basadas en el slug del tour

### Requerimiento 9: Módulo de Reserva

**User Story:** Como visitante, quiero seleccionar fecha, hora y cantidad de personas en el detalle del tour, para ver disponibilidad y precio total antes de pagar.

#### Criterios de Aceptación

1. THE Módulo_de_Reserva SHALL permitir al visitante seleccionar una fecha de las Salidas disponibles
2. WHEN el visitante selecciona una fecha, THE Módulo_de_Reserva SHALL mostrar los horarios disponibles para esa fecha
3. WHEN el visitante selecciona un horario, THE Módulo_de_Reserva SHALL mostrar los Lugares_Restantes de esa Salida
4. THE Módulo_de_Reserva SHALL permitir al visitante seleccionar la cantidad de personas (guest_count)
5. WHEN el visitante selecciona guest_count, THE Módulo_de_Reserva SHALL calcular y mostrar el precio total (base_price × guest_count)
6. WHEN la Salida seleccionada tiene sold_out igual a true, THE Módulo_de_Reserva SHALL deshabilitar el botón de continuar y mostrar estado agotado
7. WHEN el guest_count excede los Lugares_Restantes de la Salida seleccionada, THE Módulo_de_Reserva SHALL impedir al visitante continuar al checkout
8. WHEN el visitante completa la selección válida, THE Módulo_de_Reserva SHALL habilitar el botón CTA para continuar al checkout
9. THE Módulo_de_Reserva SHALL funcionar correctamente en dispositivos móviles y de escritorio

### Requerimiento 10: Flujo de Checkout y Pago con Stripe

**User Story:** Como visitante, quiero completar el pago de mi reserva de forma segura y sencilla, para confirmar mi lugar en el tour.

#### Criterios de Aceptación

1. THE Sistema SHALL renderizar la página Checkout siguiendo fielmente la Pantalla_Aprobada de Checkout
2. THE Sistema SHALL mostrar en la página Checkout: tour seleccionado, Salida seleccionada, guest_count, desglose de precio y total
3. THE Sistema SHALL recopilar en el formulario de checkout: nombre completo, email y teléfono del cliente
4. WHEN el visitante envía el formulario de checkout, THE Sistema SHALL validar la disponibilidad de la Salida antes de crear la sesión de Stripe
5. IF la Salida ya no tiene Lugares_Restantes suficientes al momento del checkout, THEN THE Sistema SHALL mostrar un mensaje de error indicando que la disponibilidad cambió
6. WHEN la disponibilidad es válida, THE Sistema SHALL crear una Stripe Checkout Session con el monto total calculado
7. WHEN la Stripe Checkout Session es creada, THE Sistema SHALL redirigir al visitante a la página de pago de Stripe
8. WHEN Stripe confirma el pago exitoso vía Webhook_Stripe, THE Sistema SHALL actualizar el payment_status de la Reserva a "paid" y el booking_status a "confirmed"
9. WHEN Stripe confirma el pago exitoso vía Webhook_Stripe, THE Sistema SHALL reducir los Lugares_Restantes de la Salida correspondiente según el guest_count
10. WHEN los Lugares_Restantes de la Salida llegan a 0 después de reducir, THE Sistema SHALL marcar la Salida como sold_out automáticamente
11. IF el pago falla en Stripe, THEN THE Sistema SHALL actualizar el payment_status de la Reserva a "failed"
12. THE Sistema SHALL tratar el Webhook_Stripe como la fuente de verdad para la confirmación de pago
13. THE Sistema SHALL crear la Reserva con payment_status "pending" antes de redirigir a Stripe, y confirmarla únicamente cuando el Webhook_Stripe reporte éxito

### Requerimiento 11: Página de Confirmación de Reserva

**User Story:** Como visitante, quiero ver un resumen claro de mi reserva confirmada, para tener certeza de que mi pago fue exitoso y saber los próximos pasos.

#### Criterios de Aceptación

1. THE Sistema SHALL renderizar la página Booking Confirmation siguiendo fielmente la Pantalla_Aprobada de Booking Confirmation
2. THE Sistema SHALL mostrar en la página de confirmación: estado de éxito, nombre del tour, fecha, hora, guest_count, total pagado, punto de encuentro y próximos pasos
3. THE Sistema SHALL incluir un CTA para volver a explorar más tours
4. WHEN el visitante accede a la página de confirmación sin una Reserva válida confirmada, THE Sistema SHALL redirigir al visitante a la Homepage

### Requerimiento 12: Flujo de Tours Personalizados (Custom Tours)

**User Story:** Como visitante, quiero solicitar un tour personalizado llenando un formulario, para recibir una propuesta adaptada a mis intereses.

#### Criterios de Aceptación

1. THE Sistema SHALL renderizar la página Custom Tours siguiendo fielmente la Pantalla_Aprobada de Custom Tours
2. THE Sistema SHALL mostrar un formulario de solicitud con los campos: nombre completo, email, teléfono, fecha preferida, tamaño del grupo, intereses/preferencias y notas adicionales
3. WHEN el visitante envía el formulario con datos válidos, THE Sistema SHALL almacenar la Solicitud_Custom en la base de datos con status "new"
4. WHEN la Solicitud_Custom es almacenada exitosamente, THE Sistema SHALL mostrar un mensaje de confirmación al visitante
5. IF el visitante envía el formulario con campos requeridos vacíos, THEN THE Sistema SHALL mostrar mensajes de validación específicos por campo
6. THE Sistema SHALL separar completamente el flujo de Tour_Personalizado del flujo de checkout de Tour_Fijo

### Requerimiento 13: Correos Transaccionales

**User Story:** Como visitante, quiero recibir un correo de confirmación después de reservar, para tener un comprobante con los detalles de mi tour.

#### Criterios de Aceptación

1. WHEN una Reserva es confirmada (payment_status cambia a "paid"), THE Sistema SHALL enviar un correo de confirmación al customer_email usando Resend
2. THE Sistema SHALL incluir en el correo de confirmación: nombre del tour, fecha, hora, guest_count, total pagado, punto de encuentro y próximos pasos
3. WHEN una Solicitud_Custom es creada, THE Sistema SHALL enviar un correo de notificación al administrador con: información del cliente, fecha preferida, tamaño del grupo, intereses y notas
4. IF el envío de correo falla, THEN THE Sistema SHALL registrar el error en logs sin afectar el estado de la Reserva o Solicitud_Custom

### Requerimiento 14: Integración Opcional con Google Calendar

**User Story:** Como operador, quiero que las reservas confirmadas se sincronicen con Google Calendar, para tener visibilidad operativa de los tours programados.

#### Criterios de Aceptación

1. WHERE la integración con Google Calendar esté habilitada, WHEN una Reserva es confirmada, THE Sistema SHALL crear un evento en Google Calendar
2. WHERE la integración con Google Calendar esté habilitada, THE Sistema SHALL incluir en el evento: nombre del tour, nombre del cliente, resumen de la reserva, y fecha/hora de la Salida
3. THE Sistema SHALL usar Supabase como fuente de verdad para disponibilidad y capacidad, independientemente del estado de Google Calendar
4. IF la creación del evento en Google Calendar falla, THEN THE Sistema SHALL registrar el error en logs sin afectar el estado de la Reserva

### Requerimiento 15: Panel de Administración — Gestión de Tours

**User Story:** Como administrador, quiero gestionar los tours desde un panel interno, para crear, editar, publicar y despublicar tours sin intervención técnica.

#### Criterios de Aceptación

1. THE Admin SHALL permitir crear un tour nuevo con todos los campos del modelo de datos de tours
2. THE Admin SHALL permitir editar cualquier campo de un tour existente
3. THE Admin SHALL permitir cambiar el estado published de un tour (publicar/despublicar)
4. THE Admin SHALL permitir marcar un tour como featured
5. THE Admin SHALL permitir cambiar el precio base de un tour
6. THE Admin SHALL permitir actualizar imágenes (portada y galería) de un tour
7. THE Admin SHALL permitir cambiar el tipo de un tour (shared, private, custom)
8. THE Admin SHALL permitir desactivar un tour (active = false) para ocultarlo del público

### Requerimiento 16: Panel de Administración — Gestión de Salidas

**User Story:** Como administrador, quiero gestionar las salidas de cada tour, para controlar fechas, horarios y capacidad de cada ocurrencia.

#### Criterios de Aceptación

1. THE Admin SHALL permitir crear una Salida nueva asociada a un tour, especificando fecha, hora y capacidad
2. THE Admin SHALL permitir editar la fecha y hora de una Salida existente
3. THE Admin SHALL permitir modificar la capacidad de una Salida
4. THE Admin SHALL permitir actualizar manualmente los Lugares_Restantes de una Salida
5. THE Admin SHALL permitir ocultar una Salida (hidden = true)
6. THE Admin SHALL permitir marcar manualmente una Salida como sold_out
7. THE Admin SHALL permitir duplicar una Salida existente para crear rápidamente nuevas ocurrencias

### Requerimiento 17: Panel de Administración — Gestión de Reservas

**User Story:** Como administrador, quiero ver y gestionar las reservas, para tener control operativo sobre las ventas.

#### Criterios de Aceptación

1. THE Admin SHALL mostrar un listado de todas las Reservas
2. THE Admin SHALL permitir filtrar Reservas por payment_status
3. THE Admin SHALL permitir filtrar Reservas por fecha de la Salida
4. THE Admin SHALL permitir ver el detalle completo de una Reserva individual
5. THE Admin SHALL permitir marcar manualmente una Reserva como cancelled

### Requerimiento 18: Panel de Administración — Gestión de Solicitudes Custom

**User Story:** Como administrador, quiero ver y gestionar las solicitudes de tours personalizados, para dar seguimiento a los leads.

#### Criterios de Aceptación

1. THE Admin SHALL mostrar un listado de todas las Solicitudes_Custom
2. THE Admin SHALL permitir actualizar el status de una Solicitud_Custom (new, contacted, closed)
3. THE Admin SHALL mostrar la información completa de cada Solicitud_Custom

### Requerimiento 19: Componentes Reutilizables

**User Story:** Como desarrollador, quiero componentes UI reutilizables, para mantener consistencia visual y reducir duplicación de código.

#### Criterios de Aceptación

1. THE Sistema SHALL implementar los siguientes componentes reutilizables: Navbar, Footer, Tour Card, Metadata/Fact Chips, Price Block, Booking Module, Availability Selector, FAQ Accordion, Testimonial Card, Form Fields, CTA Buttons y Confirmation Summary Block
2. THE Sistema SHALL construir cada componente siguiendo el estilo visual de las Pantallas_Aprobadas (Kelly Green #4CBB17, Space Grotesk para títulos, Inter para cuerpo, glassmorphism, layouts asimétricos)
3. THE Sistema SHALL asegurar que cada componente sea responsive y funcione correctamente en móvil y escritorio

### Requerimiento 20: Lógica de Capacidad y Estado Agotado

**User Story:** Como operador, quiero que la capacidad se gestione automáticamente por salida, para evitar sobreventa y reflejar disponibilidad real.

#### Criterios de Aceptación

1. THE Sistema SHALL gestionar la Capacidad exclusivamente a nivel de Salida (no a nivel de tour global)
2. WHEN una Reserva es confirmada, THE Sistema SHALL reducir los Lugares_Restantes de la Salida correspondiente en la cantidad de guest_count
3. WHEN los Lugares_Restantes de una Salida llegan a 0, THE Sistema SHALL marcar automáticamente la Salida como sold_out
4. WHEN una Salida está marcada como sold_out, THE Sistema SHALL impedir la creación de nuevas Reservas para esa Salida
5. WHEN una Salida está marcada como hidden, THE Sistema SHALL excluir esa Salida de la vista pública
6. WHEN un tour no tiene Salidas activas y visibles con Lugares_Restantes mayores a 0, THE Sistema SHALL reflejar que el tour no tiene disponibilidad en la vista pública

### Requerimiento 21: SEO y Rendimiento

**User Story:** Como operador, quiero que el sitio sea indexable y rápido, para atraer tráfico orgánico y ofrecer buena experiencia de usuario.

#### Criterios de Aceptación

1. THE Sistema SHALL generar meta tags (title, description, og:image) dinámicos para cada página de tour
2. THE Sistema SHALL usar Server-Side Rendering o Static Site Generation de Next.js para las páginas públicas
3. THE Sistema SHALL optimizar las imágenes usando el componente Image de Next.js

### Requerimiento 22: Datos Semilla (Seed Data)

**User Story:** Como desarrollador, quiero datos iniciales realistas en el sistema, para poder probar y demostrar el sitio desde el primer despliegue.

#### Criterios de Aceptación

1. THE Sistema SHALL incluir un script de seed que cree los 4 tours iniciales con contenido realista de CDMX
2. THE Sistema SHALL crear al menos 2 Salidas por cada Tour_Fijo en el seed, con fechas futuras y capacidad definida
3. THE Sistema SHALL usar contenido placeholder realista (descripciones, highlights, FAQ) que pueda editarse posteriormente desde el Admin
