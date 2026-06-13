import { SKILLS, PHASES, TOTAL_WEEKS, EXAM_DATE, getWeekPlan, daysUntilExam } from '../../data';
import { Icon, ProgressBar, Pill, StatTile, SkillBar, InsightCard, TaskRow } from '../ui';
import { phaseOf, computeStreak, weekCompletion, buildInsights, todayPlanDay, checkKey } from '../../lib/logic';

export default function HoyScreen({ state, up, go, now }) {
  const daysLeft = daysUntilExam();
  const ph = phaseOf(state.currentWeek);
  const streak = computeStreak(state.diary, now);
  const wc = weekCompletion(state.currentWeek, state.dailyChecks);
  const latest = (k) => state.scores[k][state.scores[k].length - 1].score;
  const avg = Math.round(SKILLS.reduce((a, s) => a + latest(s.key), 0) / 5);
  const due = state.srCards.filter((c) => c.nextReview <= now);
  const insights = buildInsights(state, now);

  const todayName = todayPlanDay();
  const plan = getWeekPlan(state.currentWeek);
  const todayPlan = plan.find((d) => d.d === todayName);
  const toggleCk = (w, d, t) => up((s) => { const k = checkKey(w, d, t); return { dailyChecks: { ...s.dailyChecks, [k]: !s.dailyChecks[k] } }; });

  let todayDone = 0;
  if (todayPlan) todayPlan.tasks.forEach((t) => { if (state.dailyChecks[checkKey(state.currentWeek, todayName, t.t)]) todayDone++; });

  return (
    <div className="page">
      <div className="ds-card" style={{ marginTop: 14, padding: 18, background: 'linear-gradient(160deg, var(--surface-2), var(--surface))', border: '1px solid var(--border-2)' }}>
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Examen CAE C1</div>
            <div className="row" style={{ gap: 10, marginTop: 6, alignItems: 'baseline' }}>
              <span className="bignum tnum" style={{ color: 'var(--accent-2)' }}>{daysLeft}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>días</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, marginTop: 4 }}>Sábado {EXAM_DATE}</div>
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
          <Pill tone="accent" icon="calendar">Semana {state.currentWeek}/{TOTAL_WEEKS}</Pill>
          <span className="ds-pill" style={{ background: `color-mix(in oklab, ${ph.color} 16%, transparent)`, color: ph.color }}>
            {`Fase ${PHASES.indexOf(ph) + 1} · ${ph.name.replace(/Fase \d+: /, '')}`}
          </span>
        </div>
      </div>

      <div className="ds-card" style={{ marginTop: 12 }}>
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
                  checked={!!state.dailyChecks[checkKey(state.currentWeek, todayName, t.t)]} onToggle={toggleCk} />
              ))}
            </div>
            <button className="ds-btn ghost block" style={{ marginTop: 12 }} onClick={() => go('plan')}>
              Ver plan de la semana <Icon name="arrow" size={16} />
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <StatTile icon="trend" label="Promedio" value={avg} sub={`${Math.max(0, 180 - avg)} pts al objetivo C1`} tone={avg >= 180 ? 'var(--success)' : 'var(--text)'} />
        <StatTile icon="layers" label="Repaso hoy" value={due.length} sub={due.length ? 'Tarjetas pendientes' : 'Todo al día'} tone={due.length ? 'var(--warn)' : 'var(--success)'} />
        <StatTile icon="flame" label="Racha" value={`${streak.current}d`} sub={`Récord ${streak.max} días`} tone="var(--warn)" />
        <StatTile icon="calendar" label="Semana" value={`${wc.pct}%`} sub={`${wc.done}/${wc.total} tareas`} />
      </div>

      {due.length > 0 && (
        <button className="ds-card block" onClick={() => go('sr')}
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

      <div className="ds-card" style={{ marginTop: 12 }}>
        <div className="card-h">
          <span className="card-title">Habilidades vs objetivo C1</span>
          <button className="card-sub row" style={{ gap: 4, color: 'var(--accent-2)' }} onClick={() => go('progreso')}>Detalle <Icon name="right" size={13} /></button>
        </div>
        {SKILLS.map((s) => <SkillBar key={s.key} skill={s} score={latest(s.key)} />)}
      </div>

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
