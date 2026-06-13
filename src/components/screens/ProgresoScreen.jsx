import { useState } from 'react';
import { SKILLS, PHASES, TOTAL_WEEKS, EXAM_DATE, weekDate, daysUntilExam } from '../../data';
import { Icon, ProgressBar, SkillBar } from '../ui';
import { weekCompletion, fmtDate, SKILL_VAR } from '../../lib/logic';

function ScoreChart({ scores }) {
  const W = 560, H = 200, padL = 34, padR = 14, padT = 14, padB = 22;
  const x = (w) => padL + (w / TOTAL_WEEKS) * (W - padL - padR);
  const y = (sc) => padT + (1 - (sc - 140) / 60) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[140, 160, 180, 200].map((v) => (
        <g key={v}>
          <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--hairline)" strokeWidth="1" strokeDasharray={v === 180 || v === 200 ? '3 3' : ''} />
          <text x={padL - 6} y={y(v) + 3.5} fill="var(--text-4)" fontSize="9" textAnchor="end" className="tnum">{v}</text>
        </g>
      ))}
      <text x={W - padR} y={y(180) - 4} fill="var(--text-3)" fontSize="9" fontWeight="700" textAnchor="end">C1</text>
      {SKILLS.map((s) => {
        const pts = scores[s.key]; if (pts.length < 2) return null;
        const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.week).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ');
        return <path key={s.key} d={d} fill="none" stroke={SKILL_VAR[s.key]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />;
      })}
      {SKILLS.map((s) => scores[s.key].map((p, i) => (
        <circle key={s.key + i} cx={x(p.week)} cy={y(p.score)} r="2.6" fill="var(--surface)" stroke={SKILL_VAR[s.key]} strokeWidth="2" />
      )))}
    </svg>
  );
}

export default function ProgresoScreen({ state, up }) {
  const [view, setView] = useState('scores');
  const [draft, setDraft] = useState({});
  const latest = (k) => state.scores[k][state.scores[k].length - 1].score;
  const addScore = (k) => {
    const v = parseInt(draft[k], 10);
    if (!v || v < 140 || v > 210) return;
    up((s) => ({ scores: { ...s.scores, [k]: [...s.scores[k], { week: s.currentWeek, score: v, date: fmtDate(Date.now()) }] } }));
    setDraft((p) => ({ ...p, [k]: '' }));
  };

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="segmented" style={{ width: '100%', marginBottom: 14 }}>
        <button className={view === 'scores' ? 'active' : ''} onClick={() => setView('scores')}>Puntuaciones</button>
        <button className={view === 'plan' ? 'active' : ''} onClick={() => setView('plan')}>Calendario {TOTAL_WEEKS} sem</button>
      </div>

      {view === 'scores' ? (
        <>
          <div className="ds-card">
            <div className="card-h"><span className="card-title">Evolución por habilidad</span><span className="card-sub">/ 200</span></div>
            <ScoreChart scores={state.scores} />
            <div className="row" style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              {SKILLS.map((s) => (
                <span key={s.key} className="row" style={{ gap: 5, fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
                  <span className="dot" style={{ background: SKILL_VAR[s.key] }} />{s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="section-label">Registrar puntuación</div>
          {SKILLS.map((s) => {
            const sc = latest(s.key); const gap = 180 - sc;
            return (
              <div key={s.key} className="ds-card" style={{ padding: 13, marginTop: 10 }}>
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
                  <input type="number" className="ds-inp" placeholder="Nuevo score (140–210)" min={140} max={210}
                    value={draft[s.key] || ''} onChange={(e) => setDraft((p) => ({ ...p, [s.key]: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12.5 }} />
                  <button className="ds-btn primary sm" onClick={() => addScore(s.key)} style={{ flexShrink: 0 }}><Icon name="plus" size={15} /></button>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {PHASES.map((p) => (
            <div key={p.name} style={{ marginBottom: 16 }}>
              <div className="row" style={{ gap: 7, marginBottom: 8 }}>
                <span className="dot" style={{ background: p.color, width: 8, height: 8 }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: p.color }}>{p.name}</span>
              </div>
              <div className="ds-card" style={{ padding: 8 }}>
                {p.weeks.map((w, wi) => {
                  const c = weekCompletion(w, state.dailyChecks);
                  const cur = w === state.currentWeek;
                  return (
                    <div key={w} className="row" style={{ gap: 9, padding: '8px 6px', borderRadius: 8, background: cur ? 'var(--accent-soft)' : 'transparent', borderBottom: wi < p.weeks.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
                      <span className="tnum" style={{ fontSize: 11.5, fontWeight: cur ? 800 : 600, minWidth: 46, color: cur ? 'var(--accent-2)' : 'var(--text-2)' }}>Sem {w}</span>
                      <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)', minWidth: 78 }}>{weekDate(w)}</span>
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
          <div className="ds-card" style={{ background: 'var(--danger-soft)', border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)', textAlign: 'center' }}>
            <div className="row" style={{ gap: 8, justifyContent: 'center', color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
              <Icon name="flag" size={16} /> Examen · Sábado {EXAM_DATE} · {daysUntilExam()} días
            </div>
          </div>
        </>
      )}
    </div>
  );
}
