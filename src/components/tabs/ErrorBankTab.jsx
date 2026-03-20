import { useState } from 'react';
import { SKILLS } from '../../data';

const EMPTY_FORM = { skill: 'uoe', text: '', correction: '', rule: '', why: '' };

export default function ErrorBankTab({ state, up }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'mastered'

  const errBySk = SKILLS.reduce((a, s) => ({
    ...a, [s.key]: state.errors.filter(e => e.skill === s.key && !e.mastered).length
  }), {});

  const addError = () => {
    if (!form.text) return;
    up(s => ({ errors: [...s.errors, { ...form, id: Date.now(), date: new Date().toLocaleDateString(), mastered: false }] }));
    setForm(EMPTY_FORM);
  };

  const toggleMastered = (id) => {
    up(s => ({ errors: s.errors.map(e => e.id === id ? { ...e, mastered: !e.mastered } : e) }));
  };

  // Error → SR: creates a flashcard from the error entry
  const errorToSR = (err) => {
    const card = {
      id: Date.now(),
      skill: err.skill,
      front: err.text,
      back: err.correction || '(sin corrección)',
      context: err.why || err.rule || '',
      interval: 1,
      nextReview: Date.now() + 86400000,
      ease: 2.5,
      reps: 0,
    };
    up(s => ({ srCards: [...s.srCards, card] }));
  };

  const visible = [...state.errors]
    .reverse()
    .filter(e => filter === 'all' ? true : filter === 'mastered' ? e.mastered : !e.mastered);

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Banco de Errores</h2>

      {/* Add form */}
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <select value={form.skill} onChange={e => setForm(p => ({ ...p, skill: e.target.value }))} className="inp">
            {SKILLS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <input value={form.rule} onChange={e => setForm(p => ({ ...p, rule: e.target.value }))} placeholder="Categoría (ej: Conditionals)" className="inp" />
        </div>
        <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="❌ Frase con error" rows={2} className="inp" style={{ marginBottom: 6 }} />
        <textarea value={form.correction} onChange={e => setForm(p => ({ ...p, correction: e.target.value }))} placeholder="✅ Corrección" rows={2} className="inp" style={{ marginBottom: 6 }} />
        <input value={form.why} onChange={e => setForm(p => ({ ...p, why: e.target.value }))} placeholder="💡 ¿Por qué es un error?" className="inp" style={{ marginBottom: 8 }} />
        <button onClick={addError} className="btn" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>+ Agregar error</button>
      </div>

      {/* Per-skill counts */}
      <div className="grid-skills" style={{ marginBottom: 10 }}>
        {SKILLS.map(s => (
          <div key={s.key} className="card" style={{ textAlign: "center", padding: 8, marginBottom: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{errBySk[s.key]}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {['all', 'pending', 'mastered'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="tab" style={filter === f ? { background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff" } : {}}>
            {f === 'all' ? `Todos (${state.errors.length})` : f === 'pending' ? `Pendientes (${state.errors.filter(e => !e.mastered).length})` : `Dominados (${state.errors.filter(e => e.mastered).length})`}
          </button>
        ))}
      </div>

      {visible.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>No hay errores en esta categoría.</p>}

      {visible.map(err => {
        const sk = SKILLS.find(s => s.key === err.skill);
        const alreadyInSR = state.srCards.some(c => c.front === err.text);
        return (
          <div key={err.id} className="card" style={{ padding: 12, marginBottom: 6, opacity: err.mastered ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: sk?.color, textTransform: "uppercase" }}>{sk?.label}</span>
                {err.rule && <span style={{ fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>{err.rule}</span>}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#64748b" }}>{err.date}</span>
                <button onClick={() => errorToSR(err)} disabled={alreadyInSR}
                  style={{ fontSize: 10, background: alreadyInSR ? "rgba(6,182,212,0.1)" : "rgba(6,182,212,0.2)", color: alreadyInSR ? "#64748b" : "#06b6d4", border: "none", borderRadius: 4, padding: "2px 8px", cursor: alreadyInSR ? "default" : "pointer" }}>
                  {alreadyInSR ? "✓ En SR" : "→ SR"}
                </button>
                <button onClick={() => toggleMastered(err.id)}
                  style={{ fontSize: 10, background: err.mastered ? "#22c55e" : "rgba(255,255,255,0.1)", color: err.mastered ? "#fff" : "#94a3b8", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>
                  {err.mastered ? "✓ Dominado" : "Pendiente"}
                </button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#fca5a5", marginBottom: 2 }}>❌ {err.text}</div>
            {err.correction && <div style={{ fontSize: 12, color: "#86efac", marginBottom: 2 }}>✅ {err.correction}</div>}
            {err.why && <div style={{ fontSize: 11, color: "#60a5fa", fontStyle: "italic" }}>💡 {err.why}</div>}
          </div>
        );
      })}
    </div>
  );
}
