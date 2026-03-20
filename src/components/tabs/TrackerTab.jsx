import { PHASES, TOTAL_WEEKS, weekDate, daysUntilExam, getWeekPlan, EXAM_DATE } from '../../data';

function compW(w, dailyChecks) {
  const plan = getWeekPlan(w);
  let total = 0, done = 0;
  plan.forEach(day => day.tasks.forEach(tk => {
    total++;
    if (dailyChecks[`${w}-${day.d}-${tk.t}`]) done++;
  }));
  return total ? Math.round((done / total) * 100) : 0;
}

export default function TrackerTab({ state }) {
  const daysLeft = daysUntilExam();

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Tracker {TOTAL_WEEKS} Semanas</h2>
      {PHASES.map(ph => (
        <div key={ph.name} style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: ph.color, marginBottom: 6 }}>
            {ph.name} <span style={{ fontWeight: 400, color: "#64748b" }}>— {ph.hrs}</span>
          </h3>
          {ph.weeks.map(w => {
            const c = compW(w, state.dailyChecks);
            const cur = w === state.currentWeek;
            return (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 8, marginBottom: 2, background: cur ? "rgba(59,130,246,0.1)" : "transparent" }}>
                <span style={{ fontSize: 11, fontWeight: cur ? 700 : 400, minWidth: 55, color: cur ? "#e2e8f0" : "#94a3b8" }}>
                  Sem {w}{cur ? " ←" : ""}
                </span>
                <span style={{ fontSize: 10, color: "#64748b", minWidth: 95 }}>{weekDate(w)}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${c}%`, background: c === 100 ? "#22c55e" : ph.color }} />
                </div>
                <span style={{ fontSize: 10, minWidth: 30, textAlign: "right" }}>{c}%</span>
                <span style={{ fontSize: 11 }}>{c === 100 ? "✅" : c > 0 ? "🔄" : w <= state.currentWeek ? "⚠️" : "⏳"}</span>
              </div>
            );
          })}
        </div>
      ))}
      <div className="card" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", textAlign: "center", fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>
        📅 EXAMEN: Sábado {EXAM_DATE} — {daysLeft} días
      </div>
    </div>
  );
}
