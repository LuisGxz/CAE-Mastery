import { SKILLS, TOTAL_WEEKS } from '../../data';

export default function ScoreChart({ scores }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Progreso de puntuaciones</h3>
      <svg viewBox="0 0 600 180" style={{ width: "100%", height: 180 }}>
        {[140, 160, 180, 200].map(v => {
          const y = 170 - ((v - 140) / 70) * 160;
          return (
            <g key={v}>
              <line x1="40" y1={y} x2="590" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="35" y={y + 4} fill="#64748b" fontSize="9" textAnchor="end">{v}</text>
            </g>
          );
        })}
        <line x1="40" y1={170 - ((180 - 140) / 70) * 160} x2="590" y2={170 - ((180 - 140) / 70) * 160}
          stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" strokeDasharray="4" />
        <text x="592" y={170 - ((180 - 140) / 70) * 160 + 4} fill="#3b82f6" fontSize="9" fontWeight="700">C1</text>
        <line x1="40" y1={170 - ((200 - 140) / 70) * 160} x2="590" y2={170 - ((200 - 140) / 70) * 160}
          stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeDasharray="4" />
        <text x="592" y={170 - ((200 - 140) / 70) * 160 + 4} fill="#a855f7" fontSize="9" fontWeight="700">C2</text>
        {SKILLS.map(s => {
          const pts = scores[s.key];
          if (pts.length < 2) return null;
          const d = pts.map((p, i) =>
            `${i === 0 ? "M" : "L"}${40 + (p.week / TOTAL_WEEKS) * 550},${170 - ((p.score - 140) / 70) * 160}`
          ).join(" ");
          return <path key={s.key} d={d} fill="none" stroke={s.color} strokeWidth="2" />;
        })}
        {SKILLS.map(s =>
          scores[s.key].map((p, i) => (
            <circle key={`${s.key}-${i}`}
              cx={40 + (p.week / TOTAL_WEEKS) * 550}
              cy={170 - ((p.score - 140) / 70) * 160}
              r="3.5" fill={s.color} />
          ))
        )}
      </svg>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
        {SKILLS.map(s => (
          <span key={s.key} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#94a3b8" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, display: "inline-block" }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
