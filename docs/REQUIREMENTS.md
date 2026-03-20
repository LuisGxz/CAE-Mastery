# CAE Mastery System — Documentación de Requerimientos

> Versión: 1.0
> Fecha: 2026-03-20
> Estado: Activo en desarrollo

---

## 1. Descripción General

**CAE Mastery System** es una aplicación web personal de tipo SPA (Single Page Application) diseñada para planificar, rastrear y gestionar la preparación para el examen **Cambridge Advanced English (CAE / C1 Advanced)**.

La aplicación funciona completamente en el navegador (sin backend), persiste los datos en `localStorage`, y es instalable como PWA (Progressive Web App) para uso offline.

---

## 2. Contexto del Proyecto

| Campo | Detalle |
|---|---|
| Idioma de la interfaz | Español |
| Examen objetivo | Cambridge C1 Advanced (CAE) |
| Fecha de inicio | 23 de marzo de 2026 |
| Fecha de examen | 26 de septiembre de 2026 |
| Duración del plan | 27 semanas |
| Plataforma | Web (SPA) + PWA instalable |
| Persistencia | localStorage (clave: `cae-mastery-v4`) |

---

## 3. Habilidades Evaluadas

El examen CAE evalúa 5 habilidades. La aplicación rastrea puntuaciones sobre 200 para cada una:

| Habilidad | Puntuación Actual | Objetivo |
|---|---|---|
| Reading | 186 / 200 | ≥ 180 |
| Use of English | 151 / 200 | ≥ 180 |
| Writing | 161 / 200 | ≥ 180 |
| Listening | 165 / 200 | ≥ 180 |
| Speaking | 151 / 200 | ≥ 180 |

---

## 4. Plan de Estudio (27 Semanas / 7 Fases)

| Fase | Semanas | Objetivo |
|---|---|---|
| 1 | 1–6 | Cerrar brechas críticas (prioridad: UoE y Speaking) |
| 2 | 7–12 | Alcanzar nivel C1 (consolidar todas las habilidades) |
| 3 | 13–16 | Consolidar C1 (simulacros semanales) |
| 4 | 17–20 | Dominar C1 (exámenes de práctica completos) |
| 5 | 21–24 | Sobreentrenamiento C2 (material CPE) |
| 6 | 25–26 | Vuelta al CAE (ahora más fácil post-C2) |
| 7 | 27 | Tapering (repaso ligero y descanso) |

Cada semana tiene un plan detallado con tareas diarias (5 días de semana + sábado opcional). Cada tarea especifica la habilidad trabajada y la técnica de aprendizaje aplicada.

---

## 5. Módulos Funcionales (Tabs)

### 5.1 Home
- Mostrar countdown de días restantes hasta el examen.
- Mostrar semana actual del plan.
- Mostrar estado de cada habilidad con puntuación y barra de progreso.
- Mostrar gráfico SVG de evolución de puntuaciones por semana.
- Mostrar porcentaje global de completitud de tareas.
- Mostrar recordatorios programados (registro del examen, transiciones de fase).

### 5.2 Plan Semanal
- Seleccionar semana del plan (1–27).
- Ver las tareas diarias de la semana seleccionada con técnica de aprendizaje asociada.
- Marcar tareas individuales como completadas.
- Persistir estado de completitud por tarea y por día.
- Mostrar porcentaje de avance diario y semanal.

### 5.3 Tracker de Puntuaciones
- Ingresar puntuaciones de práctica por habilidad y por semana.
- Visualizar historial de puntuaciones semana a semana.
- Calcular y mostrar el progreso relativo a los objetivos.

### 5.4 Banco de Errores
- Registrar errores cometidos en práctica con campos: descripción, categoría (Grammar, Vocabulary, Pronunciation, etc.), habilidad asociada.
- Marcar errores como "dominados" una vez corregidos.
- Filtrar errores por categoría o habilidad.
- Mostrar conteo de errores activos vs. dominados.

### 5.5 Diario de Estudio
- Registrar entradas de diario por fecha.
- Seleccionar estado de ánimo (mood) para cada entrada.
- Registrar minutos de estudio del día.
- Ver historial de entradas ordenado por fecha.

### 5.6 Repetición Espaciada (SR — Spaced Repetition)
- Crear tarjetas de flashcard con frente y reverso.
- Implementar el algoritmo SM-2 para programar revisiones.
- Mostrar tarjetas que tienen revisión pendiente hoy (componente `DueCard`).
- Calificar cada revisión con escala de 0–5 para ajustar el intervalo.
- Mostrar estadísticas: total de tarjetas, pendientes hoy, próximas 7 días.

### 5.7 Shadowing
- Registrar sesiones de práctica de shadowing.
- Campos: fecha, texto/audio utilizado, minutos practicados, notas.
- Ver historial de sesiones de shadowing.
- Acumular total de minutos de shadowing practicados.

### 5.8 Output (Producción)
- Registrar prácticas de producción escrita y oral.
- Campos: fecha, tipo (writing / speaking), tarea practicada, notas.
- Ver historial de prácticas de output.
- Acumular total de minutos de producción practicados.

### 5.9 Configuración (Config)
- Exportar todos los datos del estado como archivo JSON (backup).
- Importar datos desde un archivo JSON previamente exportado.
- Resetear el estado de la aplicación a valores por defecto.
- Visualizar información de la versión de datos.

---

## 6. Requerimientos No Funcionales

### 6.1 Rendimiento
- La aplicación debe cargar en menos de 2 segundos en una red estándar.
- El auto-guardado a localStorage debe estar debounced (≤ 500ms) para no bloquear la UI.
- Los datos del gráfico SVG deben renderizarse sin dependencias externas de charting.

### 6.2 Persistencia y Datos
- Todo el estado se persiste en `localStorage` bajo la clave `cae-mastery-v4`.
- El usuario puede exportar su estado completo como `.json` para respaldo manual.
- El usuario puede importar un archivo `.json` para restaurar su estado.
- La aplicación debe manejar errores de lectura/escritura en localStorage sin crashear.

### 6.3 Experiencia de Usuario
- Interfaz completamente en español.
- Tema oscuro como predeterminado (fondo: `#0f172a`).
- Diseño responsivo con soporte para móvil (breakpoint: 640px).
- Feedback visual inmediato al marcar tareas o interactuar con tarjetas SR.

### 6.4 Accesibilidad y Compatibilidad
- Compatible con navegadores modernos (Chrome, Firefox, Edge, Safari).
- Instalable como PWA (Progressive Web App) en dispositivos móviles y de escritorio.
- Soporte offline mediante Service Worker (estrategia: auto-update).

### 6.5 Mantenibilidad
- Código en JavaScript con React 19 (sin TypeScript actualmente).
- Build tool: Vite 7.x.
- Linting con ESLint 9 en formato flat config.

---

## 7. Estado de la Arquitectura Actual

| Aspecto | Estado |
|---|---|
| Framework | React 19 + Vite 7 |
| Estilo | CSS puro (App.css + index.css) con variables CSS |
| Estado | useState local + localStorage |
| Componentes | Monolítico (App.jsx ~12,000 líneas) |
| Router | Sin router (tab navigation manual con estado) |
| Backend | Ninguno |
| Tests | Ninguno |
| CI/CD | Ninguno |

---

## 8. Deuda Técnica Conocida

1. **Monolito**: `App.jsx` tiene ~12,000 líneas. Toda la lógica de los 9 módulos está en un solo archivo.
2. **Sin TypeScript**: El proyecto usa JavaScript puro; no hay tipado estático.
3. **Sin tests**: No hay tests unitarios ni de integración.
4. **Sin router**: La navegación entre tabs se gestiona con un estado `activeTab` manual en lugar de react-router.
5. **Sin gestión de estado escalable**: No se usa Context API, Zustand, ni ninguna solución de estado global; todo pasa por `useState` + prop drilling implícito.
6. **Estilos mezclados**: Se mezclan estilos en línea (`style={{ ... }}`) con clases CSS en el mismo componente.
7. **Sin documentación de código**: No hay JSDoc ni comentarios descriptivos en funciones clave.

---

## 9. Glosario

| Término | Definición |
|---|---|
| CAE | Cambridge C1 Advanced — examen de inglés de nivel C1 del MCER |
| SR | Spaced Repetition — repetición espaciada para memorización a largo plazo |
| SM-2 | Algoritmo de repetición espaciada utilizado por Anki y similares |
| Shadowing | Técnica de aprendizaje de idiomas que consiste en repetir en tiempo real el habla de un hablante nativo |
| Output | Producción activa del idioma (escritura o habla) como técnica de aprendizaje |
| PWA | Progressive Web App — aplicación web instalable con soporte offline |
| SPA | Single Page Application — aplicación de una sola página |
| UoE | Use of English — una de las secciones del examen CAE |
| Tapering | Periodo final de estudio suave antes del examen para evitar el agotamiento |
