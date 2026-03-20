import { useState } from 'react';

const EMPTY_FORM = { text: '', mood: 3, wins: '', struggles: '', mins: 120 };
const MOODS = ["😫", "😕", "😐", "🙂", "🔥"];

export default function DiaryTab({ state, up }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const addEntry = () => {
    if (!form.text) return;
    up(s => ({
      diary: [...s.diary, { ...form, id: Date.now(), date: new Date().toLocaleDateString(), week: s.currentWeek }],
      totalMinutes: s.totalMinutes + (form.mins || 0),
    }));
    setForm(EMPTY_FORM);
  };

  const totalHours = Math.floor(state.totalMinutes / 60);
  const remainMin = state.totalMinutes % 60;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Diario</h2>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>
          ⏱ {totalHours}h {remainMin}min totales
        </span>
      </div>

      {/* Add form */}
      <div className="card">
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {MOODS.map((e, i) => (
            <button key={i} onClick={() => setForm(p => ({ ...p, mood: i + 1 }))} className={`mood-btn ${form.mood === i + 1 ? "active" : ""}`}>{e}</button>
          ))}
        </div>
        <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
          placeholder="¿Qué aprendiste hoy?" rows={3} className="inp" style={{ marginBottom: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
          <input value={form.wins} onChange={e => setForm(p => ({ ...p, wins: e.target.value }))} placeholder="🏆 Wins" className="inp" />
          <input value={form.struggles} onChange={e => setForm(p => ({ ...p, struggles: e.target.value }))} placeholder="💪 Struggles" className="inp" />
          <input type="number" value={form.mins} onChange={e => setForm(p => ({ ...p, mins: parseInt(e.target.value) || 0 }))}
            placeholder="Min estudiados" className="inp" />
        </div>
        <button onClick={addEntry} className="btn" style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>+ Guardar entrada</button>
      </div>

      {state.diary.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primera reflexión pendiente.</p>}

      {[...state.diary].reverse().map(en => (
        <div key={en.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{MOODS[en.mood - 1]}</span>
            <span style={{ fontSize: 10, color: "#64748b" }}>Sem {en.week} | {en.date} | {en.mins}min</span>
          </div>
          <p style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 2 }}>{en.text}</p>
          {en.wins && <p style={{ fontSize: 11, color: "#86efac", marginTop: 2 }}>🏆 {en.wins}</p>}
          {en.struggles && <p style={{ fontSize: 11, color: "#fca5a5", marginTop: 2 }}>💪 {en.struggles}</p>}
        </div>
      ))}
    </div>
  );
}
