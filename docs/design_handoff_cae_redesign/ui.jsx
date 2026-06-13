/* global React, Icon */
// ============================================================
// Shared UI primitives, app state, seed data, helpers
// ============================================================
const { useState, useEffect, useRef, useCallback } = React;
const D = window.CAEData;

const SKILL_VAR = {
  reading: 'var(--sk-reading)', uoe: 'var(--sk-uoe)', writing: 'var(--sk-writing)',
  listening: 'var(--sk-listening)', speaking: 'var(--sk-speaking)',
};
const CAT_LABEL = { uoe: 'Use of English', speaking: 'Speaking', writing: 'Writing', listening: 'Listening', reading: 'Reading', sr: 'Repaso', review: 'Repaso' };
const CAT_VAR = { ...SKILL_VAR, sr: 'var(--accent)', review: 'var(--text-3)' };

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MOOD_LABELS = ['Muy mal', 'Flojo', 'Normal', 'Bien', 'Genial'];

// ---------- date helpers ----------
const DAY_MS = 86400000;
function fmtDate(ts) {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
function dayKey(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function todayPlanDay() {
  const n = new Date().getDay(); // 0 Sun..6 Sat
  return DAYS_ES[n];
}

function computeStreak(diary) {
  if (!diary || !diary.length) return { current: 0, max: 0 };
  const set = new Set(diary.map(e => dayKey(e.ts)));
  const days = [...set].sort((a, b) => a - b);
  let max = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((days[i] - days[i - 1]) / DAY_MS);
    if (diff === 1) { run++; max = Math.max(max, run); }
    else if (diff > 1) run = 1;
  }
  const today = dayKey(Date.now());
  const last = days[days.length - 1];
  const cur = (last === today || last === today - DAY_MS) ? run : 0;
  return { current: cur, max };
}

function weekCompletion(week, dailyChecks) {
  const plan = D.getWeekPlan(week);
  let total = 0, done = 0;
  plan.forEach(day => day.tasks.forEach(tk => { total++; if (dailyChecks[`${week}-${day.d}-${tk.t}`]) done++; }));
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}
function phaseOf(week) { return D.PHASES.find(p => p.weeks.includes(week)); }

// ---------- SM-2 ----------
function sm2(card, q) {
  let { interval: iv, ease: ea, reps: rp } = card;
  if (q < 3) { iv = 1; rp = 0; }
  else {
    if (rp === 0) iv = 1; else if (rp === 1) iv = 3; else iv = Math.round(iv * ea);
    ea = Math.max(1.3, ea + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    rp++;
  }
  return { interval: iv, ease: ea, reps: rp, nextReview: Date.now() + iv * DAY_MS };
}

// ---------- insights (consejos / advertencias) ----------
function buildInsights(state) {
  const out = [];
  const latest = k => state.scores[k][state.scores[k].length - 1].score;
  const weak = D.SKILLS.map(s => ({ ...s, score: latest(s.key), gap: s.c1 - latest(s.key) }))
    .filter(s => s.gap > 0).sort((a, b) => b.gap - a.gap);
  if (weak.length) {
    const top = weak.slice(0, 2);
    out.push({
      kind: weak[0].gap >= 20 ? 'warn' : 'info', icon: 'target',
      title: `Prioriza ${top.map(t => t.label).join(' y ')}`,
      body: `${top.map(t => `${t.label} está a ${t.gap} pts del objetivo C1 (180).`).join(' ')} Dedícales las primeras sesiones de cada día.`,
    });
  }
  // registration window
  if (state.currentWeek >= 9 && state.currentWeek <= 12) {
    out.push({ kind: 'warn', icon: 'flag', title: 'Inscríbete al CAE', body: 'Sesión 26 sept 2026 — Centro EC051 4007 Guayaquil. No dejes pasar la fecha de inscripción.' });
  }
  // SR due
  const due = state.srCards.filter(c => c.nextReview <= Date.now()).length;
  if (due > 0) out.push({ kind: 'info', icon: 'layers', title: `${due} tarjetas para repasar`, body: 'Tu repaso espaciado de hoy mantiene fresco lo que ya aprendiste. Hazlo antes de empezar lo nuevo.' });
  // streak
  const st = computeStreak(state.diary);
  if (st.current === 0) out.push({ kind: 'info', icon: 'flame', title: 'Retoma tu racha', body: 'Registra una entrada en el diario hoy para reactivar tu racha de estudio.' });
  else if (st.current >= 3) out.push({ kind: 'success', icon: 'flame', title: `Racha de ${st.current} días`, body: `¡Constancia! Tu récord es de ${st.max} días. No rompas la cadena.` });
  // phase transition
  const ph = phaseOf(state.currentWeek);
  const isLastOfPhase = ph && ph.weeks[ph.weeks.length - 1] === state.currentWeek;
  if (isLastOfPhase && state.currentWeek < 27) {
    const next = phaseOf(state.currentWeek + 1);
    out.push({ kind: 'info', icon: 'spark', title: 'Última semana de fase', body: `Cierras "${ph.name.replace(/Fase \d+: /, '')}". La próxima: ${next.name.replace(/Fase \d+: /, '')}.` });
  }
  return out;
}

// ============================================================
// State + persistence
// ============================================================
const STORE_KEY = 'cae-mastery-redesign-v1';

function seedState() {
  const base = D.defaultState();
  const now = Date.now();
  const examMonths = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  // score history weeks 0..6
  const tracks = {
    reading:   [186, 187, 187, 188, 189, 190, 191],
    uoe:       [151, 153, 155, 158, 161, 163, 166],
    writing:   [161, 162, 164, 166, 168, 170, 172],
    listening: [165, 166, 167, 169, 171, 172, 174],
    speaking:  [151, 153, 155, 157, 160, 162, 164],
  };
  base.scores = {};
  Object.keys(tracks).forEach(k => {
    base.scores[k] = tracks[k].map((score, w) => ({ week: w, score, date: D.weekDate(w || 1).split(' — ')[0] }));
  });
  base.currentWeek = 6;
  // daily checks: weeks 1-5 fully done, week 6 ~45%
  const checks = {};
  for (let w = 1; w <= 5; w++) {
    D.getWeekPlan(w).forEach(day => day.tasks.forEach(tk => { checks[`${w}-${day.d}-${tk.t}`] = true; }));
  }
  const w6 = D.getWeekPlan(6);
  w6.slice(0, 2).forEach(day => day.tasks.forEach(tk => { checks[`6-${day.d}-${tk.t}`] = true; }));
  base.dailyChecks = checks;
  // errors
  base.errors = [
    { id: 1, skill: 'uoe', text: 'I look forward to *hear* from you.', correction: 'I look forward to *hearing* from you.', rule: 'Verb patterns', why: '"look forward to" + gerundio, no infinitivo.', mastered: false, date: fmtDate(now - 9 * DAY_MS) },
    { id: 2, skill: 'uoe', text: 'Despite *of* the rain, we went out.', correction: 'Despite the rain / In spite of the rain.', rule: 'Linkers', why: '"despite" no lleva "of"; "in spite of" sí.', mastered: false, date: fmtDate(now - 7 * DAY_MS) },
    { id: 3, skill: 'speaking', text: 'I think that is a *very* good idea, very nice.', correction: 'That strikes me as a particularly compelling idea.', rule: 'Range', why: 'Evitar repetir "very"; usar léxico C1.', mastered: false, date: fmtDate(now - 5 * DAY_MS) },
    { id: 4, skill: 'writing', text: 'In conclusion, to sum up, finally...', correction: 'Elegir UN conector de cierre, no acumular.', rule: 'Cohesion', why: 'Acumular linkers baja Organisation.', mastered: false, date: fmtDate(now - 4 * DAY_MS) },
    { id: 5, skill: 'uoe', text: 'It depends *of* the situation.', correction: 'It depends *on* the situation.', rule: 'Prepositions', why: 'depend + on.', mastered: true, date: fmtDate(now - 12 * DAY_MS) },
    { id: 6, skill: 'listening', text: 'Confundí "affect" / "effect" en dictado.', correction: 'affect = verbo, effect = sustantivo.', rule: 'Confusables', why: 'Par confuso frecuente en Listening Part 2.', mastered: false, date: fmtDate(now - 2 * DAY_MS) },
  ];
  // SR cards — 4 due now, rest spread
  const mkCard = (id, skill, front, back, context, offDays, reps) => ({
    id, skill, front, back, context, reps: reps || 0, ease: 2.5,
    interval: Math.max(1, offDays), nextReview: now + offDays * DAY_MS,
  });
  base.srCards = [
    mkCard(101, 'uoe', 'look forward to + ___', 'hearing (gerundio)', 'Verb patterns', 0, 2),
    mkCard(102, 'uoe', 'It depends ___ the context', 'on', 'Prepositions', 0, 3),
    mkCard(103, 'speaking', 'Sinónimo C1 de "very good idea"', 'a compelling / a sound idea', 'Range', 0, 1),
    mkCard(104, 'reading', 'a steep ___ in prices', 'rise / increase', 'Collocation', 0, 0),
    mkCard(105, 'writing', 'Conector de contraste formal', 'nevertheless / nonetheless', 'Cohesion', 1, 4),
    mkCard(106, 'uoe', 'Not only ___ he late, but...', 'was (inversión)', 'Inversions', 2, 1),
    mkCard(107, 'listening', 'affect vs effect', 'affect=verbo · effect=sustantivo', 'Confusables', 3, 0),
    mkCard(108, 'reading', 'to ___ a conclusion', 'draw / reach', 'Collocation', 5, 2),
    mkCard(109, 'speaking', 'Hedging para opinión', "I'd be inclined to say...", 'Speaking', 6, 1),
    mkCard(110, 'writing', 'Nominalización de "decide"', 'the decision to...', 'Word formation', 9, 3),
  ];
  // diary — consecutive recent days for a streak of 4
  const moods = [4, 3, 5, 4];
  const texts = [
    'Cerré los 20 ejercicios de word formation sin mirar reglas. UoE empieza a fluir.',
    'Día flojo de Speaking, me trabé con el long turn. Mañana repito el formato.',
    'Mock parcial de UoE: bajé de 12 a 7 errores respecto a la semana 4. 🎯 (sin emoji en UI)',
    'Shadowing de un TED sobre tecnología, mejoré el ritmo. Listening cómodo hoy.',
  ];
  base.diary = moods.map((mood, i) => {
    const ts = now - (moods.length - 1 - i) * DAY_MS;
    return { id: 200 + i, ts, date: fmtDate(ts), mood, text: texts[i], wins: i === 2 ? '7 errores en UoE (récord)' : '', struggles: i === 1 ? 'Long turn de Speaking' : '', mins: [120, 90, 150, 110][i], week: 6 };
  });
  base.readingLog = [
    { id: 301, title: 'The Guardian — The future of remote work', type: 'article', level: 'C1', expressions: 'a blurring of boundaries, to strike a balance, a double-edged sword', notes: 'Buen vocabulario de work & career.', date: fmtDate(now - 6 * DAY_MS), week: 5 },
    { id: 302, title: 'TED — How tech shapes attention', type: 'podcast_transcript', level: 'C2', expressions: 'a fleeting glance, to hijack our focus', notes: 'Transcript denso, releer.', date: fmtDate(now - 3 * DAY_MS), week: 6 },
    { id: 303, title: 'BBC 6 Minute English — Money habits', type: 'article', level: 'B2', expressions: 'to make ends meet, a nest egg', notes: '', date: fmtDate(now - 1 * DAY_MS), week: 6 },
  ];
  base.shadowLog = [
    { id: 401, source: 'TED Talk — innovation', duration: 12, difficulty: 3, notes: 'Ritmo ok, fallé en palabras largas.', date: fmtDate(now - 5 * DAY_MS) },
    { id: 402, source: 'BBC Global News podcast', duration: 10, difficulty: 4, notes: 'Acento británico rápido.', date: fmtDate(now - 2 * DAY_MS) },
    { id: 403, source: 'TED — technology future', duration: 15, difficulty: 3, notes: 'Mejoró la entonación.', date: fmtDate(now) },
  ];
  base.outputLog = [
    { id: 501, type: 'writing', prompt: 'Essay: work & career (for/against)', text: 'It is often argued that remote work has revolutionised modern employment. While there are clear benefits in terms of flexibility, one must also consider the blurring of boundaries between professional and personal life...', selfScore: 4, date: fmtDate(now - 4 * DAY_MS), week: 6 },
    { id: 502, type: 'speaking_ai', prompt: 'Part 2 long turn — technology', text: 'Both images appear to show people relying heavily on technology, though in rather different contexts. The first might suggest..., whereas the second seems to imply...', selfScore: 3, date: fmtDate(now - 2 * DAY_MS), week: 6 },
    { id: 503, type: 'writing', prompt: 'Report: a community event', text: 'The aim of this report is to outline the outcomes of the recent event and to put forward several recommendations...', selfScore: 4, date: fmtDate(now), week: 6 },
  ];
  base.totalMinutes = 6 * 5 * 110 + 470; // approx
  base.dismissedReminders = [];
  return base;
}

function useAppState() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return { ...seedState(), ...JSON.parse(raw) };
    } catch (e) { /* ignore */ }
    return seedState();
  });
  const tRef = useRef(null);
  useEffect(() => {
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    }, 350);
    return () => clearTimeout(tRef.current);
  }, [state]);
  const up = useCallback((fn) => setState(s => ({ ...s, ...fn(s) })), []);
  return { state, setState, up };
}

// ============================================================
// Small components
// ============================================================
function ProgressBar({ pct, color, lg }) {
  return React.createElement('div', { className: 'bar' + (lg ? ' lg' : '') },
    React.createElement('span', { style: { width: `${Math.min(100, Math.max(0, pct))}%`, background: color || 'var(--accent)' } }));
}

function Pill({ children, tone, icon }) {
  return React.createElement('span', { className: 'pill' + (tone ? ' ' + tone : '') },
    icon && React.createElement(Icon, { name: icon, size: 13 }), children);
}

function StatTile({ icon, label, value, sub, tone }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="row" style={{ gap: 8, marginBottom: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'var(--surface-2)', color: tone || 'var(--text-2)' }}>
          <Icon name={icon} size={17} />
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.02em' }}>{label}</span>
      </div>
      <div className="tnum" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: tone || 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SkillBar({ skill, score }) {
  const pct = Math.min(100, Math.max(0, ((score - 140) / 60) * 100));
  const c1pct = ((180 - 140) / 60) * 100;
  const gap = 180 - score;
  return (
    <div style={{ marginBottom: 13 }}>
      <div className="between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{skill.label}</span>
        <span className="tnum row" style={{ gap: 6, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: SKILL_VAR[skill.key] }}>{score}</span>
          <span style={{ color: gap > 0 ? 'var(--text-4)' : 'var(--success)', fontSize: 11 }}>
            {gap > 0 ? `${gap}→C1` : 'C1 ✓'}
          </span>
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <ProgressBar pct={pct} color={SKILL_VAR[skill.key]} />
        <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${c1pct}%`, width: 2, background: 'var(--text)', opacity: 0.45, borderRadius: 2 }} title="C1 (180)" />
      </div>
    </div>
  );
}

function InsightCard({ ins }) {
  const toneVar = { warn: 'var(--warn)', success: 'var(--success)', info: 'var(--accent-2)', danger: 'var(--danger)' }[ins.kind] || 'var(--accent-2)';
  const bgVar = { warn: 'var(--warn-soft)', success: 'var(--success-soft)', info: 'var(--accent-soft)', danger: 'var(--danger-soft)' }[ins.kind] || 'var(--accent-soft)';
  return (
    <div className="card" style={{ padding: 13, display: 'flex', gap: 11, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center', background: bgVar, color: toneVar }}>
        <Icon name={ins.icon} size={17} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{ins.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{ins.body}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return <div className="empty"><Icon name={icon || 'list'} size={30} /><p>{text}</p></div>;
}

function ScreenHead({ title, onBack, right }) {
  return (
    <div className="screen-head">
      {onBack && <button className="icon-btn" onClick={onBack} aria-label="Volver"><Icon name="left" size={18} /></button>}
      <h2 style={{ flex: 1 }}>{title}</h2>
      {right}
    </div>
  );
}

Object.assign(window, {
  seedStateFn: seedState,
  useAppState, sm2, buildInsights, computeStreak, weekCompletion, phaseOf,
  todayPlanDay, fmtDate, dayKey, DAY_MS, DAYS_ES, MOOD_LABELS,
  SKILL_VAR, CAT_LABEL, CAT_VAR, CAEHELP_D: D,
  ProgressBar, Pill, StatTile, SkillBar, InsightCard, EmptyState, ScreenHead,
});
