import { useState } from 'react';
import { PHASES, TOTAL_WEEKS, getWeekPlan, weekDate } from '../../data';
import { Icon, ProgressBar, Pill, TaskRow } from '../ui';
import { phaseOf, weekCompletion, todayPlanDay, checkKey } from '../../lib/logic';

export default function PlanScreen({ state, up }) {
  const [selW, setSelW] = useState(state.currentWeek);
  const ph = phaseOf(selW);
  const wc = weekCompletion(selW, state.dailyChecks);
  const plan = getWeekPlan(selW);
  const todayName = todayPlanDay();
  const toggleCk = (w, d, t) => up((s) => { const k = checkKey(w, d, t); return { dailyChecks: { ...s.dailyChecks, [k]: !s.dailyChecks[k] } }; });

  return (
    <div className="page">
      <div className="ds-card" style={{ marginTop: 14, background: `color-mix(in oklab, ${ph.color} 12%, var(--surface))`, border: `1px solid color-mix(in oklab, ${ph.color} 35%, transparent)` }}>
        <div className="between">
          <button className="icon-btn" disabled={selW <= 1} onClick={() => setSelW((w) => Math.max(1, w - 1))}><Icon name="left" size={18} /></button>
          <div style={{ textAlign: 'center' }}>
            <div className="tnum" style={{ fontSize: 15, fontWeight: 800 }}>Semana {selW}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{weekDate(selW)}</div>
          </div>
          <button className="icon-btn" disabled={selW >= TOTAL_WEEKS} onClick={() => setSelW((w) => Math.min(TOTAL_WEEKS, w + 1))}><Icon name="right" size={18} /></button>
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
        <div className="row" style={{ gap: 5, marginTop: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((w) => (
            <button key={w} onClick={() => setSelW(w)} className="tnum"
              style={{
                minWidth: 30, height: 30, borderRadius: 8, fontSize: 11.5, fontWeight: 700, flexShrink: 0,
                background: w === selW ? 'var(--accent)' : 'var(--surface-2)',
                color: w === selW ? 'var(--accent-ink)' : (w < state.currentWeek ? 'var(--text-3)' : 'var(--text-2)'),
                border: w === state.currentWeek && w !== selW ? '1px solid var(--accent-line)' : '1px solid transparent',
              }}>{w}</button>
          ))}
        </div>
      </div>

      {plan.map((day) => {
        const dayDone = day.tasks.filter((t) => state.dailyChecks[checkKey(selW, day.d, t.t)]).length;
        const isToday = day.d === todayName && selW === state.currentWeek;
        return (
          <div key={day.d} className="ds-card" style={{ marginTop: 12 }}>
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
                checked={!!state.dailyChecks[checkKey(selW, day.d, t.t)]} onToggle={toggleCk} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
