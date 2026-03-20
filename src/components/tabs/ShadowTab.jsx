import { useState } from 'react';

const EMPTY_FORM = { source: '', duration: 10, difficulty: 3, notes: '' };

export default function ShadowTab({ state, up }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const addEntry = () => {
    if (!form.source) return;
    up(s => ({ shadowLog: [...s.shadowLog, { ...form, id: Date.now(), date: new Date().toLocaleDateString() }] }));
    setForm(EMPTY_FORM);
  };

  const totalMin = state.shadowLog.reduce((a, s) => a + (s.duration || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Shadowing</h2>
        <span className="pill" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", fontSize: 11 }}>
          {Math.floor(totalMin / 60)}h {totalMin % 60}min totales
        </span>
      </div>

      <div className="card">
        <input value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
          placeholder="Fuente (TED Talk, podcast, noticia...)" className="inp" style={{ marginBottom: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>Minutos</label>
            <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))} className="inp" />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>Dificultad</label>
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setForm(p => ({ ...p, difficulty: n }))} className="diff-btn"
                  style={form.difficulty === n ? { background: "#3b82f6", color: "#fff" } : {}}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          placeholder="¿Qué fue difícil? ¿Qué mejorar?" rows={2} className="inp" style={{ marginBottom: 8 }} />
        <button onClick={addEntry} className="btn" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>+ Log sesión</button>
      </div>

      {state.shadowLog.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primera sesión pendiente.</p>}

      {[...state.shadowLog].reverse().map(s => (
        <div key={s.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{s.source}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#64748b" }}>{s.date} | {s.duration}min</span>
              <span style={{ fontSize: 10, color: "#94a3b8" }}>Dif: {s.difficulty}/5</span>
            </div>
          </div>
          {s.notes && <p style={{ fontSize: 11, color: "#94a3b8" }}>{s.notes}</p>}
        </div>
      ))}
    </div>
  );
}
