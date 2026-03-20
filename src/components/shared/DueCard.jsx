import { useState } from 'react';
import { SKILLS } from '../../data';

export default function DueCard({ card, onReview }) {
  const [show, setShow] = useState(false);
  const sk = SKILLS.find(s => s.key === card.skill);

  return (
    <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 14, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: sk?.color, fontWeight: 600 }}>{sk?.label}</span>
        <span style={{ fontSize: 10, color: "#64748b" }}>Rep #{card.reps} | {card.interval}d</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>{card.front}</div>
      {!show ? (
        <button onClick={() => setShow(true)} className="btn" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12 }}>
          Mostrar respuesta
        </button>
      ) : (
        <div>
          <div style={{ fontSize: 13, color: "#86efac", marginBottom: 10, padding: "8px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8 }}>
            {card.back}
            {card.context && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>📎 {card.context}</div>}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ q: 1, l: "No sé", bg: "#ef4444" }, { q: 3, l: "Difícil", bg: "#f59e0b" }, { q: 4, l: "Bien", bg: "#3b82f6" }, { q: 5, l: "Fácil", bg: "#22c55e" }].map(b => (
              <button key={b.q} onClick={() => onReview(card.id, b.q)} className="btn" style={{ flex: 1, background: b.bg, padding: 6, fontSize: 12 }}>
                {b.l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
