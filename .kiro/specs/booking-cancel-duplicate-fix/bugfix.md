# Documento de Requisitos de Bugfix

## Introducción

Al cancelar una reserva desde la página de administración (`/admin/bookings`), la fila se duplica visualmente en la tabla y la cancelación no se refleja correctamente en la UI. Tras refrescar la página, el estado real del servidor es correcto (la reserva sí se canceló), pero la experiencia del usuario es confusa y errónea. La causa raíz es que `handleCancel` llama a `fetchBookings()` después del PUT exitoso, y `fetchBookings()` aplica filtros del servidor vía query params y luego reemplaza el array completo de `bookings` con solo el subconjunto filtrado. Posteriormente, el filtrado cliente (`filtered`) se aplica de nuevo sobre datos ya filtrados, causando inconsistencias de estado y duplicación visual.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN el usuario cancela una reserva mientras hay filtros activos (payment_status o date) THEN el sistema reemplaza el estado completo de `bookings` con solo el subconjunto filtrado del servidor, y el filtrado cliente se aplica de nuevo sobre datos ya filtrados, causando duplicación visual de filas en la tabla

1.2 WHEN el usuario cancela una reserva (con o sin filtros) THEN el sistema no actualiza optimistamente el estado local, sino que depende de un re-fetch que introduce una condición de carrera entre el estado previo y los nuevos datos, mostrando datos obsoletos junto con datos nuevos durante la transición de React

1.3 WHEN el usuario cancela una reserva y la UI muestra filas duplicadas THEN el sistema no refleja el nuevo estado "cancelled" de la reserva en la interfaz hasta que se recarga la página manualmente

### Expected Behavior (Correct)

2.1 WHEN el usuario cancela una reserva mientras hay filtros activos THEN el sistema SHALL actualizar el estado local de la reserva a "cancelled" sin re-fetchear la lista completa, evitando la duplicación visual

2.2 WHEN el usuario cancela una reserva (con o sin filtros) THEN el sistema SHALL actualizar optimistamente el booking en el array local de `bookings` usando la respuesta del PUT, eliminando cualquier condición de carrera

2.3 WHEN el usuario cancela una reserva exitosamente THEN el sistema SHALL reflejar inmediatamente el estado "cancelled" en el badge de estado de esa fila, y el botón "Cancel" SHALL desaparecer de esa fila

### Unchanged Behavior (Regression Prevention)

3.1 WHEN el usuario cancela una reserva THEN el sistema SHALL CONTINUE TO enviar un PUT a `/api/bookings/{id}` con `{ booking_status: "cancelled" }` y persistir el cambio en el servidor

3.2 WHEN el usuario aplica filtros de payment_status o fecha THEN el sistema SHALL CONTINUE TO filtrar las reservas correctamente en la tabla según los criterios seleccionados

3.3 WHEN el usuario no tiene filtros activos y cancela una reserva THEN el sistema SHALL CONTINUE TO mostrar todas las reservas en la tabla con sus estados actualizados

3.4 WHEN el usuario hace clic en "Cancel" THEN el sistema SHALL CONTINUE TO mostrar el diálogo de confirmación antes de proceder con la cancelación

3.5 WHEN la petición PUT falla THEN el sistema SHALL CONTINUE TO no modificar el estado de la reserva en la UI
