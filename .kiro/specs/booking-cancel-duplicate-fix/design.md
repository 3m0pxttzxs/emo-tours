# Corrección de Duplicación al Cancelar Reserva — Diseño de Bugfix

## Resumen

Al cancelar una reserva desde el panel de administración, `handleCancel` llama a `fetchBookings()` tras el PUT exitoso. `fetchBookings()` re-obtiene las reservas del servidor aplicando filtros vía query params y reemplaza el estado completo de `bookings`. Esto causa duplicación visual porque el filtrado cliente (`filtered`) se aplica de nuevo sobre datos ya filtrados por el servidor. La corrección reemplaza el re-fetch con una actualización optimista local del estado usando la respuesta del PUT.

## Glosario

- **Bug_Condition (C)**: La condición que dispara el bug — cancelar una reserva cuando `handleCancel` llama a `fetchBookings()` después del PUT exitoso
- **Property (P)**: El comportamiento deseado — actualizar localmente el booking cancelado en el array de estado sin re-fetchear
- **Preservation**: El comportamiento existente que no debe cambiar — PUT al servidor, filtrado cliente, diálogo de confirmación, manejo de errores
- **handleCancel**: La función en `BookingsManager.tsx` que ejecuta la cancelación de una reserva
- **fetchBookings**: La función que obtiene reservas del servidor con filtros y reemplaza el estado local
- **BookingWithRelations**: Tipo que extiende `Booking` con relaciones `tours` y `departures`

## Detalles del Bug

### Condición del Bug

El bug se manifiesta cuando el usuario cancela una reserva desde la tabla de administración. Tras el PUT exitoso, `handleCancel` llama a `fetchBookings()`, que:
1. Envía un GET con filtros activos como query params al servidor
2. Reemplaza todo el array `bookings` con la respuesta (subconjunto filtrado)
3. El filtrado cliente en `filtered` se aplica de nuevo, causando inconsistencias

**Especificación Formal:**
```
FUNCTION isBugCondition(input)
  INPUT: input de tipo { action: string, bookingId: string, hasActiveFilters: boolean }
  OUTPUT: boolean

  RETURN input.action == "cancel"
         AND putRequestSucceeded(input.bookingId)
         AND fetchBookingsIsCalledAfterPut()
END FUNCTION
```

### Ejemplos

- El usuario cancela booking "B1" sin filtros activos → `fetchBookings()` reemplaza el estado con todos los bookings del servidor, pero durante la transición React muestra datos obsoletos junto con nuevos, causando duplicación momentánea
- El usuario cancela booking "B1" con filtro `payment_status=paid` → `fetchBookings()` trae solo bookings "paid" del servidor y reemplaza el estado completo, perdiendo bookings con otros estados que estaban en memoria
- El usuario cancela booking "B1" con filtro de fecha → mismo problema: el estado se reemplaza con un subconjunto, y el filtrado cliente re-filtra sobre datos ya filtrados
- El usuario cancela booking "B1" y el PUT falla → no hay bug porque `fetchBookings()` no se ejecuta (comportamiento correcto)

## Comportamiento Esperado

### Requisitos de Preservación

**Comportamientos que NO deben cambiar:**
- El PUT a `/api/bookings/{id}` con `{ booking_status: "cancelled" }` debe seguir enviándose al servidor
- El filtrado cliente por `payment_status` y `date` debe seguir funcionando correctamente
- El diálogo de confirmación (`confirm()`) debe seguir apareciendo antes de cancelar
- Si el PUT falla, el estado local no debe modificarse
- El indicador de `loading` debe seguir activándose/desactivándose correctamente

**Alcance:**
Todas las interacciones que NO involucren la cancelación de una reserva deben permanecer completamente inalteradas. Esto incluye:
- Visualización de la tabla de bookings
- Filtrado por payment_status y fecha
- Expansión/colapso de filas
- Formato de moneda y badges de estado

## Causa Raíz Hipotética

Basado en el análisis del bug, la causa raíz es:

1. **Re-fetch innecesario con filtros del servidor**: `handleCancel` llama a `fetchBookings()` que envía un GET con `filterPaymentStatus` y `filterDate` como query params. El servidor devuelve solo el subconjunto que coincide con esos filtros, y `setBookings(data)` reemplaza todo el estado local con ese subconjunto.

2. **Doble filtrado**: Después de que `setBookings` reemplaza el estado, el memo `filtered` aplica los mismos filtros de nuevo sobre datos ya filtrados por el servidor, causando inconsistencias en la renderización.

3. **Condición de carrera en React**: Durante la transición entre el estado previo y el nuevo estado (post-fetch), React puede renderizar un estado intermedio que combina datos viejos y nuevos, mostrando filas duplicadas.

La solución es eliminar la llamada a `fetchBookings()` en `handleCancel` y reemplazarla con una actualización optimista local: usar `setBookings(prev => prev.map(...))` para reemplazar solo el booking cancelado con los datos de la respuesta del PUT.

## Propiedades de Correctitud

Property 1: Bug Condition — Actualización optimista al cancelar

_Para cualquier_ reserva que se cancele exitosamente (PUT retorna 200), la función `handleCancel` corregida SHALL actualizar el booking en el array local de `bookings` usando los datos de la respuesta del PUT, sin llamar a `fetchBookings()`, de modo que el estado "cancelled" se refleje inmediatamente en la UI sin duplicación.

**Valida: Requisitos 2.1, 2.2, 2.3**

Property 2: Preservation — Comportamiento sin cancelación

_Para cualquier_ interacción que NO sea una cancelación exitosa de reserva (filtrado, expansión de filas, visualización, PUT fallido), la función corregida SHALL producir exactamente el mismo comportamiento que el código original, preservando el filtrado cliente, los badges de estado, el diálogo de confirmación y el manejo de errores.

**Valida: Requisitos 3.1, 3.2, 3.3, 3.4, 3.5**

## Implementación del Fix

### Cambios Requeridos

Asumiendo que nuestro análisis de causa raíz es correcto:

**Archivo**: `src/components/admin/BookingsManager.tsx`

**Función**: `handleCancel`

**Cambios Específicos**:
1. **Eliminar llamada a `fetchBookings()`**: Remover `await fetchBookings()` del bloque `if (res.ok)`
2. **Parsear respuesta del PUT**: Obtener el booking actualizado de la respuesta con `await res.json()`
3. **Actualización optimista del estado**: Usar `setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b))` para reemplazar solo el booking cancelado en el array local
4. **Preservar relaciones**: La API PUT ya retorna `*, tours(title), departures(date, time)`, así que la respuesta incluye las relaciones necesarias para `BookingWithRelations`

## Estrategia de Testing

### Enfoque de Validación

La estrategia de testing sigue un enfoque de dos fases: primero, verificar que el bug se reproduce en el código sin corregir, luego verificar que el fix funciona correctamente y preserva el comportamiento existente.

### Verificación Exploratoria de la Condición del Bug

**Objetivo**: Demostrar el bug ANTES de implementar el fix. Confirmar o refutar el análisis de causa raíz.

**Plan de Test**: Simular la cancelación de una reserva con y sin filtros activos, verificando que `fetchBookings()` se llama y causa duplicación.

**Casos de Test**:
1. **Cancelación con filtro activo**: Cancelar una reserva con `filterPaymentStatus` activo (fallará en código sin corregir)
2. **Cancelación sin filtros**: Cancelar una reserva sin filtros activos (puede mostrar duplicación momentánea)
3. **Verificación de estado post-cancelación**: Verificar que el badge de estado no cambia a "cancelled" correctamente

**Contraejemplos Esperados**:
- El estado `bookings` se reemplaza con un subconjunto filtrado del servidor
- Filas duplicadas aparecen en la tabla tras cancelar

### Verificación del Fix

**Objetivo**: Verificar que para todas las cancelaciones exitosas, la función corregida actualiza el estado local correctamente.

**Pseudocódigo:**
```
PARA TODO input DONDE isBugCondition(input) HACER
  resultado := handleCancel_corregido(input)
  ASSERT booking.booking_status == "cancelled"
  ASSERT no se llamó a fetchBookings()
  ASSERT no hay filas duplicadas en el estado
FIN PARA
```

### Verificación de Preservación

**Objetivo**: Verificar que para todas las interacciones que NO son cancelación, el comportamiento es idéntico al original.

**Pseudocódigo:**
```
PARA TODO input DONDE NOT isBugCondition(input) HACER
  ASSERT handleCancel_original(input) == handleCancel_corregido(input)
FIN PARA
```

**Enfoque de Testing**: Se recomienda testing basado en propiedades para la verificación de preservación porque:
- Genera muchos casos de test automáticamente
- Detecta edge cases que tests manuales podrían omitir
- Provee garantías fuertes de que el comportamiento no cambió

**Plan de Test**: Observar el comportamiento del código sin corregir para filtrado y visualización, luego escribir tests que capturen ese comportamiento.

**Casos de Test**:
1. **Preservación de filtrado**: Verificar que filtrar por payment_status y fecha sigue funcionando
2. **Preservación de confirmación**: Verificar que el diálogo de confirmación sigue apareciendo
3. **Preservación de error**: Verificar que si el PUT falla, el estado no se modifica
4. **Preservación de loading**: Verificar que el indicador de loading se activa/desactiva correctamente

### Unit Tests

- Test de actualización optimista del estado tras cancelación exitosa
- Test de que `fetchBookings()` no se llama en `handleCancel`
- Test de que el PUT fallido no modifica el estado

### Property-Based Tests

- Generar estados aleatorios de bookings y verificar que la cancelación actualiza solo el booking correcto
- Generar configuraciones aleatorias de filtros y verificar que el filtrado cliente sigue funcionando post-fix

### Integration Tests

- Test de flujo completo: cancelar reserva y verificar que la UI refleja el cambio inmediatamente
- Test de cancelar múltiples reservas secuencialmente sin duplicación
