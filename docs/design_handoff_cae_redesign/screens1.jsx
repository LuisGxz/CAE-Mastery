/* global React, Icon, ProgressBar, Pill, StatTile, SkillBar, InsightCard, EmptyState, ScreenHead, buildInsights, computeStreak, weekCompletion, phaseOf, todayPlanDay, SKILL_VAR, CAT_VAR, CAT_LABEL */
// ============================================================
// Screens: Hoy (dashboard), Plan, Progreso
// ============================================================
const D1 = window.CAEData;
const { useState: uS1 } = React;
const ckKey = (w, d, t) => w + '-' + d + '-' + t;

function stripEmoji(str) {
  return (str || '').replace(/^[^\w¿¡A-Za-z0-9]*\s*/u, '').replace(/^(Claude|YouTube|Google|BBC)?:?\s*/, m => m).trim();
}
function resourceMeta(res) {
  if (!res) return null;
  if (res.includes('Claude')) return { icon: 'chat', label: 'Prompt para Claude', tone: 'var(--accent-2)' };
  if (res.startsWith('📺') || res.includes('YouTube')) return { icon: 'video', label: 'Buscar en YouTube', tone: 'var(--sk-uoe)' };
  if (res.startsWith('🎧')) return { icon: 'headphones', label: 'Podcast', tone: 'var(--sk-speaking)' };
  if (res.startsWith('🔍') || res.includes('Google')) return { icon: 'search', label: 'Buscar en Google', tone: 'var(--text-2)' };
  return { icon: 'bookmark', label: 'Recurso', tone: 'var(--text-2)' };
}

function ResourceBlock({ res }) {
  const [copied, setCopied] = uS1(false);
  const meta = resourceMeta(res);
  if (!meta) return null;
  const clean = res.replace(/^💬\s*Claude:\s*/, '').replace(/^📺\s*YouTube:\s*/, '').replace(/^🎧\s*/, '').replace(/^🔍\s*Google:\s*/, '').replace(/^"|"$/g, '');
  const copy = () => {
    try { navigator.clipboard?.writeText(clean); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{ marginTop: 8, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 10 }}>
      <div className="between" style={{ marginBottom: 6 }}>
        <span className="row" style={{ gap: 6, fontSize: 11.5, fontWeight: 700, color: meta.tone }}>
          <Icon name={meta.icon} size={14} /> {meta.label}
        </span>
        <button className="btn sm" onClick={copy} style={{ padding: '4px 9px' }}>
          <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, wordBreak: 'break-word' }}>{clean}</div>
    </div>
  );
}

// ---------- Task row ----------
function TaskRow({ task, week, day, checked, onToggle, defaultOpen }) {
  const [open, setOpen] = uS1(!!defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--hairline)', padding: '11px 0' }}>
      <div className="row" style={{ gap: 11, alignItems: 'flex-start' }}>
        <button
          onClick={() => onToggle(week, day, task.t)}
          aria-label="Completar"
          style={{
            width: 22, height: 22, flexShrink: 0, marginTop: 1, borderRadius: 7,
            border: checked ? 'none' : '2px solid var(--border-2)',
            background: checked ? 'var(--success)' : 'transparent',
            display: 'grid', placeItems: 'center', transition: 'all .15s ease',
          }}>
          {checked && <Icon name="check" size={13} color="#0b140d" strokeWidth={3} />}
        </button>
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
          <div className="row" style={{ gap: 7, alignItems: 'flex-start' }}>
            <span className="dot" style={{ background: CAT_VAR[task.cat], marginTop: 6 }} />
            <span style={{ fontSize: 13, lineHeight: 1.45, color: checked ? 'var(--text-4)' : 'var(--text)', textDecoration: checked ? 'line-through' : 'none' }}>{task.t}</span>
          </div>
          <div className="row between" style={{ marginLeft: 14, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--text-4)', fontStyle: 'italic' }}>{task.technique}</span>
            {(task.steps?.length || task.resource) && <Icon name={open ? 'up' : 'down'} size={14} color="var(--text-4)" />}
          </div>
        </div>
      </div>
      {open && (task.steps?.length > 0 || task.resource) && (
        <div style={{ marginLeft: 33, marginTop: 9 }}>
          {task.steps?.map((s, i) => (
            <div key={i} className="row" style={{ gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-2)', marginTop: 1, minWidth: 13 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.45 }}>{s}</span>
            </div>
          ))}
          {task.resource && <ResourceBlock res={task.resource} />}
        </div>
      )}
    </div>
  );
}

// ============================================================
// HOY (dashboard)
// ============================================================
function HoyScreen({ state, up, go }) {
  const daysLeft = D1.daysUntilExam();
  const ph = phaseOf(state.currentWeek);
  const streak = computeStreak(state.diary);
  const wc = weekCompletion(state.currentWeek, state.dailyChecks);
  const latest = k => state.scores[k][state.scores[k].length - 1].score;
  const avg = Math.round(D1.SKILLS.reduce((a, s) => a + latest(s.key), 0) / 5);
  const due = state.srCards.filter(c => c.nextReview <= Date.now());
  const insights = buildInsights(state);

  const todayName = todayPlanDay();
  const plan = D1.getWeekPlan(state.currentWeek);
  const todayPlan = plan.find(d => d.d === todayName);
  const toggleCk = (w, d, t) => up(s => { const k = ckKey(w, d, t); return { dailyChecks: { ...s.dailyChecks, [k]: !s.dailyChecks[k] } }; });

  let todayDone = 0;
  if (todayPlan) todayPlan.tasks.forEach(t => { if (state.dailyChecks[`${state.currentWeek}-${todayName}-${t.t}`]) todayDone++; });

  return (
    <div className="page">
      {/* Hero countdown */}
      <div className="card" style={{ marginTop: 14, padding: 18, background: 'linear-gradient(160deg, var(--surface-2), var(--surface))', border: '1px solid var(--border-2)' }}>
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Examen CAE C1</div>
            <div className="row" style={{ gap: 10, marginTop: 6, alignItems: 'baseline' }}>
              <span className="bignum tnum" style={{ color: 'var(--accent-2)' }}>{daysLeft}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>días</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, marginTop: 4 }}>Sábado {D1.EXAM_DATE}</div>
          </div>
          {streak.current > 0 && (
            <div style={{ textAlign: 'center', background: 'var(--warn-soft)', borderRadius: 12, padding: '9px 12px' }}>
              <Icon name="flame" size={20} color="var(--warn)" />
              <div className="tnum" style={{ fontSize: 18, fontWeight: 800, color: 'var(--warn)', lineHeight: 1.1 }}>{streak.current}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--warn)', opacity: 0.8 }}>RACHA</div>
            </div>
          )}
        </div>
        <div className="row" style={{ gap: 7, marginTop: 14, flexWrap: 'wrap' }}>
          <Pill tone="accent" icon="calendar">Semana {state.currentWeek}/27</Pill>
          <span className="pill" style={{ background: `color-mix(in oklab, ${ph.color} 16%, transparent)`, color: ph.color }}>{ph.name.replace(/Fase \d+: /, 'Fase ' + (D1.PHASES.indexOf(ph) + 1) + ' · ')}</span>
        </div>
      </div>

      {/* Tareas de hoy */}
      <div className="card">
        <div className="card-h">
          <div className="row" style={{ gap: 8 }}>
            <Icon name="today" size={18} color="var(--accent-2)" />
            <span className="card-title" style={{ whiteSpace: 'nowrap' }}>Hoy · {todayName}</span>
          </div>
          {todayPlan && <span className="card-sub tnum">{todayDone}/{todayPlan.tasks.length}</span>}
        </div>
        {!todayPlan ? (
          <div style={{ textAlign: 'center', padding: '14px 0' }}>
            <Icon name="check" size={26} color="var(--success)" />
            <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600, marginTop: 6 }}>Día de descanso. Recarga para mañana.</p>
          </div>
        ) : (
          <>
            <ProgressBar pct={todayPlan.tasks.length ? (todayDone / todayPlan.tasks.length) * 100 : 0} color="var(--success)" />
            <div style={{ marginTop: 6 }}>
              {todayPlan.tasks.map((t, i) => (
                <TaskRow key={i} task={t} week={state.currentWeek} day={todayName}
                  checked={!!state.dailyChecks[`${state.currentWeek}-${todayName}-${t.t}`]} onToggle={toggleCk} />
              ))}
            </div>
            <button className="btn ghost block" style={{ marginTop: 12 }} onClick={() => go('plan')}>
              Ver plan de la semana <Icon name="arrow" size={16} />
            </button>
          </>
        )}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <StatTile icon="trend" label="Promedio" value={avg} sub={`${Math.max(0, 180 - avg)} pts al objetivo C1`} tone={avg >= 180 ? 'var(--success)' : 'var(--text)'} />
        <StatTile icon="layers" label="Repaso hoy" value={due.length} sub={due.length ? 'Tarjetas pendientes' : 'Todo al día'} tone={due.length ? 'var(--warn)' : 'var(--success)'} />
        <StatTile icon="flame" label="Racha" value={`${streak.current}d`} sub={`Récord ${streak.max} días`} tone="var(--warn)" />
        <StatTile icon="calendar" label="Semana" value={`${wc.pct}%`} sub={`${wc.done}/${wc.total} tareas`} />
      </div>

      {/* SR CTA */}
      {due.length > 0 && (
        <button className="card block" onClick={() => go('sr')}
          style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--accent-line)', background: 'var(--accent-soft)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon name="layers" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>Repasa {due.length} tarjetas</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Repetición espaciada · 5 min</div>
          </div>
          <Icon name="right" size={18} color="var(--accent-2)" />
        </button>
      )}

      {/* Skills vs C1 */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-h">
          <span className="card-title">Habilidades vs objetivo C1</span>
          <button className="card-sub row" style={{ gap: 4, color: 'var(--accent-2)' }} onClick={() => go('progreso')}>Detalle <Icon name="right" size={13} /></button>
        </div>
        {D1.SKILLS.map(s => <SkillBar key={s.key} skill={s} score={latest(s.key)} />)}
      </div>

      {/* Consejos */}
      {insights.length > 0 && (
        <>
          <div className="section-label">Consejos y avisos</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {insights.map((ins, i) => <InsightCard key={i} ins={ins} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// PLAN
// ============================================================
function PlanScreen({ state, up }) {
  const [selW, setSelW] = uS1(state.currentWeek);
  const ph = phaseOf(selW);
  const wc = weekCompletion(selW, state.dailyChecks);
  const plan = D1.getWeekPlan(selW);
  const phIdx = D1.PHASES.indexOf(ph) + 1;
  const todayName = todayPlanDay();
  const toggleCk = (w, d, t) => up(s => { const k = ckKey(w, d, t); return { dailyChecks: { ...s.dailyChecks, [k]: !s.dailyChecks[k] } }; });

  return (
    <div className="page">
      <ScreenHead title="Plan semanal" />

      {/* week selector */}
      <div className="card" style={{ background: `color-mix(in oklab, ${ph.color} 12%, var(--surface))`, border: `1px solid color-mix(in oklab, ${ph.color} 35%, transparent)` }}>
        <div className="between">
          <button className="icon-btn" disabled={selW <= 1} onClick={() => setSelW(w => Math.max(1, w - 1))}><Icon name="left" size={18} /></button>
          <div style={{ textAlign: 'center' }}>
            <div className="tnum" style={{ fontSize: 15, fontWeight: 800 }}>Semana {selW}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{D1.weekDate(selW)}</div>
          </div>
          <button className="icon-btn" disabled={selW >= 27} onClick={() => setSelW(w => Math.min(27, w + 1))}><Icon name="right" size={18} /></button>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
          <div className="row" style={{ gap: 7, marginBottom: 6 }}>
            <span className="dot" style={{ background: ph.color, width: 8, height: 8 }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: ph.color }}>{ph.name}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{ph.focus}</div>
          <div className="row between" style={{ marginTop: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, whiteSpace: 'nowrap' }}>{ph.hrs}</span>
            <span className="tnum" style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>{wc.pct}% · {wc.done}/{wc.total}</span>
          </div>
          <div style={{ marginTop: 6 }}><ProgressBar pct={wc.pct} color={ph.color} /></div>
        </div>
        {/* quick week jump */}
        <div className="row" style={{ gap: 5, marginTop: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {Array.from({ length: 27 }, (_, i) => i + 1).map(w => (
            <button key={w} onClick={() => setSelW(w)}
              className="tnum"
              style={{
                minWidth: 30, height: 30, borderRadius: 8, fontSize: 11.5, fontWeight: 700, flexShrink: 0,
                background: w === selW ? 'var(--accent)' : 'var(--surface-2)',
                color: w === selW ? 'var(--accent-ink)' : (w < state.currentWeek ? 'var(--text-3)' : 'var(--text-2)'),
                border: w === state.currentWeek && w !== selW ? '1px solid var(--accent-line)' : '1px solid transparent',
              }}>{w}</button>
          ))}
        </div>
      </div>

      {plan.map(day => {
        const dayDone = day.tasks.filter(t => state.dailyChecks[`${selW}-${day.d}-${t.t}`]).length;
        const isToday = day.d === todayName && selW === state.currentWeek;
        return (
          <div key={day.d} className="card">
            <div className="card-h" style={{ marginBottom: 4 }}>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: day.d === 'Sábado' ? 'var(--sk-speaking)' : 'var(--text)' }}>{day.d}</span>
                {isToday && <Pill tone="accent">Hoy</Pill>}
                {day.d === 'Sábado' && <span style={{ fontSize: 11, color: 'var(--text-4)' }}>extra</span>}
              </div>
              <span className="card-sub tnum">{dayDone}/{day.tasks.length}</span>
            </div>
            {day.tasks.map((t, i) => (
              <TaskRow key={i} task={t} week={selW} day={day.d}
                checked={!!state.dailyChecks[`${selW}-${day.d}-${t.t}`]} onToggle={toggleCk} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// PROGRESO (scores + tracker)
// ============================================================
function ScoreChart({ scores }) {
  const W = 560, H = 200, padL = 34, padR = 14, padT = 14, padB = 22;
  const x = w => padL + (w / 27) * (W - padL - padR);
  const y = sc => padT + (1 - (sc - 140) / 60) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[140, 160, 180, 200].map(v => (
        <g key={v}>
          <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--hairline)" strokeWidth="1"
            strokeDasharray={v === 180 || v === 200 ? '3 3' : ''} />
          <text x={padL - 6} y={y(v) + 3.5} fill="var(--text-4)" fontSize="9" textAnchor="end" className="tnum">{v}</text>
        </g>
      ))}
      <text x={W - padR} y={y(180) - 4} fill="var(--text-3)" fontSize="9" fontWeight="700" textAnchor="end">C1</text>
      {D1.SKILLS.map(s => {
        const pts = scores[s.key]; if (pts.length < 2) return null;
        const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.week).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ');
        return <path key={s.key} d={d} fill="none" stroke={SKILL_VAR[s.key]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />;
      })}
      {D1.SKILLS.map(s => scores[s.key].map((p, i) => (
        <circle key={s.key + i} cx={x(p.week)} cy={y(p.score)} r="2.6" fill="var(--surface)" stroke={SKILL_VAR[s.key]} strokeWidth="2" />
      )))}
    </svg>
  );
}

function ProgresoScreen({ state, up }) {
  const [view, setView] = uS1('scores');
  const [draft, setDraft] = uS1({});
  const latest = k => state.scores[k][state.scores[k].length - 1].score;
  const addScore = (k) => {
    const v = parseInt(draft[k]);
    if (!v || v < 140 || v > 210) return;
    up(s => ({ scores: { ...s.scores, [k]: [...s.scores[k], { week: s.currentWeek, score: v, date: fmtDate(Date.now()) }] } }));
    setDraft(p => ({ ...p, [k]: '' }));
  };

  return (
    <div className="page">
      <ScreenHead title="Progreso" />
      <div className="segmented" style={{ width: '100%', marginBottom: 14 }}>
        <button className={view === 'scores' ? 'active' : ''} onClick={() => setView('scores')}>Puntuaciones</button>
        <button className={view === 'plan' ? 'active' : ''} onClick={() => setView('plan')}>Calendario 27 sem</button>
      </div>

      {view === 'scores' ? (
        <>
          <div className="card">
            <div className="card-h"><span className="card-title">Evolución por habilidad</span><span className="card-sub">/ 200</span></div>
            <ScoreChart scores={state.scores} />
            <div className="row" style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              {D1.SKILLS.map(s => (
                <span key={s.key} className="row" style={{ gap: 5, fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
                  <span className="dot" style={{ background: SKILL_VAR[s.key] }} />{s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="section-label">Registrar puntuación</div>
          {D1.SKILLS.map(s => {
            const sc = latest(s.key); const gap = 180 - sc;
            return (
              <div key={s.key} className="card" style={{ padding: 13, marginBottom: 10 }}>
                <div className="between" style={{ marginBottom: 9 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span className="dot" style={{ background: SKILL_VAR[s.key], width: 9, height: 9 }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</span>
                  </div>
                  <span className="tnum row" style={{ gap: 7, fontSize: 13, fontWeight: 800 }}>
                    <span style={{ color: SKILL_VAR[s.key] }}>{sc}</span>
                    <span style={{ fontSize: 11, color: gap > 0 ? 'var(--text-4)' : 'var(--success)' }}>{gap > 0 ? `${gap}→C1` : 'C1 ✓'}</span>
                  </span>
                </div>
                <SkillBar skill={s} score={sc} />
                <div className="row" style={{ gap: 7 }}>
                  <input type="number" className="inp" placeholder="Nuevo score (140–210)" min={140} max={210}
                    value={draft[s.key] || ''} onChange={e => setDraft(p => ({ ...p, [s.key]: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12.5 }} />
                  <button className="btn primary sm" onClick={() => addScore(s.key)} style={{ flexShrink: 0 }}><Icon name="plus" size={15} /></button>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {D1.PHASES.map((p, pi) => (
            <div key={p.name} style={{ marginBottom: 16 }}>
              <div className="row" style={{ gap: 7, marginBottom: 8 }}>
                <span className="dot" style={{ background: p.color, width: 8, height: 8 }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: p.color }}>{p.name}</span>
              </div>
              <div className="card" style={{ padding: 8 }}>
                {p.weeks.map((w, wi) => {
                  const c = weekCompletion(w, state.dailyChecks);
                  const cur = w === state.currentWeek;
                  return (
                    <div key={w} className="row" style={{ gap: 9, padding: '8px 6px', borderRadius: 8, background: cur ? 'var(--accent-soft)' : 'transparent', borderBottom: wi < p.weeks.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
                      <span className="tnum" style={{ fontSize: 11.5, fontWeight: cur ? 800 : 600, minWidth: 46, color: cur ? 'var(--accent-2)' : 'var(--text-2)' }}>Sem {w}</span>
                      <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)', minWidth: 78 }}>{D1.weekDate(w)}</span>
                      <div style={{ flex: 1 }}><ProgressBar pct={c.pct} color={c.pct === 100 ? 'var(--success)' : p.color} /></div>
                      <span className="tnum" style={{ fontSize: 10.5, minWidth: 30, textAlign: 'right', color: 'var(--text-3)', fontWeight: 700 }}>{c.pct}%</span>
                      {c.pct === 100
                        ? <Icon name="checkCircle" size={15} color="var(--success)" />
                        : <span style={{ width: 15, height: 15, borderRadius: 999, border: `2px solid ${w <= state.currentWeek ? 'var(--warn)' : 'var(--border-2)'}` }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="card" style={{ background: 'var(--danger-soft)', border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)', textAlign: 'center' }}>
            <div className="row" style={{ gap: 8, justifyContent: 'center', color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
              <Icon name="flag" size={16} /> Examen · Sábado {D1.EXAM_DATE} · {D1.daysUntilExam()} días
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { HoyScreen, PlanScreen, ProgresoScreen, ScoreChart, TaskRow, ResourceBlock });
