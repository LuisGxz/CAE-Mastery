import { useState } from 'react';
import { SKILLS, TOTAL_WEEKS, PHASES, REMINDERS, weekDate, daysUntilExam, getWeekPlan } from '../../data';
import ScoreChart from '../shared/ScoreChart';

function computeStreak(diary) {
  if (!diary.length) return { current: 0, max: 0 };
  const dateSet = new Set();
  diary.forEach(e => {
    try {
      const parts = e.date.split('/');
      if (parts.length === 3) {
        const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        if (!isNaN(d)) dateSet.add(d.toDateString());
      }
    } catch { /* skip malformed dates */ }
  });
  if (!dateSet.size) return { current: 0, max: 0 };
  const dates = Array.from(dateSet).map(s => new Date(s)).sort((a, b) => a - b);
  let maxStreak = 1, streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / 86400000;
    if (diff === 1) { streak++; maxStreak = Math.max(maxStreak, streak); }
    else if (diff > 1) { streak = 1; }
  }
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const last = new Date(dates[dates.length - 1]); last.setHours(0, 0, 0, 0);
  return { current: last >= yesterday ? streak : 0, max: maxStreak };
}

export default function HomeTab({ state, up }) {
  const [newScore, setNewScore] = useState({});

  const daysLeft = daysUntilExam();
  const phF = w => PHASES.find(p => p.weeks.includes(w));
  const phN = w => phF(w)?.name || '';
  const compW = w => {
    const plan = getWeekPlan(w);
    let total = 0, done = 0;
    plan.forEach(day => day.tasks.forEach(tk => {
      total++;
      if (state.dailyChecks[`${w}-${day.d}-${tk.t}`]) done++;
    }));
    return total ? Math.round((done / total) * 100) : 0;
  };

  const avgScore = Math.round(SKILLS.reduce((a, s) => a + state.scores[s.key][state.scores[s.key].length - 1].score, 0) / 5);
  const minScore = Math.min(...SKILLS.map(s => state.scores[s.key][state.scores[s.key].length - 1].score));
  const errBySk = SKILLS.reduce((a, s) => ({ ...a, [s.key]: state.errors.filter(e => e.skill === s.key && !e.mastered).length }), {});
  const streak = computeStreak(state.diary);
  const activeReminders = REMINDERS.filter(r => r.week === state.currentWeek && !(state.dismissedReminders || []).includes(r.text));

  const addScore = (sk) => {
    const v = parseInt(newScore[sk]);
    if (!v || v < 140 || v > 210) return;
    up(s => ({ scores: { ...s.scores, [sk]: [...s.scores[sk], { week: s.currentWeek, score: v, date: new Date().toLocaleDateString() }] } }));
    setNewScore(p => ({ ...p, [sk]: '' }));
  };

  const ph = phF(state.currentWeek);

  return (
    <div>
      {/* Reminders */}
      {activeReminders.map((r, i) => (
        <div key={i} className={`reminder ${r.type}`}>
          <span style={{ fontSize: 13, fontWeight: 600, color: r.type === "urgent" ? "#fca5a5" : r.type === "success" ? "#86efac" : "#93c5fd" }}>{r.text}</span>
          <button onClick={() => up(s => ({ dismissedReminders: [...(s.dismissedReminders || []), r.text] }))}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      ))}

      {/* Phase card */}
      <div className="card" style={{ background: `${ph?.color}18`, borderColor: `${ph?.color}40` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: ph?.color, fontWeight: 700, fontSize: 14 }}>{phN(state.currentWeek)}</span>
            <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{ph?.focus}</p>
            <p style={{ color: "#c084fc", fontSize: 11, marginTop: 2 }}>🎯 {ph?.target} — {ph?.hrs}</p>
          </div>
          <select value={state.currentWeek} onChange={e => up(() => ({ currentWeek: parseInt(e.target.value) }))}
            style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #475569", borderRadius: 6, padding: "4px 8px", fontSize: 13 }}>
            {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
              <option key={i + 1} value={i + 1}>Sem {i + 1} ({weekDate(i + 1)})</option>
            ))}
          </select>
        </div>
        <div className="progress-bar" style={{ marginTop: 10, height: 8 }}>
          <div className="progress-fill" style={{ width: `${(state.currentWeek / TOTAL_WEEKS) * 100}%`, background: `linear-gradient(90deg,${ph?.color},#8b5cf6)` }} />
        </div>
        <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Semana {state.currentWeek}/{TOTAL_WEEKS} — {compW(state.currentWeek)}% — {weekDate(state.currentWeek)}</p>
      </div>

      {/* Stats pills row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <span className="pill" style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", fontWeight: 600 }}>{daysLeft} días</span>
        <span className="pill" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}>Prom: {avgScore}</span>
        <span className="pill" style={{ background: "rgba(245,158,11,0.15)", color: "#fcd34d" }}>Min: {minScore}</span>
        {streak.current > 0 && (
          <span className="pill" style={{ background: "rgba(34,197,94,0.15)", color: "#86efac", fontWeight: 700 }}>
            🔥 {streak.current} día{streak.current > 1 ? 's' : ''} seguido{streak.current > 1 ? 's' : ''}
          </span>
        )}
        {streak.max > 0 && (
          <span className="pill" style={{ background: "rgba(168,85,247,0.1)", color: "#c4b5fd", fontSize: 11 }}>
            Récord: {streak.max}d
          </span>
        )}
      </div>

      {/* Status message */}
      <div className="card" style={{ background: "rgba(168,85,247,0.08)", borderColor: "rgba(168,85,247,0.2)", fontSize: 12 }}>
        <strong style={{ color: "#c084fc" }}>📈 </strong>
        <span style={{ color: "#94a3b8" }}>
          {avgScore >= 200 ? "Rango Grade A (C2)!" : avgScore >= 193 ? "Rango Grade B (C1) — muy bien" : avgScore >= 180 ? "C1 alcanzado — a consolidar" : avgScore >= 170 ? "Casi C1 — semanas decisivas" : `Necesitas +${180 - avgScore} puntos — enfócate en UoE y Speaking`}
        </span>
      </div>

      {/* Skill cards */}
      <div className="grid-5" style={{ marginBottom: 12 }}>
        {SKILLS.map(s => {
          const latest = state.scores[s.key][state.scores[s.key].length - 1].score;
          const gap = Math.max(0, s.c1 - latest);
          const pct = Math.min(100, ((latest - 140) / 70) * 100);
          return (
            <div key={s.key} className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{latest}</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 4 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: s.color }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b" }}>
                <span>{gap > 0 ? `${gap}→C1` : latest >= 200 ? "Grade A!" : "C1 ✓"}</span>
                <span>{errBySk[s.key] > 0 ? `${errBySk[s.key]} err` : '✓'}</span>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <input type="number" placeholder="Score" value={newScore[s.key] || ''} min={140} max={210}
                  onChange={e => setNewScore(p => ({ ...p, [s.key]: e.target.value }))}
                  className="inp" style={{ padding: "4px 6px", fontSize: 11 }} />
                <button onClick={() => addScore(s.key)} className="btn" style={{ background: s.color, padding: "4px 10px", fontSize: 11 }}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress chart */}
      <ScoreChart scores={state.scores} />
    </div>
  );
}
