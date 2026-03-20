import { useState } from 'react';
import { SKILLS } from '../../data';

const EMPTY_FORM = { title: '', type: 'article', level: 'C1', expressions: '', notes: '' };
const TYPES = ['article', 'cae_text', 'book', 'podcast_transcript', 'other'];
const TYPE_LABELS = { article: 'Artículo', cae_text: 'Texto CAE', book: 'Libro', podcast_transcript: 'Transcripción', other: 'Otro' };
const LEVELS = ['B2', 'C1', 'C2'];

export default function ReadingTab({ state, up }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const addEntry = () => {
    if (!form.title) return;
    up(s => ({
      readingLog: [...(s.readingLog || []), {
        ...form,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        week: s.currentWeek,
      }],
    }));
    setForm(EMPTY_FORM);
  };

  // Creates SR cards from comma-separated expressions
  const expressionsToSR = (entry) => {
    const exprs = entry.expressions
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);
    if (!exprs.length) return;
    const cards = exprs.map(expr => ({
      id: Date.now() + Math.random(),
      skill: 'reading',
      front: expr,
      back: `(contexto: ${entry.title})`,
      context: `${TYPE_LABELS[entry.type]} — ${entry.level}`,
      interval: 1,
      nextReview: Date.now() + 86400000,
      ease: 2.5,
      reps: 0,
    }));
    up(s => ({ srCards: [...s.srCards, ...cards] }));
  };

  const log = [...(state.readingLog || [])].reverse();
  const totalEntries = state.readingLog?.length || 0;
  const expressionCount = (state.readingLog || []).reduce((a, e) => {
    return a + (e.expressions ? e.expressions.split(',').filter(x => x.trim()).length : 0);
  }, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Log de Lectura</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="pill" style={{ background: "rgba(34,197,94,0.15)", color: "#86efac", fontSize: 11 }}>{totalEntries} textos</span>
          <span className="pill" style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9", fontSize: 11 }}>{expressionCount} expresiones</span>
        </div>
      </div>

      <div className="card">
        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          placeholder="Título o fuente" className="inp" style={{ marginBottom: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="inp">
            {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          <div>
            <label style={{ fontSize: 10, color: "#64748b", display: "block", marginBottom: 4 }}>Nivel</label>
            <div style={{ display: "flex", gap: 4 }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setForm(p => ({ ...p, level: l }))} className="diff-btn"
                  style={form.level === l ? { background: "#3b82f6", color: "#fff" } : {}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <textarea value={form.expressions} onChange={e => setForm(p => ({ ...p, expressions: e.target.value }))}
          placeholder="Expresiones C1/C2 extraídas (separadas por comas)" rows={2} className="inp" style={{ marginBottom: 6 }} />
        <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          placeholder="Notas, resumen, ideas" rows={2} className="inp" style={{ marginBottom: 8 }} />
        <button onClick={addEntry} className="btn" style={{ background: "linear-gradient(135deg,#22c55e,#3b82f6)" }}>+ Registrar lectura</button>
      </div>

      {log.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primera lectura pendiente.</p>}

      {log.map(entry => {
        const exprs = entry.expressions ? entry.expressions.split(',').map(e => e.trim()).filter(Boolean) : [];
        return (
          <div key={entry.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{entry.title}</span>
                <span style={{ fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>{TYPE_LABELS[entry.type]}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: entry.level === 'C2' ? "#a855f7" : entry.level === 'C1' ? "#3b82f6" : "#22c55e" }}>{entry.level}</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#64748b" }}>Sem {entry.week} | {entry.date}</span>
                {exprs.length > 0 && (
                  <button onClick={() => expressionsToSR(entry)} className="btn"
                    style={{ fontSize: 10, padding: "2px 8px", background: "rgba(6,182,212,0.2)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>
                    → SR ({exprs.length})
                  </button>
                )}
              </div>
            </div>
            {exprs.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                {exprs.map((ex, i) => (
                  <span key={i} style={{ fontSize: 11, color: "#86efac", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 6 }}>
                    {ex}
                  </span>
                ))}
              </div>
            )}
            {entry.notes && <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>{entry.notes}</p>}
          </div>
        );
      })}
    </div>
  );
}
