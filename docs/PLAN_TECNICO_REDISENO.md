# Plan Técnico — Rediseño UI + Reestructuración (CAE Mastery)

> **Alcance:** (A) Rediseño visual y de navegación **web + mobile-web** según `docs/design_handoff_cae_redesign/`. (B) Reestructuración del código. (C) Migración del plan de estudio a **15 semanas** (ver `PLAN_ESTUDIO_C1_15SEMANAS.md`).
> **Stack actual:** React 19 + Vite 7 + vite-plugin-pwa, empaquetado Electron, deploy GitHub Pages (`base: '/CAE-Mastery/'`).

---

## 1. Estado real del código (línea base)

El `REQUIREMENTS.md` describe un "monolito de ~12.000 líneas". **Eso ya no es cierto** — el proyecto fue refactorizado:

```
src/
  App.jsx                 (107 líneas — shell delgado: header + 9 tabs)
  main.jsx
  data.js                 (1.214 líneas — plan 27 sem, PHASES, WEEK_DATA, generadores)
  storage.js              (219 líneas — Electron fs + File System Access API + localStorage)
  hooks/useAppState.js    (estado + persistencia debounced 500ms)
  index.css / App.css     (estilos: degradados azul-morado-rosa "AI 2023")
  components/
    tabs/    HomeTab, PlanTab, TrackerTab, ErrorBankTab, DiaryTab,
             ReadingTab, SRTab, ShadowTab, OutputTab, ConfigTab
    shared/  DueCard, ScoreChart
```

**Lo que ya está bien (conservar):**
- Separación en componentes por tab y `data.js` como fuente de datos.
- `useAppState()` con `up(fn)` (merge parcial) y persistencia debounced.
- Capa de storage con 3 backends y degradación elegante.
- PWA + Electron + CI de GitHub Pages.

**Deuda real a resolver con el rediseño:**
| # | Problema | Acción |
|---|---|---|
| 1 | Navegación: 9 tabs horizontales + header con degradado | → **bottom nav de 5 secciones** + stack de subpáginas |
| 2 | Estilos mezclados: degradados inline "AI 2023", emojis como iconos | → **design tokens** (oklch) + **lucide-react** + tipografía Manrope |
| 3 | No hay sistema de diseño; cada tab estiliza a su manera | → `styles.css` global con tokens + primitivas compartidas |
| 4 | Sin router (estado `tab` manual) | → stack de navegación `['hoy']` con `go/back` (sin dependencia nueva) |
| 5 | `data.js` modela 27 semanas / overtraining C2 | → **15 semanas / 5 fases C1** (§4) |
| 6 | Sin TypeScript, sin tests | → **fuera de alcance ahora** (no bloquea el rediseño; ver §6) |

---

## 2. Rediseño UI (web + mobile-web)

Objetivo: que la app funcione **idéntica en móvil y escritorio** — en móvil ocupa todo el viewport; en escritorio se centra en un marco redondeado (`--app-w` 460px, breakpoint ≥620px). Fidelidad **alta** según el handoff (`README.md` + `screenshots/`).

### 2.1 Sistema visual
- **Fuente:** Manrope (Google Fonts, pesos 400–800). Añadir `<link>` en `index.html` o `@import` en CSS. `font-variant-numeric: tabular-nums` para números.
- **Iconos:** instalar `lucide-react`; reemplaza **todos los emojis**. Mapeo casi 1:1 con el set del prototipo (today, calendar, flame, target, layers, book, mic, pen, settings, chevrons…).
- **Tokens (oklch):** portar `:root` de `docs/design_handoff_cae_redesign/styles.css` a `src/index.css`. Paleta: tema oscuro refinado, **acento azul sólido** (`--accent #3b82f6`), superficies `--bg #161a22` → `--surface-3`, estados success/warn/danger, colores por skill (reading verde, uoe rojo, writing ámbar, listening azul, speaking morado). Radios `--r-lg/r/r-sm/r-xs`, sombras, `--nav-h 66px`.
- **Eliminar:** el degradado `linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)` del header y los emojis ⚙️💾📋🧘 esparcidos.

### 2.2 Arquitectura de navegación
Reemplazar el header con tabs por:
- **Bottom nav fija de 5 items:** Hoy · Plan · Práctica · Progreso · Más.
- **Stack de navegación** por estado (sin librería): `const [stack, setStack] = useState(['hoy'])`, `go(route)` hace push, `back()` hace pop; al cambiar de ruta el scroll vuelve arriba.
- **Mapa route→tab** (`TAB_OF`): `hoy→hoy`, `plan→plan`, `{practica,sr,errores,lectura,shadow,output}→practica`, `progreso→progreso`, `{mas,config}→mas`.
- **Badge rojo** en Práctica = nº de tarjetas SR vencidas (`nextReview <= Date.now()`).

```
Hoy        → dashboard (sin subpáginas)
Plan       → plan semanal
Práctica   → hub → { sr, errores, lectura, shadow, output }
Progreso   → puntuaciones + calendario (15 semanas)
Más        → menú → { config, accesos directos a Práctica }
```

### 2.3 Pantallas (orden de migración)
Mapeo prototipo → componente actual. Cada una con su captura de referencia en `screenshots/`.

| Orden | Pantalla nueva | Reusar de | Notas |
|---|---|---|---|
| 1 | **Hoy** (dashboard) | HomeTab | Hero countdown + racha + tareas del día (checkbox 22px) + quick stats 2×2 + CTA repaso + SkillBar vs C1 (marca en 180) + InsightCards |
| 2 | **Plan** semanal | PlanTab | Selector de semana tintado por fase + **tira de 15 saltos** (era 27) + tarjetas por día con `TaskRow` |
| 3 | **Práctica** (hub) | — (nuevo) | 5 cards-botón con pills de estado + badge SR |
| 4 | **SR** | SRTab + DueCard | Card de repaso + 4 botones de calificación (q1/3/4/5) + SM-2 + lista + alta de tarjeta |
| 5 | **Errores** | ErrorBankTab | Collapsible alta + grid 5 skills + filtros + "→ Repaso" + "Marcar dominado" |
| 6 | **Lectura** | ReadingTab | Chips de expresiones + "Enviar N a Repaso" |
| 7 | **Shadow** | ShadowTab | Sesiones + total Xh Ym |
| 8 | **Output** | OutputTab | Writing/Speaking + estrellas + truncado 180 chars |
| 9 | **Progreso** | TrackerTab + ScoreChart | Segmented: gráfico SVG (línea C1 punteada en 180) + registro de scores · calendario por fase |
| 10 | **Más / Config** | ConfigTab | Menú + export/import JSON + stats globales + zona peligrosa (reset) |

> **Diario:** el prototipo no le da pantalla propia, pero los datos alimentan racha/stats. Decisión: **conservar `DiaryTab`** y exponerlo como entrada dentro de **Práctica** o **Más** (patrón `OutputScreen`: mood 1–5, texto, wins, struggles, mins). No perder la funcionalidad existente.

### 2.4 Primitivas compartidas a crear (`src/components/ui/`)
`Icon` (wrapper lucide), `ProgressBar`, `Pill`, `StatTile`, `SkillBar` (con marca C1 en 180), `InsightCard`, `EmptyState`, `ScreenHead`, `Collapsible`, `TaskRow`, `BottomNav`. Lógica a centralizar (de `ui.jsx` del prototipo): `computeStreak`, `weekCompletion`, `phaseOf`, `sm2`, `buildInsights`.

### 2.5 Responsive e interacciones
- Móvil: viewport completo; escritorio: marco centrado ≥620px.
- Animación `fadeUp` en hijos de `.page` (respetar `prefers-reduced-motion`); barras de progreso `width 0.5s`.
- Botón "Copiar" en tareas con recurso → `navigator.clipboard` + feedback 1.4s.
- Estilos `.sheet` (slide-up) disponibles para modales.

---

## 3. Reestructuración de código

### 3.1 Árbol objetivo
```
src/
  main.jsx
  App.jsx                 → shell: <BottomNav> + router de stack + <Screen>
  data.js                 → 15 semanas / 5 fases (§4)
  storage.js              → SIN CAMBIOS (3 backends)
  hooks/
    useAppState.js        → +migración de localStorage key (§3.3)
    useNavStack.js        → NUEVO: stack go/back + TAB_OF
  lib/
    logic.js              → NUEVO: computeStreak, weekCompletion, phaseOf, sm2, buildInsights
  styles/
    tokens.css            → :root tokens (oklch) del handoff
    base.css              → reset, tipografía Manrope, .page/.card/.nav/.sheet
  components/
    ui/                   → primitivas (§2.4)
    screens/              → HoyScreen, PlanScreen, PracticaScreen, SRScreen,
                            ErroresScreen, LecturaScreen, ShadowScreen,
                            OutputScreen, ProgresoScreen, MasScreen, ConfigScreen,
                            DiarioScreen
```
> Migración incremental: renombrar `components/tabs/*` → `components/screens/*` a medida que se rediseñan, no de golpe.

### 3.2 Estado
- `useAppState()` se mantiene (API `{ state, setState, up, fileStatus }`). El estado ya incluye `readingLog`, `shadowLog`, `outputLog`, `diary`, `srCards`, `errors`, `scores`, `dailyChecks`, `currentWeek`, `totalMinutes`, `dismissedReminders` — **no faltan campos**.
- `dailyChecks` usa clave `"<week>-<día>-<textoTarea>"`. En Vite se pueden usar **template literals normales** (no hace falta el helper `ckKey` del prototipo, que existía solo por Babel-standalone).

### 3.3 Migración de datos (importante)
El cambio de 27→15 semanas y de fechas **invalida `currentWeek` y `dailyChecks` viejos**. Plan de migración en `useAppState`:
1. Cambiar la clave de localStorage a `cae-mastery-c1-v2` (mantener `defaultState()` con `currentWeek: 1`).
2. Al bootear: si existe estado bajo la clave vieja (`cae-mastery-v4` / `cae-mastery-redesign-v1`), **conservar** lo que no depende de semanas (`scores`, `errors`, `srCards`, `diary`, `readingLog`, `shadowLog`, `outputLog`, `totalMinutes`) y **descartar** `dailyChecks` + recalcular `currentWeek` desde la fecha actual.
3. Exponer export/import JSON en Config para respaldo manual antes de migrar.

### 3.4 Config externa a tocar
- `vite.config.js` → manifest PWA: cambiar descripción `"27 semanas"` → `"15 semanas → 26 Sept 2026"`. `base` y deploy se mantienen.
- `index.html` → `<link>` Manrope.
- `package.json` → `dependencies`: añadir `lucide-react`.

---

## 4. Migración del plan a 15 semanas (`src/data.js`)

Cambios exactos para reflejar `PLAN_ESTUDIO_C1_15SEMANAS.md`:

```js
export const TOTAL_WEEKS = 15;                 // antes 27
export const EXAM_DATE = "26 de septiembre 2026"; // sin cambios
export const START_DATE = new Date(2026, 5, 15);  // lunes 15 jun (antes 2,23 = 23 mar)
```

**`PHASES` (5 fases en vez de 7):**
```js
export const PHASES = [
  { name: "Fase 1: Cerrar brechas",  weeks:[1,2,3,4],        focus:"UoE 151→172, Speaking 151→170", target:"Eliminar gaps críticos", color:"#ef4444", hrs:"3h L-V + 2h Sáb" },
  { name: "Fase 2: Subir a C1",      weeks:[5,6,7,8],        focus:"Writing→180, Listening→180",     target:"Todas ≥175",            color:"#f59e0b", hrs:"3h L-V + 2h Sáb" },
  { name: "Fase 3: Consolidar C1",   weeks:[9,10,11],        focus:"Mocks semanales, pulir débil",   target:"Global ≥183",           color:"#3b82f6", hrs:"3h L-V + 2h Sáb" },
  { name: "Fase 4: Dominar C1",      weeks:[12,13,14],       focus:"Simulacros completos, timing",   target:"C1 asegurado (180+)",   color:"#a855f7", hrs:"3h L-V + 2h Sáb" },
  { name: "Fase 5: Tapering",        weeks:[15],             focus:"Repaso ligero, logística",       target:"Llegar fresco al 26 sep",color:"#22c55e", hrs:"1h max" },
];
```

**`getWeekPlan(w)` — nuevos límites:**
```js
export function getWeekPlan(w) {
  if (w <= 4)  return phase1(w);   // generador intensivo (5 tareas L-V + sábado)
  if (w <= 8)  return phase2(w);
  if (w <= 11) return phase3(w);
  if (w <= 14) return phase4(w);
  return phase5();                 // tapering (era phase7)
}
```
- Reutilizar los generadores existentes como base: `phase1`→F1, `phase2`→F2, `phase3`→F3, `phase4`→F4, `phase7`→F5 (tapering). **Eliminar `phase5`/`phase6` viejos (overtraining C2).**
- Añadir un día **Sábado** a los generadores F1–F4 (refuerzo, ver plantillas del plan de estudio §3). Subir a ~5 tareas L-V para los 180 min.

**`WEEK_DATA` 1–15:** reemplazar el objeto por la tabla de la §4 del plan de estudio (un tema/grammar/writing/podcast por semana).

**`REMINDERS` (reubicar inscripción):**
```js
export const REMINDERS = [
  { week: 8,  text:"📋 INSCRÍBETE AL CAE — sesión 26 sept. Centro EC051 4007 Guayaquil.", type:"urgent" },
  { week: 9,  text:"📋 ¿Ya te inscribiste? Confírmalo esta semana.",                       type:"urgent" },
  { week:10,  text:"📋 Último recordatorio de inscripción CAE.",                            type:"urgent" },
  { week:12,  text:"🎯 C1 en consolidación — simulacros completos.",                        type:"info"   },
  { week:15,  text:"🧘 TAPERING. Repaso ligero. Examen sábado 26 sept.",                    type:"success"},
];
```

> `weekDate(w)` y `daysUntilExam()` **no necesitan cambios** (derivan de `START_DATE` y de la fecha fija del examen).

---

## 5. Roadmap de implementación por fases

| Fase | Entregable | Detalle |
|---|---|---|
| **T0 · Datos** | `data.js` 15 semanas | §4. Es independiente del rediseño y desbloquea la app correcta ya. Probar `getWeekPlan`, `weekDate`, fases. |
| **T1 · Cimientos visuales** | tokens + Manrope + lucide-react | `styles/tokens.css`, `base.css`, instalar deps, quitar degradados/emojis del shell. |
| **T2 · Shell de navegación** | BottomNav + stack | `useNavStack.js`, `App.jsx` reescrito, `TAB_OF`, badge SR, scroll-to-top. |
| **T3 · Primitivas + lógica** | `components/ui/` + `lib/logic.js` | Icon, ProgressBar, Pill, StatTile, SkillBar, InsightCard, TaskRow, Collapsible + helpers. |
| **T4 · Pantallas (×11)** | migración 1→10 (§2.3) | Orden: Hoy → Plan → Práctica → SR → Errores → Lectura → Shadow → Output → Progreso → Más/Config (+ Diario). Una por commit, validando contra `screenshots/`. |
| **T5 · Migración de estado** | localStorage v2 | §3.3 + ajustar manifest PWA. |
| **T6 · QA** | responsive + PWA + Electron | Probar móvil/escritorio, instalación PWA, build Electron, deploy Pages. Verificar export/import. |

**Sugerencia de modelo (según routing):** T0 y T4 (implementación por pantalla) → Sonnet. T1–T3 (cimientos transversales, sistema de diseño, navegación que toca varios archivos) → Opus por ser cross-cutting. Exploración/lints → Haiku.

---

## 6. Fuera de alcance (decisiones explícitas)

- **TypeScript:** no migrar ahora; añade fricción sin valor inmediato para una app personal. Reconsiderar tras el rediseño.
- **Tests:** no se añaden suites; sí verificación manual (T6). Si se quiere mínimo, testear `sm2()` y `weekCompletion()` con Vitest.
- **Backend / sync:** se mantiene local (localStorage + File System Access + Electron fs). El export/import JSON cubre el respaldo.
- **React Router:** innecesario — el stack manual de 1 nivel basta y evita una dependencia.

---

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Perder datos al cambiar la clave de localStorage | Migración que preserva todo salvo `dailyChecks` (§3.3) + export JSON previo. |
| `dailyChecks` viejos referencian semanas inexistentes | Se descartan en la migración; no rompen la UI. |
| Deploy Pages con `base:'/CAE-Mastery/'` y rutas de assets | Mantener `base`; usar imports relativos para iconos/fuentes. |
| Regresiones visuales entre móvil/escritorio | Validar cada pantalla contra `screenshots/` en ambos anchos en T4. |
| Inscripción al CAE no realizada a tiempo | REMINDERS en semanas 8–10 + nota en el plan de estudio. |

---

> **Resumen:** el código ya está modularizado; el trabajo es (1) cambiar `data.js` a 15 semanas, (2) montar el sistema visual + bottom-nav del handoff, y (3) migrar pantalla por pantalla reusando la lógica de estado existente. Nada exige reescritura total ni dependencias pesadas.
