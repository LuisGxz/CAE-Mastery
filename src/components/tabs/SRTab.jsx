import { useState } from 'react';
import { SKILLS } from '../../data';
import DueCard from '../shared/DueCard';

const EMPTY_FORM = { front: '', back: '', skill: 'uoe', context: '' };

function sm2(card, q) {
  let { interval: iv, ease: ea, reps: rp } = card;
  if (q < 3) { iv = 1; rp = 0; }
  else {
    if (rp === 0) iv = 1;
    else if (rp === 1) iv = 3;
    else iv = Math.round(iv * ea);
    ea = Math.max(1.3, ea + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    rp++;
  }
  return { interval: iv, ease: ea, reps: rp, nextReview: Date.now() + iv * 86400000 };
}

export default function SRTab({ state, up }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const due = state.srCards.filter(c => c.nextReview <= Date.now());
  const upcoming = state.srCards.filter(c => {
    const days = (c.nextReview - Date.now()) / 86400000;
    return days > 0 && days <= 7;
  }).length;

  const addCard = () => {
    if (!form.front) return;
    up(s => ({
      srCards: [...s.srCards, {
        ...form,
        id: Date.now(),
        interval: 1,
        nextReview: Date.now() + 86400000,
        ease: 2.5,
        reps: 0,
      }],
    }));
    setForm(EMPTY_FORM);
  };

  const reviewCard = (id, q) => {
    up(s => ({
      srCards: s.srCards.map(c => c.id !== id ? c : { ...c, ...sm2(c, q) }),
    }));
  };

  const deleteCard = (id) => {
    up(s => ({ srCards: s.srCards.filter(c => c.id !== id) }));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Spaced Repetition</h2>
        <div style={{ display: "flex", gap: 6 }}>
          <span className="pill" style={{ background: due.length > 0 ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.15)", color: due.length > 0 ? "#fcd34d" : "#86efac", fontSize: 11 }}>
            {due.length} pendientes
          </span>
          <span className="pill" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", fontSize: 11 }}>
            {upcoming} en 7 días
          </span>
          <span className="pill" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontSize: 11 }}>
            {state.srCards.length} total
          </span>
        </div>
      </div>

      {/* Add form */}
      <div className="card">
        <select value={form.skill} onChange={e => setForm(p => ({ ...p, skill: e.target.value }))} className="inp" style={{ marginBottom: 6 }}>
          {SKILLS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <input value={form.front} onChange={e => setForm(p => ({ ...p, front: e.target.value }))} placeholder="Frente (pregunta / error / expresión)" className="inp" style={{ marginBottom: 6 }} />
        <input value={form.back} onChange={e => setForm(p => ({ ...p, back: e.target.value }))} placeholder="Reverso (respuesta / corrección)" className="inp" style={{ marginBottom: 6 }} />
        <input value={form.context} onChange={e => setForm(p => ({ ...p, context: e.target.value }))} placeholder="Contexto (opcional)" className="inp" style={{ marginBottom: 8 }} />
        <button onClick={addCard} className="btn" style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>+ Crear tarjeta</button>
      </div>

      {/* Due cards */}
      {due.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", marginBottom: 8 }}>⏰ Revisar hoy ({due.length})</h3>
          {due.map(c => <DueCard key={c.id} card={c} onReview={reviewCard} />)}
        </div>
      )}

      {/* All cards */}
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Todas las tarjetas ({state.srCards.length})</h3>
      {state.srCards.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primera tarjeta pendiente.</p>}
      {[...state.srCards].sort((a, b) => a.nextReview - b.nextReview).map(c => {
        const sk = SKILLS.find(s => s.key === c.skill);
        const daysUntil = Math.ceil((c.nextReview - Date.now()) / 86400000);
        return (
          <div key={c.id} className="card" style={{ padding: 10, marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12 }}>{c.front}</span>
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>→ {c.back}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 9, color: sk?.color }}>{daysUntil <= 0 ? "hoy" : `${daysUntil}d`}</span>
              <button onClick={() => deleteCard(c.id)} style={{ fontSize: 10, background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>×</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
