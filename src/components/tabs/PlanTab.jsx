import { useState } from 'react';
import { PHASES, TOTAL_WEEKS, CAT_COLORS, weekDate, getWeekPlan } from '../../data';

function compW(w, dailyChecks) {
  const plan = getWeekPlan(w);
  let total = 0, done = 0;
  plan.forEach(day => day.tasks.forEach(tk => {
    total++;
    if (dailyChecks[`${w}-${day.d}-${tk.t}`]) done++;
  }));
  return total ? Math.round((done / total) * 100) : 0;
}

export default function PlanTab({ state, up }) {
  const [selW, setSelW] = useState(state.currentWeek);
  const phF = w => PHASES.find(p => p.weeks.includes(w));
  const ph = phF(selW);
  const pct = compW(selW, state.dailyChecks);

  const toggleCk = (w, d, tk) => {
    const k = `${w}-${d}-${tk}`;
    up(s => ({ dailyChecks: { ...s.dailyChecks, [k]: !s.dailyChecks[k] } }));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Plan Semanal</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSelW(w => Math.max(1, w - 1))} className="tab">←</button>
          <span style={{ fontWeight: 700, minWidth: 140, textAlign: "center", fontSize: 13 }}>Sem {selW} ({weekDate(selW)})</span>
          <button onClick={() => setSelW(w => Math.min(TOTAL_WEEKS, w + 1))} className="tab">→</button>
        </div>
      </div>

      <div className="card" style={{ background: `${ph?.color}18`, borderColor: `${ph?.color}30` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: ph?.color, fontWeight: 700, fontSize: 13 }}>{ph?.name}</span>
          <span style={{ color: "#94a3b8", fontSize: 12 }}>{ph?.hrs}</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 6 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: ph?.color }} />
        </div>
        <span style={{ fontSize: 11, color: "#64748b" }}>{pct}% completado</span>
      </div>

      {getWeekPlan(selW).map(day => (
        <div key={day.d} className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: day.d === "Sábado" ? "#ec4899" : "#60a5fa", marginBottom: 10 }}>
            {day.d}{day.d === "Sábado" ? " (extra)" : ""}
          </h3>
          {day.tasks.map((task, i) => {
            const ck = state.dailyChecks[`${selW}-${day.d}-${task.t}`];
            return (
              <div key={i} className={`check-item ${ck ? "done" : ""}`} onClick={() => toggleCk(selW, day.d, task.t)}>
                <div className={`checkbox ${ck ? "checked" : ""}`}>
                  {ck && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: CAT_COLORS[task.cat], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: ck ? "#86efac" : "#cbd5e1", textDecoration: ck ? "line-through" : "none", lineHeight: 1.4 }}>
                      {task.t}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, marginLeft: 12, fontStyle: "italic" }}>
                    💡 {task.technique}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
