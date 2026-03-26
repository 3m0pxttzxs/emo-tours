# Plan de Implementación: Auto-generación de Departures

## Resumen

Implementar la generación automática de departures al crear/actualizar tours, incluyendo la función pura de cálculo de fechas, funciones de servidor con protección de departures existentes, integración en los endpoints de la API de tours, y mejoras visuales en el calendario (resaltado de hoy, atenuación de pasado).

## Tareas

- [x] 1. Implementar función pura `computeDepartureDates` y constante de horizonte
  - [x] 1.1 Crear módulo `src/lib/departures/generate.ts` con la constante `DEFAULT_HORIZON_MONTHS = 3` y la función `computeDepartureDates`
    - Recibe `weekday` (0-6), `startDate` (Date), `horizonMonths` (number)
    - Calcula `endDate = startDate + horizonMonths` meses
    - Itera desde el primer día >= startDate cuyo `getDay() === weekday`, avanzando 7 días
    - Retorna array de strings `"YYYY-MM-DD"`
    - Retorna array vacío si weekday fuera de rango (< 0 o > 6) o horizonMonths <= 0
    - _Requisitos: 1.1, 3.1, 3.2, 3.3_

  - [x] 1.2 Escribir test de propiedad para `computeDepartureDates` — Propiedad 1
    - **Propiedad 1: Todas las fechas generadas coinciden con el weekday y caen dentro del horizonte**
    - Generar weekday aleatorio (0-6), startDate aleatoria, horizonMonths aleatorio (1-12)
    - Verificar que todas las fechas cumplen `getDay() === weekday` y están en rango [startDate, startDate + horizonMonths)
    - **Valida: Requisitos 1.1, 2.2, 3.3**

  - [x] 1.3 Escribir tests unitarios para `computeDepartureDates`
    - Caso: weekday=1 (lunes) desde un lunes → incluye ese lunes
    - Caso: weekday=0 (domingo) desde un miércoles → primer domingo siguiente
    - Caso: horizonMonths=0 → array vacío
    - Caso: weekday=-1 o weekday=7 → array vacío
    - Verificar que `DEFAULT_HORIZON_MONTHS === 3`
    - _Requisitos: 1.1, 3.1_

- [x] 2. Implementar funciones de servidor `generateDeparturesForTour` y `regenerateDepartures`
  - [x] 2.1 Implementar `generateDeparturesForTour` en `src/lib/departures/generate.ts`
    - Llama a `computeDepartureDates` con startDate = mañana
    - Consulta departures existentes del tour para las fechas calculadas
    - Filtra fechas que ya tienen departure (evita duplicados)
    - Inserta batch con: `tour_id`, `date`, `time=departureTime`, `capacity=capacityDefault`, `spots_left=capacityDefault`, `active=true`, `sold_out=false`, `hidden=false`
    - Retorna `{ created: number }`
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 4.4_

  - [x] 2.2 Implementar `regenerateDepartures` en `src/lib/departures/generate.ts`
    - Consulta departures del tour con fecha > hoy
    - Identifica eliminables: `spots_left === capacity` (sin reservas)
    - Elimina las eliminables
    - Si `newWeekday` y `newDepartureTime` son no nulos, llama a `generateDeparturesForTour`
    - Si alguno es null, solo elimina sin generar
    - Retorna `{ deleted: number, created: number }`
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 4.3_

  - [x] 2.3 Escribir test de propiedad — Propiedad 2: Valores por defecto correctos
    - **Propiedad 2: Todas las departures generadas tienen valores por defecto correctos**
    - Generar capacity_default aleatorio (1-100), departure_time aleatorio ("HH:MM")
    - Verificar que cada departure tiene `capacity === capacityDefault`, `spots_left === capacityDefault`, `time === departureTime`, `active === true`, `sold_out === false`, `hidden === false`
    - **Valida: Requisitos 1.2, 1.3, 1.4, 1.5**

  - [x] 2.4 Escribir test de propiedad — Propiedad 3: Nulos no producen departures
    - **Propiedad 3: Weekday o departure_time nulos no producen departures nuevas**
    - Generar combinaciones donde al menos uno sea null
    - Verificar `created === 0`
    - **Valida: Requisitos 1.6, 2.5**

  - [x] 2.5 Escribir test de propiedad — Propiedad 4: Preservación de departures protegidas
    - **Propiedad 4: La regeneración preserva departures pasadas y con reservas, elimina solo futuras sin reservas**
    - Generar conjunto aleatorio de departures (mezcla de pasadas/futuras, con/sin reservas)
    - Ejecutar regeneración y verificar que pasadas y con reservas sobreviven, futuras sin reservas se eliminan
    - **Valida: Requisitos 2.1, 2.3, 2.4, 4.2, 4.3**

  - [x] 2.6 Escribir test de propiedad — Propiedad 5: Sin duplicados por fecha
    - **Propiedad 5: No se crean departures duplicadas por fecha**
    - Generar fechas existentes aleatorias y ejecutar generación
    - Verificar que no existe más de una departure por fecha para el mismo tour
    - **Valida: Requisito 4.4**

- [x] 3. Checkpoint — Verificar lógica de generación
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Integrar generación automática en endpoints de la API de tours
  - [x] 4.1 Integrar `generateDeparturesForTour` en `POST /api/tours` (`src/app/api/tours/route.ts`)
    - Después de insertar el tour, si `weekday` y `departure_time` son no nulos, llamar a `generateDeparturesForTour`
    - Incluir `departures_created` en la respuesta JSON
    - Si falla la generación, retornar el tour con campo `warning` (no error 500)
    - _Requisitos: 1.1, 1.6, 6.1, 6.3_

  - [x] 4.2 Integrar `regenerateDepartures` en `PUT /api/tours/:id` (`src/app/api/tours/[id]/route.ts`)
    - Antes del update, obtener el tour actual para comparar `weekday` y `departure_time`
    - Si `weekday` o `departure_time` cambiaron, llamar a `regenerateDepartures`
    - Incluir `departures_deleted` y `departures_created` en la respuesta
    - Si falla la regeneración, retornar el tour con campo `warning`
    - _Requisitos: 2.1, 2.2, 2.5, 6.2, 6.3_

  - [x] 4.3 Escribir tests unitarios para la integración de la API
    - Verificar que POST con weekday + departure_time retorna `departures_created`
    - Verificar que POST con weekday null omite generación
    - Verificar que PUT con cambio de weekday retorna `departures_deleted` y `departures_created`
    - Verificar que PUT sin cambio de weekday/departure_time no ejecuta regeneración
    - Verificar que fallo en generación retorna `warning` en la respuesta
    - _Requisitos: 6.1, 6.2, 6.3_

- [x] 5. Checkpoint — Verificar integración API
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implementar mejoras visuales en el calendario
  - [x] 6.1 Agregar props `isToday` e `isPast` a `DateCell` (`src/components/admin/calendar/DateCell.tsx`)
    - `isToday`: aplicar borde verde sólido (`border-[#4CBB17] border-2`) y fondo sutil
    - `isPast`: aplicar opacidad reducida (`opacity-50`), cursor default, deshabilitar toggle (no ejecutar `onToggle` ni `onRangeSelect` al hacer click)
    - _Requisitos: 5.1, 5.2, 5.3_

  - [x] 6.2 Calcular y pasar `isToday` e `isPast` desde `CalendarGrid` (`src/components/admin/calendar/CalendarGrid.tsx`)
    - Calcular `todayStr = formatDateKey(new Date())`
    - Para cada celda: `isToday = dateKey === todayStr`, `isPast = dateKey < todayStr`
    - Pasar ambas props a `DateCell`
    - _Requisitos: 5.1, 5.2, 5.3_

  - [x] 6.3 Escribir test de propiedad — Propiedad 6: Fechas pasadas deshabilitan toggle
    - **Propiedad 6: Fechas pasadas deshabilitan la interacción de toggle**
    - Generar fechas pasadas aleatorias, renderizar DateCell con `isPast=true`, simular click
    - Verificar que `onToggle` no se invoca
    - **Valida: Requisito 5.3**

  - [x] 6.4 Escribir tests unitarios para DateCell y CalendarGrid
    - Verificar que DateCell con `isToday=true` renderiza con clase de borde verde
    - Verificar que DateCell con `isPast=true` renderiza con opacidad reducida
    - Verificar que CalendarGrid pasa correctamente `isToday` e `isPast` a las celdas
    - _Requisitos: 5.1, 5.2_

- [x] 7. Checkpoint final — Verificar implementación completa
  - Ensure all tests pass, ask the user if questions arise.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los tests de propiedad usan `fast-check` (ya instalado en el proyecto)
- Los tests unitarios complementan cubriendo ejemplos específicos y edge cases
