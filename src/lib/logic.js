// ============================================================
// Lógica compartida (portada de design_handoff/ui.jsx, adaptada a 15 semanas)
// ============================================================
import { SKILLS, PHASES, TOTAL_WEEKS, getWeekPlan } from '../data';

export const DAY_MS = 86400000;

export const SKILL_VAR = {
  reading: 'var(--sk-reading)', uoe: 'var(--sk-uoe)', writing: 'var(--sk-writing)',
  listening: 'var(--sk-listening)', speaking: 'var(--sk-speaking)',
};
export const CAT_LABEL = {
  uoe: 'Use of English', speaking: 'Speaking', writing: 'Writing',
  listening: 'Listening', reading: 'Reading', sr: 'Repaso', review: 'Repaso',
};
export const CAT_VAR = { ...SKILL_VAR, sr: 'var(--accent)', review: 'var(--text-3)' };

export const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const MOOD_LABELS = ['Muy mal', 'Flojo', 'Normal', 'Bien', 'Genial'];

// ---------- date helpers ----------
export function fmtDate(ts) {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
export function dayKey(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
export function todayPlanDay() { return DAYS_ES[new Date().getDay()]; }

export function checkKey(week, day, taskText) { return `${week}-${day}-${taskText}`; }

// ---------- streak ----------
export function computeStreak(diary, now = Date.now()) {
  if (!diary || !diary.length) return { current: 0, max: 0 };
  const set = new Set(diary.map((e) => dayKey(e.ts)));
  const days = [...set].sort((a, b) => a - b);
  let max = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((days[i] - days[i - 1]) / DAY_MS);
    if (diff === 1) { run++; max = Math.max(max, run); }
    else if (diff > 1) run = 1;
  }
  const today = dayKey(now);
  const last = days[days.length - 1];
  const cur = (last === today || last === today - DAY_MS) ? run : 0;
  return { current: cur, max };
}

// ---------- plan / phases ----------
export function weekCompletion(week, dailyChecks) {
  const plan = getWeekPlan(week);
  let total = 0, done = 0;
  plan.forEach((day) => day.tasks.forEach((tk) => {
    total++;
    if (dailyChecks[checkKey(week, day.d, tk.t)]) done++;
  }));
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}
export function phaseOf(week) { return PHASES.find((p) => p.weeks.includes(week)); }

// ---------- SM-2 ----------
export function sm2(card, q, now = Date.now()) {
  let { interval: iv, ease: ea, reps: rp } = card;
  if (q < 3) { iv = 1; rp = 0; }
  else {
    if (rp === 0) iv = 1; else if (rp === 1) iv = 3; else iv = Math.round(iv * ea);
    ea = Math.max(1.3, ea + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    rp++;
  }
  return { interval: iv, ease: ea, reps: rp, nextReview: now + iv * DAY_MS };
}

// ---------- insights (consejos / advertencias) ----------
export function buildInsights(state, now = Date.now()) {
  const out = [];
  const latest = (k) => state.scores[k][state.scores[k].length - 1].score;
  const weak = SKILLS.map((s) => ({ ...s, score: latest(s.key), gap: s.c1 - latest(s.key) }))
    .filter((s) => s.gap > 0).sort((a, b) => b.gap - a.gap);
  if (weak.length) {
    const top = weak.slice(0, 2);
    out.push({
      kind: weak[0].gap >= 20 ? 'warn' : 'info', icon: 'target',
      title: `Prioriza ${top.map((t) => t.label).join(' y ')}`,
      body: `${top.map((t) => `${t.label} está a ${t.gap} pts del objetivo C1 (180).`).join(' ')} Dedícales las primeras sesiones de cada día.`,
    });
  }
  // ventana de inscripción al CAE (semanas 8-10)
  if (state.currentWeek >= 8 && state.currentWeek <= 10) {
    out.push({ kind: 'warn', icon: 'flag', title: 'Inscríbete al CAE', body: 'Sesión 26 sept 2026 — Centro EC051 4007 Guayaquil. No dejes pasar la fecha de inscripción.' });
  }
  // SR vencidas
  const due = state.srCards.filter((c) => c.nextReview <= now).length;
  if (due > 0) out.push({ kind: 'info', icon: 'layers', title: `${due} tarjetas para repasar`, body: 'Tu repaso espaciado de hoy mantiene fresco lo aprendido. Hazlo antes de empezar lo nuevo.' });
  // racha
  const st = computeStreak(state.diary, now);
  if (st.current === 0) out.push({ kind: 'info', icon: 'flame', title: 'Retoma tu racha', body: 'Registra una entrada en el diario hoy para reactivar tu racha de estudio.' });
  else if (st.current >= 3) out.push({ kind: 'success', icon: 'flame', title: `Racha de ${st.current} días`, body: `¡Constancia! Tu récord es de ${st.max} días. No rompas la cadena.` });
  // transición de fase
  const ph = phaseOf(state.currentWeek);
  const isLastOfPhase = ph && ph.weeks[ph.weeks.length - 1] === state.currentWeek;
  if (isLastOfPhase && state.currentWeek < TOTAL_WEEKS) {
    const next = phaseOf(state.currentWeek + 1);
    out.push({ kind: 'info', icon: 'spark', title: 'Última semana de fase', body: `Cierras "${ph.name.replace(/Fase \d+: /, '')}". La próxima: ${next.name.replace(/Fase \d+: /, '')}.` });
  }
  return out;
}
