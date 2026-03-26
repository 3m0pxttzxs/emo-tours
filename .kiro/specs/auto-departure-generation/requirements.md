# Documento de Requisitos: Auto-generación de Departures

## Introducción

Cuando se crea o actualiza un tour con los campos `weekday` y `departure_time` definidos, el sistema debe generar automáticamente los registros de departures para los próximos N meses (configurable, por defecto 3). Esto elimina la necesidad de crear departures manualmente uno por uno. Además, al actualizar el día o la hora de un tour, el sistema debe regenerar las departures futuras sin afectar departures pasadas ni aquellas que ya tengan reservas.

## Glosario

- **Sistema**: La aplicación web de EMO Tours CDMX (backend API + frontend admin).
- **Tour**: Entidad que representa un recorrido turístico. Contiene los campos `weekday` (0=Dom...6=Sáb, nullable), `departure_time` (ej. "10:00", nullable) y `capacity_default`.
- **Departure**: Registro individual de una salida programada para un tour, con campos `tour_id`, `date`, `time`, `capacity`, `spots_left`, `active`, `sold_out`, `hidden`.
- **Departure_con_reservas**: Una departure cuyo valor de `spots_left` es menor que su `capacity`, indicando que al menos una reserva ha sido realizada.
- **Horizonte_de_generación**: Cantidad de meses hacia el futuro para los cuales se generan departures automáticamente. Valor por defecto: 3 meses.
- **Generador_de_departures**: Función del servidor que calcula las fechas futuras correspondientes al `weekday` del tour y crea los registros de departure.
- **Calendario_de_departures**: Componente visual (DepartureCalendar) que muestra las departures de un tour en una grilla mensual.

## Requisitos

### Requisito 1: Generación automática al crear un tour

**User Story:** Como administrador, quiero que al crear un tour con día de la semana y hora de salida definidos, se generen automáticamente las departures futuras, para no tener que crearlas manualmente.

#### Criterios de Aceptación

1. WHEN un tour es creado con `weekday` y `departure_time` no nulos, THE Generador_de_departures SHALL crear registros de departure para cada fecha que coincida con el `weekday` del tour dentro del Horizonte_de_generación a partir de la fecha actual.
2. THE Generador_de_departures SHALL asignar a cada departure generada el valor de `capacity` igual al `capacity_default` del tour.
3. THE Generador_de_departures SHALL asignar a cada departure generada el valor de `spots_left` igual al `capacity_default` del tour.
4. THE Generador_de_departures SHALL asignar a cada departure generada el valor de `time` igual al `departure_time` del tour.
5. THE Generador_de_departures SHALL asignar a cada departure generada los valores `active = true`, `sold_out = false` y `hidden = false`.
6. WHEN un tour es creado con `weekday` nulo o `departure_time` nulo, THE Generador_de_departures SHALL omitir la generación automática de departures.

### Requisito 2: Regeneración al actualizar un tour

**User Story:** Como administrador, quiero que al cambiar el día de la semana o la hora de salida de un tour, las departures futuras se regeneren automáticamente, para mantener el calendario actualizado sin intervención manual.

#### Criterios de Aceptación

1. WHEN el campo `weekday` o `departure_time` de un tour es actualizado, THE Generador_de_departures SHALL eliminar todas las departures futuras (fecha posterior a hoy) del tour que no sean Departure_con_reservas.
2. WHEN el campo `weekday` o `departure_time` de un tour es actualizado y ambos campos son no nulos, THE Generador_de_departures SHALL crear nuevos registros de departure para cada fecha que coincida con el nuevo `weekday` dentro del Horizonte_de_generación a partir de la fecha actual.
3. WHEN el campo `weekday` o `departure_time` de un tour es actualizado, THE Generador_de_departures SHALL preservar todas las departures cuya fecha sea igual o anterior a la fecha actual.
4. WHEN el campo `weekday` o `departure_time` de un tour es actualizado, THE Generador_de_departures SHALL preservar todas las Departure_con_reservas independientemente de su fecha.
5. WHEN el campo `weekday` o `departure_time` de un tour es actualizado y el nuevo `weekday` o `departure_time` es nulo, THE Generador_de_departures SHALL eliminar las departures futuras sin reservas y no generar nuevas departures.

### Requisito 3: Horizonte de generación configurable

**User Story:** Como administrador, quiero poder configurar cuántos meses hacia el futuro se generan las departures, para adaptar la planificación según la temporada.

#### Criterios de Aceptación

1. THE Sistema SHALL utilizar un valor de Horizonte_de_generación de 3 meses por defecto.
2. THE Sistema SHALL permitir configurar el Horizonte_de_generación mediante una constante en el código del servidor.
3. WHEN el Horizonte_de_generación es modificado, THE Generador_de_departures SHALL aplicar el nuevo valor en la siguiente ejecución de generación automática.

### Requisito 4: Protección de departures pasadas y con reservas

**User Story:** Como administrador, quiero que las departures pasadas y las que tienen reservas no sean modificadas ni eliminadas por la generación automática, para proteger el historial y las reservas existentes.

#### Criterios de Aceptación

1. THE Generador_de_departures SHALL identificar una departure como Departure_con_reservas cuando `spots_left` sea menor que `capacity`.
2. THE Generador_de_departures SHALL excluir de eliminación toda departure cuya fecha sea igual o anterior a la fecha actual.
3. THE Generador_de_departures SHALL excluir de eliminación toda Departure_con_reservas.
4. IF el Generador_de_departures intenta generar una departure para una fecha en la que ya existe una departure para el mismo tour, THEN THE Generador_de_departures SHALL omitir la creación de esa departure duplicada.

### Requisito 5: Indicador visual de fecha actual en el calendario

**User Story:** Como administrador, quiero ver claramente cuál es el día de hoy en el calendario de departures, para tener contexto temporal al gestionar las salidas.

#### Criterios de Aceptación

1. THE Calendario_de_departures SHALL resaltar visualmente la celda correspondiente a la fecha actual con un borde o fondo diferenciado.
2. THE Calendario_de_departures SHALL aplicar un estilo visual atenuado (opacidad reducida o color gris) a todas las celdas de fechas anteriores a la fecha actual.
3. WHILE una fecha es anterior a la fecha actual, THE Calendario_de_departures SHALL deshabilitar la interacción de toggle (ocultar/mostrar) en la celda correspondiente.

### Requisito 6: Respuesta de la API al crear/actualizar tours

**User Story:** Como desarrollador frontend, quiero que la API de tours devuelva información sobre las departures generadas, para poder mostrar feedback al administrador.

#### Criterios de Aceptación

1. WHEN un tour es creado o actualizado y se ejecuta la generación automática, THE Sistema SHALL incluir en la respuesta de la API el conteo de departures generadas.
2. WHEN un tour es actualizado y se ejecuta la regeneración, THE Sistema SHALL incluir en la respuesta de la API el conteo de departures eliminadas y el conteo de departures generadas.
3. IF la generación automática falla parcialmente, THEN THE Sistema SHALL retornar el tour actualizado junto con un mensaje de advertencia indicando el error en la generación de departures.
