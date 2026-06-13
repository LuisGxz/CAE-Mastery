# Handoff: Rediseño CAE Mastery (mobile-web)

## Overview
Rediseño funcional completo de **CAE Mastery**, el tracker personal de estudio para el examen Cambridge C1 Advanced (CAE). La app organiza un plan de 27 semanas, registra puntuaciones por habilidad, gestiona repaso espaciado (SM-2), banco de errores, diario, lectura, shadowing y output (writing/speaking).

El objetivo del rediseño fue:
1. Convertir la app de **escritorio (Electron, ancho fijo 920px)** a **mobile-web responsive** (funciona igual en celular y navegador de escritorio).
2. **Mejorar el sistema visual**: tema oscuro refinado con acento azul sólido (se eliminaron los degradados azul-morado-rosa "AI app 2023"), tipografía Manrope, y un **set de iconos de línea consistente** que reemplaza todos los emojis.
3. **Reorganizar la navegación**: de 9 tabs a una **barra inferior de 5 secciones** (Hoy · Plan · Práctica · Progreso · Más).
4. Convertir **Home en un dashboard** con countdown, racha, tareas del día, stats, habilidades vs C1 y consejos/advertencias automáticos.

## About the Design Files
Los archivos de este bundle son **referencias de diseño creadas en HTML/React (vía Babel en el navegador)** — prototipos que muestran el look y comportamiento deseados, **no código de producción para copiar tal cual**.

La tarea es **recrear estos diseños dentro de tu codebase existente** (`cae-mastery/`, que es **React 18 + Vite**), respetando sus patrones: componentes en `src/components/`, estado en hooks (`useAppState`), datos en `src/data.js`. El prototipo ya replica la estructura de datos real de `data.js` (SKILLS, PHASES, WEEK_DATA, getWeekPlan, SM-2), así que la migración es directa: portar las pantallas nuevas manteniendo la lógica de estado que ya existe.

**Importante sobre JSX en producción:** el prototipo usa Babel en el navegador y por eso evita *claves de objeto computadas con template literals* (`{ [`${a}-${b}`]: x }` rompe el parser de Babel standalone). En tu build de Vite eso **no es un problema** — puedes usar template literals con normalidad. Hay un helper `ckKey(w,d,t)` en el prototipo que en Vite es opcional.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciado, iconografía e interacciones son finales. Recrea la UI fielmente usando tus librerías/patrones. Los valores exactos están en la sección **Design Tokens** y en `styles.css`.

---

## Arquitectura de navegación

Barra inferior fija (5 items). Cada tab puede abrir sub-pantallas mediante un **stack de navegación** (push/pop) — implementado en el prototipo como `useState(['hoy'])` con `go(route)` y `back()`. En tu codebase puedes usar React Router o mantener el stack manual.

```
Hoy        → dashboard (sin subpáginas)
Plan       → plan semanal (sin subpáginas)
Práctica   → hub → { sr, errores, lectura, shadow, output }
Progreso   → puntuaciones + calendario 27 semanas
Más        → menú → { config, + accesos directos a las de Práctica }
```

El tab **Práctica** muestra un **badge rojo** con el nº de tarjetas SR vencidas (`nextReview <= now`).

Mapa route→tab activo (`TAB_OF`): hoy→hoy · plan→plan · {practica,sr,errores,lectura,shadow,output}→practica · progreso→progreso · {mas,config}→mas.

---

## Screens / Views

### 1. Hoy (Dashboard) — `HoyScreen`
**Propósito:** primera pantalla al abrir. Responde "¿qué estudio ahora y cómo voy?".

Layout (vertical, padding lateral 16px, scroll vertical):
1. **Hero countdown** (card, padding 18, fondo `linear-gradient(160deg, var(--surface-2), var(--surface))`, borde `--border-2`):
   - Eyebrow "EXAMEN CAE C1" (11.5px, 700, `--text-3`, uppercase, letter-spacing .04em).
   - Número grande de días restantes (`bignum` 40px/800, color `--accent-2`) + "días" + fecha "Sábado 26/09/2026".
   - A la derecha, si racha > 0: badge con icono `flame`, número y label "RACHA" (fondo `--warn-soft`, color `--warn`).
   - Pills abajo: "Semana N/27" (accent) + nombre de fase (color de la fase).
2. **Tareas de hoy** (card): header con icono `today` + "Hoy · {díaSemana}" y contador `done/total`. Barra de progreso verde. Lista de `TaskRow` (checkbox redondeado 22px que al marcar se pone verde con check). Botón ghost "Ver plan de la semana →". Si el día no tiene plan (descanso): mensaje centrado.
3. **Quick stats** (grid 2×2, gap 12): `StatTile` de Promedio, Repaso hoy, Racha, Semana%. Cada tile: icono en cuadro 30px, label, número 26px/800.
4. **CTA de Repaso** (solo si hay tarjetas vencidas): card con fondo `--accent-soft`, borde `--accent-line`, icono `layers` en cuadro azul, "Repasa N tarjetas / Repetición espaciada · 5 min", chevron. Navega a `sr`.
5. **Habilidades vs objetivo C1** (card): 5 `SkillBar` (Reading, UoE, Writing, Listening, Speaking). Cada barra: label, score (color de skill), gap "N→C1" o "C1 ✓", barra de progreso con **marca vertical en 180** (el objetivo C1). Link "Detalle →" abre Progreso.
6. **Consejos y avisos**: lista de `InsightCard` generados por `buildInsights()` (ver sección Lógica).

### 2. Plan semanal — `PlanScreen`
**Propósito:** ver/marcar el plan de cualquiera de las 27 semanas.

- **Selector de semana** (card tintada con el color de la fase): flechas ←/→ (deshabilitadas en límites 1/27), "Semana N" + rango de fechas. Debajo: nombre de fase + foco + horas + % completado + barra. **Tira de saltos rápidos**: 27 botones cuadrados (30px) scroll horizontal; el actual en azul, la semana en curso con borde azul.
- **Tarjetas por día** (Lunes…Sábado): header con nombre del día (Sábado en color speaking, marcado "extra"), contador `done/total`, y lista de `TaskRow`. La semana en curso marca el día de hoy con pill "Hoy".

### 3. Práctica (hub) — `PracticaScreen`
Lista de 5 cards-botón, cada una con icono en color, título, subtítulo y pill de estado:
- Repaso espaciado → badge "N hoy" (warn) o "al día" (success)
- Banco de errores → "N activos"
- Log de lectura → "N textos"
- Shadowing → "Xh Ym"
- Output Lab → "W · S"

### 3a. Repaso espaciado — `SRScreen`
Flujo de flashcards SM-2:
- Pills de resumen: pendientes / en 7 días / total.
- **Card de repaso** (borde azul): categoría + "rep N · Md". Frente grande centrado (19px). Botón "Mostrar respuesta" → revela reverso en caja verde + contexto + **4 botones de calificación**: "No sé" (q1, danger), "Difícil" (q3, warn), "Bien" (q4, listening), "Fácil" (q5, success). Al calificar aplica `sm2()` y pasa a la siguiente.
- Si no hay vencidas: estado "¡Repaso al día!".
- **Collapsible "Nueva tarjeta"** (skill, frente, reverso, contexto).
- **Lista** de todas las tarjetas ordenadas por próxima revisión, con "hoy"/"Nd" y botón eliminar.

### 3b. Banco de errores — `ErroresScreen`
- Collapsible "Registrar error": skill, categoría/regla, frase con error, corrección, por qué.
- Grid 5 columnas con conteo de errores activos por skill.
- Filtros chip: Activos / Dominados / Todos.
- Cards de error: skill + regla + fecha, línea "✗ error" (danger), "✓ corrección" (success), "por qué" (itálica). Acciones: **"→ Repaso"** (crea tarjeta SR; se deshabilita a "En repaso" si ya existe) y **"Marcar dominado"** (toggle, atenúa la card).

### 3c. Log de lectura — `LecturaScreen`
- Pills: nº textos + nº expresiones.
- Collapsible: título, tipo (artículo/CAE/libro/transcripción/otro), nivel (segmented B2/C1/C2), expresiones (separadas por comas), notas.
- Cards: título + nivel, tipo + semana/fecha, **chips de expresiones** (color reading), notas, botón **"Enviar N a Repaso"** (crea una tarjeta SR por cada expresión).

### 3d. Shadowing — `ShadowScreen`
- Pill total "Xh Ymin".
- Collapsible: fuente, minutos (number), dificultad (segmented 1–5), notas.
- Cards: fuente + "Nmin · dif X/5" + notas.

### 3e. Output Lab — `OutputScreen`
- Pills: N writing / N speaking.
- Collapsible: tipo (Writing / Speaking solo / partner / IA), autoevaluación (segmented 1–5 → estrellas), consigna, texto largo.
- Cards: tipo (icono pen/mic), estrellas, semana, consigna, texto con "más/menos" (trunca a 180 chars).

### 4. Progreso — `ProgresoScreen`
Segmented de 2 vistas:
- **Puntuaciones**: gráfico SVG de líneas (5 skills, eje 140–200, líneas guía en 140/160/180/200, **línea punteada C1 en 180**). Leyenda. Luego, por skill, una card con score actual, gap, `SkillBar` e input para **registrar nueva puntuación** (140–210, botón +).
- **Calendario 27 sem**: agrupado por fase; cada semana con rango de fechas, barra de % completado, check (verde si 100%, círculo warn si en curso/incompleta). Banner final con fecha de examen y días restantes.

### 5. Más — `MasScreen`
Lista-menú: Ajustes y respaldo, + accesos directos a las 5 de Práctica. Footer con icono `cap` y "CAE Mastery · rediseño 2026 · Tus datos se guardan en este dispositivo".

### 5a. Ajustes y respaldo — `ConfigScreen`
- **Respaldo**: Exportar (descarga JSON con todo el estado) / Importar (lee JSON y hace merge en el estado).
- **Estadísticas globales** (grid 2 col): minutos estudiados, entradas de diario, errores (dominados), tarjetas, sesiones de shadowing, outputs, lecturas, promedio.
- **Zona peligrosa** (borde danger): "Reiniciar datos" → confirm → vuelve a `seedState()`.

> **Nota:** el prototipo no incluye una pantalla dedicada de **Diario** en la nav (el original sí). Los datos del diario existen en el estado y alimentan la racha y stats. Si quieres exponerlo como pantalla en producción, replica el patrón de `OutputScreen` (collapsible de entrada con mood 1–5, texto, wins, struggles, minutos) y agrégalo a Práctica o a Más.

---

## Interactions & Behavior
- **Navegación:** tabs inferiores reemplazan el stack (vuelven a la raíz del tab). Sub-pantallas hacen push; botón ← hace pop. Al cambiar de ruta, el scroll vuelve arriba.
- **Checkboxes de tareas:** toggle inmediato, persistido. Transición de 0.15s.
- **SM-2:** al calificar (q=1/3/4/5) se recalcula `interval`, `ease`, `reps`, `nextReview`.
- **Animación de entrada:** cada hijo directo de `.page` hace `fadeUp` (0.35s, translateY 8px→0, opacity 0→1). Respeta `prefers-reduced-motion`.
- **Transiciones de barras de progreso:** width 0.5s cubic-bezier(.4,0,.2,1).
- **Copiar recurso:** las tareas del plan con recurso (prompt de Claude, YouTube, etc.) tienen botón "Copiar" → `navigator.clipboard`, feedback "Copiado" 1.4s.
- **Sheet/modal:** estilos `.sheet` disponibles (slide-up desde abajo) por si se necesitan.

## State Management
Hook `useAppState()` → `{ state, setState, up }`, con **persistencia en localStorage** (key `cae-mastery-redesign-v1`, debounce 350ms). `up(fn)` hace merge parcial: `setState(s => ({...s, ...fn(s)}))`.

Forma del estado (`state`):
```
currentWeek: number (1–27)
scores: { reading|uoe|writing|listening|speaking: [{ week, score, date }] }
dailyChecks: { "<week>-<día>-<textoTarea>": boolean }
srCards: [{ id, skill, front, back, context, interval, nextReview, ease, reps }]
errors: [{ id, skill, text, correction, rule, why, mastered, date }]
diary: [{ id, ts, date, mood(1–5), text, wins, struggles, mins, week }]
readingLog: [{ id, title, type, level, expressions, notes, date, week }]
shadowLog: [{ id, source, duration, difficulty, notes, date }]
outputLog: [{ id, type, prompt, text, selfScore, date, week }]
totalMinutes: number
```

Funciones de lógica (en `ui.jsx`):
- `computeStreak(diary)` → `{ current, max }` (días consecutivos con entrada).
- `weekCompletion(week, dailyChecks)` → `{ total, done, pct }`.
- `phaseOf(week)` → objeto fase de `PHASES`.
- `sm2(card, q)` → nuevos campos de la tarjeta.
- `buildInsights(state)` → array de `{ kind: warn|success|info, icon, title, body }`. Reglas: prioriza skills con mayor gap a 180; aviso de inscripción al CAE en semanas 9–12; tarjetas SR vencidas; estado de racha; última semana de fase.
- `seedState()` → datos demo realistas (semana 6, scores en progreso, 6 errores, 10 tarjetas SR con 4 vencidas, 4 entradas de diario = racha de 4, lecturas, shadowing, outputs).

`getWeekPlan(week)`, `weekDate(week)`, `daysUntilExam()`, `PHASES`, `SKILLS`, `WEEK_DATA` vienen de `data.js` (idénticos a tu `src/data.js` original).

## Design Tokens
Definidos como variables CSS en `:root` (ver `styles.css`). Usan **oklch**; abajo el equivalente aproximado en hex para referencia.

**Superficies (dark):**
- `--bg` ≈ `#161a22` · `--surface` ≈ `#1e232c` · `--surface-2` ≈ `#262c37` · `--surface-3` ≈ `#323845` · `--input-bg` ≈ `#191e26`

**Bordes/texto:**
- `--border` ≈ `#3a414e` (55% alpha) · `--border-2` ≈ `#4a5260` · `--hairline` ≈ `#363c48` (40%)
- `--text` ≈ `#f1f3f6` · `--text-2` ≈ `#aeb6c2` · `--text-3` ≈ `#7e8794` · `--text-4` ≈ `#646d7a`

**Acento (azul):**
- `--accent` ≈ `#3b82f6` · `--accent-2` ≈ `#5b9bf7` · `--accent-ink` ≈ `#eef4ff`
- `--accent-soft` = accent @14% · `--accent-line` = accent @32%

**Estados:**
- `--success` ≈ `#33c27a` · `--warn` ≈ `#e0a93a` · `--danger` ≈ `#ee5f52` (cada uno con `*-soft` @13%)

**Skills (colores de datos):**
- reading ≈ `#39c07a` · uoe ≈ `#ee5f52` · writing ≈ `#e0a93a` · listening ≈ `#4f9bf0` · speaking ≈ `#a06bf0`

**Radios:** `--r-lg` 18 · `--r` 14 · `--r-sm` 10 · `--r-xs` 8 (px).
**Sombras:** `--shadow` = `0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.28)`; `--shadow-pop` = `0 12px 40px rgba(0,0,0,.5)`.
**Layout:** ancho de app `--app-w` 460px (centrada en escritorio con marco redondeado); altura nav `--nav-h` 66px.

**Tipografía:** **Manrope** (Google Fonts, pesos 400–800). Tamaños clave: bignum 40/800, títulos de pantalla 19/800, títulos de card 13/700, cuerpo 12.5–13.5, labels 11–11.5/700 uppercase para secciones. Números con `font-variant-numeric: tabular-nums` (clase `.tnum`). `letter-spacing` negativo (-0.02 a -0.03em) en números/títulos grandes.

**Espaciado:** padding de página 16px lateral; cards padding 13–18; gap entre cards 12; gap en grids 7–14.

## Capturas de referencia (carpeta `screenshots/`)
Capturas hifi de cada pantalla con los datos demo. Úsalas como referencia visual exacta del resultado a replicar:

| Archivo | Pantalla | Componente |
|---|---|---|
| `hoy-dashboard.png` | Hoy (dashboard): hero countdown, racha, tareas, stats | `HoyScreen` |
| `plan-semanal.png` | Plan: selector de semana + tira de 27 + tarjetas por día | `PlanScreen` |
| `practica-hub.png` | Práctica: hub con las 5 herramientas | `PracticaScreen` |
| `practica-sr-repaso.png` | Repaso SR: tarjeta (frente) + lista | `SRScreen` |
| `practica-sr-respuesta.png` | Repaso SR: respuesta revelada + 4 botones de calificación | `SRScreen` |
| `practica-errores.png` | Banco de errores: conteos, filtros, cards | `ErroresScreen` |
| `practica-lectura.png` | Log de lectura: chips de expresiones | `LecturaScreen` |
| `practica-shadowing.png` | Shadowing: sesiones | `ShadowScreen` |
| `practica-output.png` | Output Lab: writing/speaking | `OutputScreen` |
| `progreso-puntuaciones.png` | Progreso: gráfico SVG + registro de scores | `ProgresoScreen` |
| `progreso-calendario.png` | Progreso: calendario de 27 semanas por fase | `ProgresoScreen` |
| `mas-menu.png` | Más: menú de secciones | `MasScreen` |
| `config-ajustes.png` | Ajustes: respaldo, stats, zona peligrosa | `ConfigScreen` |

> Nota: la captura de "Hoy" muestra "Día de descanso" porque el día de la semana en que se generó (sábado) no tenía tareas en el plan demo; entre semana esa card lista las tareas del día con checkboxes.

## Assets / Iconos
**No se usan imágenes** (el `hero.png` original ya no se usa). Toda la iconografía es un **set de iconos de línea SVG inline** (estilo Lucide, stroke 1.85, linecap/linejoin round) definido en `icons.jsx` como `ICON_PATHS` + componente `<Icon name size color strokeWidth />`. Iconos incluidos: today, calendar, practice, progress, more, grid, flame, clock, target, layers, alert, bulb, book, mic, pen, settings, chevrons, plus, check, checkCircle, x, arrow, download, upload, trash, bell, cap, trend, spark, copy, search, video, chat, flag, rotate, zap, bookmark, filter, star, list, shield, edit, globe, headphones.

En tu codebase puedes usar **lucide-react** directamente (los nombres coinciden casi 1:1) en lugar de portar los paths.

## Files (en este bundle)
- `CAE Mastery.html` — entrada; carga scripts en orden: data → icons → ui → screens1 → screens2 → app.
- `styles.css` — sistema visual completo (tokens, componentes, nav, shell).
- `icons.jsx` — set de iconos + componente `<Icon>`.
- `ui.jsx` — estado/persistencia, `seedState`, helpers de lógica, primitivas (`ProgressBar`, `Pill`, `StatTile`, `SkillBar`, `InsightCard`, `EmptyState`, `ScreenHead`).
- `screens1.jsx` — `HoyScreen`, `PlanScreen`, `ProgresoScreen`, `ScoreChart`, `TaskRow`, `ResourceBlock`.
- `screens2.jsx` — `PracticaScreen`, `SRScreen`, `ErroresScreen`, `LecturaScreen`, `ShadowScreen`, `OutputScreen`, `MasScreen`, `ConfigScreen`, `Collapsible`.
- `app.jsx` — shell, navegación (stack + bottom nav), routing.
- `data.js` — plan de 27 semanas, fases, skills, SM-2 helpers (= tu `src/data.js`).

## Plan de implementación sugerido (para Claude Code)
1. En `cae-mastery/`, instala **Manrope** (Google Fonts) y **lucide-react**.
2. Reemplaza el CSS global por los tokens de `styles.css` (adapta a tu solución de estilos: CSS modules, Tailwind config, o CSS plano).
3. Crea el **shell de navegación** (bottom nav 5 tabs + stack) en `App.jsx`. Usa template literals normales para `dailyChecks` (sin el helper `ckKey`).
4. Migra pantalla por pantalla siguiendo este orden: Hoy → Plan → Práctica(hub) → SR → Errores → Lectura → Shadow → Output → Progreso → Más/Config. Reutiliza tu `data.js` y tu hook de estado existente; añade los campos nuevos de estado (`readingLog`, etc.) si no estaban.
5. Mantén la **persistencia en localStorage** (o súbela a un backend si lo planeas).
6. Verifica responsive: en móvil ocupa todo el viewport; en escritorio, centrado con marco (≥620px).
