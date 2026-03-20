import { useState } from 'react';

const EMPTY_FORM = { type: 'writing', prompt: '', text: '', selfScore: 3 };
const TYPES = ['writing', 'speaking_solo', 'speaking_partner', 'speaking_ai'];
const TYPE_LABELS = { writing: 'Writing', speaking_solo: 'Speaking (solo)', speaking_partner: 'Speaking (partner)', speaking_ai: 'Speaking (IA)' };

export default function OutputTab({ state, up }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [expanded, setExpanded] = useState(null);

  const addEntry = () => {
    if (!form.text) return;
    up(s => ({
      outputLog: [...s.outputLog, { ...form, id: Date.now(), date: new Date().toLocaleDateString(), week: s.currentWeek }],
    }));
    setForm(EMPTY_FORM);
  };

  const writingCount = state.outputLog.filter(o => o.type === 'writing').length;
  const speakingCount = state.outputLog.filter(o => o.type.startsWith('speaking')).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Output Lab</h2>
        <div style={{ display: "flex", gap: 6 }}>
          <span className="pill" style={{ background: "rgba(245,158,11,0.15)", color: "#fcd34d", fontSize: 11 }}>✍ {writingCount}</span>
          <span className="pill" style={{ background: "rgba(168,85,247,0.15)", color: "#c4b5fd", fontSize: 11 }}>🗣 {speakingCount}</span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="inp">
            {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          <div>
            <label style={{ fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>Autoevaluación</label>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setForm(p => ({ ...p, selfScore: n }))} className="diff-btn"
                  style={form.selfScore === n ? { background: "#a855f7", color: "#fff" } : {}}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <input value={form.prompt} onChange={e => setForm(p => ({ ...p, prompt: e.target.value }))}
          placeholder="Tema / consigna" className="inp" style={{ marginBottom: 6 }} />
        <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
          placeholder="Tu output completo + gaps identificados" rows={5} className="inp" style={{ marginBottom: 8 }} />
        <button onClick={addEntry} className="btn" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>+ Guardar output</button>
      </div>

      {state.outputLog.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primer output pendiente.</p>}

      {[...state.outputLog].reverse().map(o => (
        <div key={o.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#a855f7", textTransform: "uppercase" }}>
              {TYPE_LABELS[o.type] || o.type}
            </span>
            <span style={{ fontSize: 10, color: "#64748b" }}>Sem {o.week} | {"⭐".repeat(o.selfScore)} | {o.date}</span>
          </div>
          {o.prompt && <p style={{ fontSize: 11, color: "#60a5fa", marginBottom: 4 }}>📌 {o.prompt}</p>}
          <p style={{ fontSize: 12, color: "#cbd5e1", whiteSpace: "pre-wrap", cursor: "pointer" }}
            onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
            {expanded === o.id ? o.text : (o.text.length > 200 ? o.text.slice(0, 200) + "…" : o.text)}
            {o.text.length > 200 && (
              <span style={{ fontSize: 10, color: "#3b82f6", marginLeft: 6 }}>
                {expanded === o.id ? 'ver menos' : 'ver más'}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
