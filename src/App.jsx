import { useState, useEffect, useCallback, useRef } from "react";
import { SKILLS, TABS, CAT_COLORS, TOTAL_WEEKS, EXAM_DATE, PHASES, REMINDERS, weekDate, daysUntilExam, defaultState, getWeekPlan } from "./data";
import { loadState, saveState, exportData, importData } from "./storage";
import "./App.css";

function DueCard({ card, onReview }) {
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
        <button onClick={() => setShow(true)} className="btn" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12 }}>Mostrar respuesta</button>
      ) : (
        <div>
          <div style={{ fontSize: 13, color: "#86efac", marginBottom: 10, padding: "8px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8 }}>{card.back}{card.context && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>📎 {card.context}</div>}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ q: 1, l: "No sé", bg: "#ef4444" }, { q: 3, l: "Difícil", bg: "#f59e0b" }, { q: 4, l: "Bien", bg: "#3b82f6" }, { q: 5, l: "Fácil", bg: "#22c55e" }].map(b => (
              <button key={b.q} onClick={() => onReview(card.id, b.q)} className="btn" style={{ flex: 1, background: b.bg, padding: 6, fontSize: 12 }}>{b.l}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(() => loadState(defaultState()));
  const [tab, setTab] = useState("Home");
  const [newScore, setNewScore] = useState({});
  const [errF, setErrF] = useState({ skill: "uoe", text: "", correction: "", rule: "", why: "" });
  const [diaryF, setDiaryF] = useState({ text: "", mood: 3, wins: "", struggles: "", mins: 120 });
  const [srF, setSrF] = useState({ front: "", back: "", skill: "uoe", context: "" });
  const [selW, setSelW] = useState(1);
  const [shadF, setShadF] = useState({ source: "", duration: 10, difficulty: 3, notes: "" });
  const [outF, setOutF] = useState({ type: "writing", prompt: "", text: "", selfScore: 3 });
  const fileRef = useRef(null);
  const saveRef = useRef(null);

  useEffect(() => {
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => saveState(state), 500);
  }, [state]);

  const up = useCallback((fn) => setState(p => ({ ...p, ...fn(p) })), []);
  const toggleCk = (w, d, tk) => { const k = `${w}-${d}-${tk}`; up(s => ({ dailyChecks: { ...s.dailyChecks, [k]: !s.dailyChecks[k] } })); };
  const addScore = (sk) => { const v = parseInt(newScore[sk]); if (!v || v < 140 || v > 210) return; up(s => ({ scores: { ...s.scores, [sk]: [...s.scores[sk], { week: s.currentWeek, score: v, date: new Date().toLocaleDateString() }] } })); setNewScore(p => ({ ...p, [sk]: "" })); };
  const addError = () => { if (!errF.text) return; up(s => ({ errors: [...s.errors, { ...errF, id: Date.now(), date: new Date().toLocaleDateString(), mastered: false }] })); setErrF({ skill: "uoe", text: "", correction: "", rule: "", why: "" }); };
  const addDiary = () => { if (!diaryF.text) return; up(s => ({ diary: [...s.diary, { ...diaryF, id: Date.now(), date: new Date().toLocaleDateString(), week: s.currentWeek }], totalMinutes: s.totalMinutes + (diaryF.mins || 0) })); setDiaryF({ text: "", mood: 3, wins: "", struggles: "", mins: 120 }); };
  const addSr = () => { if (!srF.front) return; up(s => ({ srCards: [...s.srCards, { ...srF, id: Date.now(), interval: 1, nextReview: Date.now() + 86400000, ease: 2.5, reps: 0 }] })); setSrF({ front: "", back: "", skill: "uoe", context: "" }); };
  const revCard = (id, q) => { up(s => ({ srCards: s.srCards.map(c => { if (c.id !== id) return c; let iv = c.interval, ea = c.ease, rp = c.reps; if (q < 3) { iv = 1; rp = 0; } else { if (rp === 0) iv = 1; else if (rp === 1) iv = 3; else iv = Math.round(iv * ea); ea = Math.max(1.3, ea + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))); rp++; } return { ...c, interval: iv, ease: ea, reps: rp, nextReview: Date.now() + iv * 86400000 }; }) })); };
  const addShad = () => { if (!shadF.source) return; up(s => ({ shadowLog: [...s.shadowLog, { ...shadF, id: Date.now(), date: new Date().toLocaleDateString() }] })); setShadF({ source: "", duration: 10, difficulty: 3, notes: "" }); };
  const addOut = () => { if (!outF.text) return; up(s => ({ outputLog: [...s.outputLog, { ...outF, id: Date.now(), date: new Date().toLocaleDateString(), week: s.currentWeek }] })); setOutF({ type: "writing", prompt: "", text: "", selfScore: 3 }); };

  const compW = (w) => { const p = getWeekPlan(w); let t = 0, d = 0; p.forEach(day => day.tasks.forEach(tk => { t++; if (state.dailyChecks[`${w}-${day.d}-${tk.t}`]) d++; })); return t ? Math.round((d / t) * 100) : 0; };
  const due = state.srCards.filter(c => c.nextReview <= Date.now());
  const phN = (w) => PHASES.find(p => p.weeks.includes(w))?.name || "";
  const phF = (w) => PHASES.find(p => p.weeks.includes(w));
  const errBySk = SKILLS.reduce((a, s) => ({ ...a, [s.key]: state.errors.filter(e => e.skill === s.key).length }), {});
  const avgScore = Math.round(SKILLS.reduce((a, s) => a + state.scores[s.key][state.scores[s.key].length - 1].score, 0) / 5);
  const minScore = Math.min(...SKILLS.map(s => state.scores[s.key][state.scores[s.key].length - 1].score));
  const daysLeft = daysUntilExam();
  const activeReminders = REMINDERS.filter(r => r.week === state.currentWeek && !(state.dismissedReminders || []).includes(r.text));

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      setState({ ...defaultState(), ...data });
      alert("Datos importados correctamente");
    } catch (err) { alert("Error al importar: " + err.message); }
  };

  return (
    <div className="app">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16, padding: "12px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CAE Mastery → {EXAM_DATE}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <span className="pill" style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", fontWeight: 600 }}>{daysLeft} días</span>
          <span className="pill" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}>Prom: {avgScore}</span>
          <span className="pill" style={{ background: "rgba(245,158,11,0.15)", color: "#fcd34d" }}>Min: {minScore}</span>
          <span className="pill" style={{ background: "rgba(168,85,247,0.15)", color: "#c4b5fd" }}>Sem {state.currentWeek}/{TOTAL_WEEKS}</span>
        </div>
      </div>

      {/* Reminders */}
      {activeReminders.map((r, i) => (
        <div key={i} className={`reminder ${r.type}`}>
          <span style={{ fontSize: 13, fontWeight: 600, color: r.type === "urgent" ? "#fca5a5" : r.type === "success" ? "#86efac" : "#93c5fd" }}>{r.text}</span>
          <button onClick={() => up(s => ({ dismissedReminders: [...(s.dismissedReminders || []), r.text] }))} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      ))}

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(tb => (
          <button key={tb} className={`tab ${tab === tb ? "active" : ""}`} onClick={() => setTab(tb)}>
            {tb}{tb === "SR" && due.length > 0 ? ` (${due.length})` : ""}
          </button>
        ))}
      </div>

      {/* HOME */}
      {tab === "Home" && (
        <div>
          <div className="card" style={{ background: `${phF(state.currentWeek)?.color}18`, borderColor: `${phF(state.currentWeek)?.color}40` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ color: phF(state.currentWeek)?.color, fontWeight: 700, fontSize: 14 }}>{phN(state.currentWeek)}</span>
                <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{phF(state.currentWeek)?.focus}</p>
                <p style={{ color: "#c084fc", fontSize: 11, marginTop: 2 }}>🎯 {phF(state.currentWeek)?.target} — {phF(state.currentWeek)?.hrs}</p>
              </div>
              <select value={state.currentWeek} onChange={e => up(() => ({ currentWeek: parseInt(e.target.value) }))} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #475569", borderRadius: 6, padding: "4px 8px", fontSize: 13 }}>
                {Array.from({ length: TOTAL_WEEKS }, (_, i) => (<option key={i + 1} value={i + 1}>Sem {i + 1} ({weekDate(i + 1)})</option>))}
              </select>
            </div>
            <div className="progress-bar" style={{ marginTop: 10, height: 8 }}><div className="progress-fill" style={{ width: `${(state.currentWeek / TOTAL_WEEKS) * 100}%`, background: `linear-gradient(90deg,${phF(state.currentWeek)?.color},#8b5cf6)` }} /></div>
            <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Semana {state.currentWeek}/{TOTAL_WEEKS} — {compW(state.currentWeek)}% — {weekDate(state.currentWeek)}</p>
          </div>

          <div className="card" style={{ background: "rgba(168,85,247,0.08)", borderColor: "rgba(168,85,247,0.2)", fontSize: 12 }}>
            <strong style={{ color: "#c084fc" }}>📈 </strong>
            <span style={{ color: "#94a3b8" }}>{avgScore >= 200 ? "Rango Grade A (C2)!" : avgScore >= 193 ? "Rango Grade B (C1) — muy bien" : avgScore >= 180 ? "C1 alcanzado — a consolidar" : avgScore >= 170 ? "Casi C1 — semanas decisivas" : `Necesitas +${180 - avgScore} puntos — enfócate en UoE y Speaking`}</span>
          </div>

          <div className="grid-5" style={{ marginBottom: 12 }}>
            {SKILLS.map(s => {
              const latest = state.scores[s.key][state.scores[s.key].length - 1].score;
              const gap = Math.max(0, s.c1 - latest);
              const pct = Math.min(100, ((latest - 140) / 70) * 100);
              return (
                <div key={s.key} className="card" style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{latest}</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 4 }}><div className="progress-fill" style={{ width: `${pct}%`, background: s.color }} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b" }}>
                    <span>{gap > 0 ? `${gap}→C1` : latest >= 200 ? "Grade A!" : "C1 ✓"}</span>
                    <span>{errBySk[s.key]} err</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <input type="number" placeholder="Score" value={newScore[s.key] || ""} onChange={e => setNewScore(p => ({ ...p, [s.key]: e.target.value }))} className="inp" style={{ padding: "4px 6px", fontSize: 11 }} min={140} max={210} />
                    <button onClick={() => addScore(s.key)} className="btn" style={{ background: s.color, padding: "4px 10px", fontSize: 11 }}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Progreso</h3>
            <svg viewBox="0 0 600 180" style={{ width: "100%", height: 180 }}>
              {[140,160,180,200].map(v => { const y = 170-((v-140)/70)*160; return (<g key={v}><line x1="40" y1={y} x2="590" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/><text x="35" y={y+4} fill="#64748b" fontSize="9" textAnchor="end">{v}</text></g>);})}
              <line x1="40" y1={170-((180-140)/70)*160} x2="590" y2={170-((180-140)/70)*160} stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" strokeDasharray="4"/>
              <text x="592" y={170-((180-140)/70)*160+4} fill="#3b82f6" fontSize="9" fontWeight="700">C1</text>
              <line x1="40" y1={170-((200-140)/70)*160} x2="590" y2={170-((200-140)/70)*160} stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeDasharray="4"/>
              <text x="592" y={170-((200-140)/70)*160+4} fill="#a855f7" fontSize="9" fontWeight="700">C2</text>
              {SKILLS.map(s => { const pts = state.scores[s.key]; if (pts.length<2) return null; const d = pts.map((p,i)=>`${i===0?"M":"L"}${40+(p.week/TOTAL_WEEKS)*550},${170-((p.score-140)/70)*160}`).join(" "); return(<path key={s.key} d={d} fill="none" stroke={s.color} strokeWidth="2"/>);})}
              {SKILLS.map(s => state.scores[s.key].map((p,i)=>(<circle key={`${s.key}-${i}`} cx={40+(p.week/TOTAL_WEEKS)*550} cy={170-((p.score-140)/70)*160} r="3.5" fill={s.color}/>)))}
            </svg>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
              {SKILLS.map(s => (<span key={s.key} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#94a3b8" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, display: "inline-block" }}/>{s.label}</span>))}
            </div>
          </div>
        </div>
      )}

      {/* PLAN */}
      {tab === "Plan" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Plan Semanal</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setSelW(w => Math.max(1,w-1))} className="tab">←</button>
              <span style={{ fontWeight: 700, minWidth: 140, textAlign: "center", fontSize: 13 }}>Sem {selW} ({weekDate(selW)})</span>
              <button onClick={() => setSelW(w => Math.min(TOTAL_WEEKS,w+1))} className="tab">→</button>
            </div>
          </div>
          <div className="card" style={{ background: `${phF(selW)?.color}18`, borderColor: `${phF(selW)?.color}30` }}>
            <span style={{ color: phF(selW)?.color, fontWeight: 700, fontSize: 13 }}>{phN(selW)}</span>
            <span style={{ color: "#94a3b8", fontSize: 12, marginLeft: 8 }}>— {phF(selW)?.hrs}</span>
            <div className="progress-bar" style={{ marginTop: 6 }}><div className="progress-fill" style={{ width: `${compW(selW)}%`, background: phF(selW)?.color }}/></div>
            <span style={{ fontSize: 11, color: "#64748b" }}>{compW(selW)}%</span>
          </div>
          {getWeekPlan(selW).map(day => (
            <div key={day.d} className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: day.d === "Sábado" ? "#ec4899" : "#60a5fa", marginBottom: 10 }}>{day.d}{day.d === "Sábado" ? " (extra)" : ""}</h3>
              {day.tasks.map((task, i) => {
                const ck = state.dailyChecks[`${selW}-${day.d}-${task.t}`];
                return (
                  <div key={i} className={`check-item ${ck ? "done" : ""}`} onClick={() => toggleCk(selW, day.d, task.t)}>
                    <div className={`checkbox ${ck ? "checked" : ""}`}>{ck && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: CAT_COLORS[task.cat], flexShrink: 0 }}/>
                        <span style={{ fontSize: 12, color: ck ? "#86efac" : "#cbd5e1", textDecoration: ck ? "line-through" : "none", lineHeight: 1.4 }}>{task.t}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, marginLeft: 12, fontStyle: "italic" }}>💡 {task.technique}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* TRACKER */}
      {tab === "Tracker" && (
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Tracker {TOTAL_WEEKS} Semanas</h2>
          {PHASES.map(ph => (
            <div key={ph.name} style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: ph.color, marginBottom: 6 }}>{ph.name} <span style={{ fontWeight: 400, color: "#64748b" }}>— {ph.hrs}</span></h3>
              {ph.weeks.map(w => { const c = compW(w); const cur = w === state.currentWeek; return (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 8, marginBottom: 2, background: cur ? "rgba(59,130,246,0.1)" : "transparent" }}>
                  <span style={{ fontSize: 11, fontWeight: cur ? 700 : 400, minWidth: 55, color: cur ? "#e2e8f0" : "#94a3b8" }}>Sem {w}{cur ? " ←" : ""}</span>
                  <span style={{ fontSize: 10, color: "#64748b", minWidth: 95 }}>{weekDate(w)}</span>
                  <div className="progress-bar" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${c}%`, background: c === 100 ? "#22c55e" : ph.color }}/></div>
                  <span style={{ fontSize: 10, minWidth: 30, textAlign: "right" }}>{c}%</span>
                  <span style={{ fontSize: 11 }}>{c === 100 ? "✅" : c > 0 ? "🔄" : w <= state.currentWeek ? "⚠️" : "⏳"}</span>
                </div>
              );})}
            </div>
          ))}
          <div className="card" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", textAlign: "center", fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>
            📅 EXAMEN: Sábado {EXAM_DATE} — {daysLeft} días
          </div>
        </div>
      )}

      {/* ERRORES */}
      {tab === "Errores" && (
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Banco de Errores</h2>
          <div className="card">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <select value={errF.skill} onChange={e => setErrF(p => ({...p, skill: e.target.value}))} className="inp">{SKILLS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
              <input value={errF.rule} onChange={e => setErrF(p => ({...p, rule: e.target.value}))} placeholder="Categoría" className="inp"/>
            </div>
            <textarea value={errF.text} onChange={e => setErrF(p => ({...p, text: e.target.value}))} placeholder="❌ Frase con error" rows={2} className="inp" style={{ marginBottom: 6 }}/>
            <textarea value={errF.correction} onChange={e => setErrF(p => ({...p, correction: e.target.value}))} placeholder="✅ Corrección" rows={2} className="inp" style={{ marginBottom: 6 }}/>
            <input value={errF.why} onChange={e => setErrF(p => ({...p, why: e.target.value}))} placeholder="💡 ¿Por qué?" className="inp" style={{ marginBottom: 8 }}/>
            <button onClick={addError} className="btn" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>+ Agregar</button>
          </div>
          <div className="grid-skills" style={{ marginBottom: 12 }}>
            {SKILLS.map(s => <div key={s.key} className="card" style={{ textAlign: "center", padding: 8, marginBottom: 0 }}><div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{errBySk[s.key]}</div><div style={{ fontSize: 10, color: "#64748b" }}>{s.label}</div></div>)}
          </div>
          {state.errors.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primer error = primer bug fixeado.</p>}
          {[...state.errors].reverse().map(err => (
            <div key={err.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: SKILLS.find(s => s.key === err.skill)?.color, textTransform: "uppercase" }}>{SKILLS.find(s => s.key === err.skill)?.label}</span>
                  {err.rule && <span style={{ fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>{err.rule}</span>}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#64748b" }}>{err.date}</span>
                  <button onClick={() => up(s => ({errors: s.errors.map(e => e.id === err.id ? {...e, mastered: !e.mastered} : e)}))} style={{ fontSize: 10, background: err.mastered ? "#22c55e" : "rgba(255,255,255,0.1)", color: err.mastered ? "#fff" : "#94a3b8", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>{err.mastered ? "✓ Fixed" : "Pendiente"}</button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#fca5a5", marginBottom: 2 }}>❌ {err.text}</div>
              {err.correction && <div style={{ fontSize: 12, color: "#86efac", marginBottom: 2 }}>✅ {err.correction}</div>}
              {err.why && <div style={{ fontSize: 11, color: "#60a5fa", fontStyle: "italic" }}>💡 {err.why}</div>}
            </div>
          ))}
        </div>
      )}

      {/* DIARIO */}
      {tab === "Diario" && (
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Diario</h2>
          <div className="card">
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["😫","😕","😐","🙂","🔥"].map((e,i) => <button key={i} onClick={() => setDiaryF(p => ({...p, mood: i+1}))} className={`mood-btn ${diaryF.mood === i+1 ? "active" : ""}`}>{e}</button>)}
            </div>
            <textarea value={diaryF.text} onChange={e => setDiaryF(p => ({...p, text: e.target.value}))} placeholder="¿Qué aprendiste?" rows={3} className="inp" style={{ marginBottom: 6 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
              <input value={diaryF.wins} onChange={e => setDiaryF(p => ({...p, wins: e.target.value}))} placeholder="🏆 Wins" className="inp"/>
              <input value={diaryF.struggles} onChange={e => setDiaryF(p => ({...p, struggles: e.target.value}))} placeholder="💪 Struggles" className="inp"/>
              <input type="number" value={diaryF.mins} onChange={e => setDiaryF(p => ({...p, mins: parseInt(e.target.value)||0}))} placeholder="Min" className="inp"/>
            </div>
            <button onClick={addDiary} className="btn" style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>+ Guardar</button>
          </div>
          {state.diary.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primera reflexión pendiente.</p>}
          {[...state.diary].reverse().map(en => (
            <div key={en.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 18 }}>{["😫","😕","😐","🙂","🔥"][en.mood-1]}</span><span style={{ fontSize: 10, color: "#64748b" }}>Sem {en.week} | {en.date} | {en.mins}min</span></div>
              <p style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 2 }}>{en.text}</p>
              {en.wins && <p style={{ fontSize: 11, color: "#86efac", marginTop: 2 }}>🏆 {en.wins}</p>}
              {en.struggles && <p style={{ fontSize: 11, color: "#fca5a5", marginTop: 2 }}>💪 {en.struggles}</p>}
            </div>
          ))}
        </div>
      )}

      {/* SR */}
      {tab === "SR" && (
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Spaced Repetition</h2>
          <div className="card">
            <select value={srF.skill} onChange={e => setSrF(p => ({...p, skill: e.target.value}))} className="inp" style={{ marginBottom: 6 }}>{SKILLS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
            <input value={srF.front} onChange={e => setSrF(p => ({...p, front: e.target.value}))} placeholder="Frente" className="inp" style={{ marginBottom: 6 }}/>
            <input value={srF.back} onChange={e => setSrF(p => ({...p, back: e.target.value}))} placeholder="Reverso" className="inp" style={{ marginBottom: 6 }}/>
            <input value={srF.context} onChange={e => setSrF(p => ({...p, context: e.target.value}))} placeholder="Contexto" className="inp" style={{ marginBottom: 8 }}/>
            <button onClick={addSr} className="btn" style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>+ Crear</button>
          </div>
          {due.length > 0 && <div style={{ marginBottom: 12 }}><h3 style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", marginBottom: 8 }}>⏰ Revisar ({due.length})</h3>{due.map(c => <DueCard key={c.id} card={c} onReview={revCard}/>)}</div>}
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Todas ({state.srCards.length})</h3>
          {state.srCards.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primera tarjeta pendiente.</p>}
          {state.srCards.map(c => (
            <div key={c.id} className="card" style={{ padding: 10, marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 0 }}><span style={{ fontSize: 12 }}>{c.front}</span><span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>→ {c.back}</span></div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: SKILLS.find(s => s.key === c.skill)?.color }}>{c.interval}d</span>
                <button onClick={() => up(s => ({srCards: s.srCards.filter(x => x.id !== c.id)}))} style={{ fontSize: 10, background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHADOW */}
      {tab === "Shadow" && (
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Shadowing</h2>
          <div className="card">
            <input value={shadF.source} onChange={e => setShadF(p => ({...p, source: e.target.value}))} placeholder="Fuente" className="inp" style={{ marginBottom: 6 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
              <div><label style={{ fontSize: 10, color: "#64748b" }}>Min</label><input type="number" value={shadF.duration} onChange={e => setShadF(p => ({...p, duration: parseInt(e.target.value)||0}))} className="inp"/></div>
              <div><label style={{ fontSize: 10, color: "#64748b" }}>Dificultad</label><div style={{ display: "flex", gap: 4, marginTop: 4 }}>{[1,2,3,4,5].map(n => <button key={n} onClick={() => setShadF(p => ({...p, difficulty: n}))} className={`diff-btn ${shadF.difficulty === n ? "active" : ""}`} style={shadF.difficulty === n ? {background: "#3b82f6"} : {}}>{n}</button>)}</div></div>
            </div>
            <textarea value={shadF.notes} onChange={e => setShadF(p => ({...p, notes: e.target.value}))} placeholder="¿Qué fue difícil?" rows={2} className="inp" style={{ marginBottom: 8 }}/>
            <button onClick={addShad} className="btn" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>+ Log</button>
          </div>
          {state.shadowLog.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primera sesión pendiente.</p>}
          {[...state.shadowLog].reverse().map(s => (
            <div key={s.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{s.source}</span><span style={{ fontSize: 10, color: "#64748b" }}>{s.date} | {s.duration}min</span></div>
              {s.notes && <p style={{ fontSize: 11, color: "#94a3b8" }}>{s.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* OUTPUT */}
      {tab === "Output" && (
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Output Lab</h2>
          <div className="card">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
              <select value={outF.type} onChange={e => setOutF(p => ({...p, type: e.target.value}))} className="inp">
                <option value="writing">Writing</option><option value="speaking_solo">Speaking (solo)</option><option value="speaking_partner">Speaking (partner)</option><option value="speaking_ai">Speaking (IA)</option>
              </select>
              <div><label style={{ fontSize: 10, color: "#64748b" }}>Score</label><div style={{ display: "flex", gap: 4, marginTop: 2 }}>{[1,2,3,4,5].map(n => <button key={n} onClick={() => setOutF(p => ({...p, selfScore: n}))} className={`diff-btn ${outF.selfScore === n ? "active" : ""}`} style={outF.selfScore === n ? {background: "#a855f7"} : {}}>{n}</button>)}</div></div>
            </div>
            <input value={outF.prompt} onChange={e => setOutF(p => ({...p, prompt: e.target.value}))} placeholder="Tema" className="inp" style={{ marginBottom: 6 }}/>
            <textarea value={outF.text} onChange={e => setOutF(p => ({...p, text: e.target.value}))} placeholder="Tu output + gaps" rows={4} className="inp" style={{ marginBottom: 8 }}/>
            <button onClick={addOut} className="btn" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>+ Guardar</button>
          </div>
          {state.outputLog.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Primer output pendiente.</p>}
          {[...state.outputLog].reverse().map(o => (
            <div key={o.id} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 10, fontWeight: 600, color: "#a855f7", textTransform: "uppercase" }}>{o.type.replace("_"," ")}</span><span style={{ fontSize: 10, color: "#64748b" }}>Sem {o.week} | {"⭐".repeat(o.selfScore)}</span></div>
              {o.prompt && <p style={{ fontSize: 11, color: "#60a5fa", marginBottom: 2 }}>📌 {o.prompt}</p>}
              <p style={{ fontSize: 12, color: "#cbd5e1", whiteSpace: "pre-wrap" }}>{o.text.length > 250 ? o.text.slice(0,250)+"..." : o.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* CONFIG */}
      {tab === "Config" && (
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Configuración</h2>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Backup & Restore</h3>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Exporta tus datos como JSON para hacer backup. Importa para restaurar en otro dispositivo.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => exportData(state)} className="btn" style={{ background: "linear-gradient(135deg,#22c55e,#06b6d4)" }}>📥 Exportar datos</button>
              <button onClick={() => fileRef.current?.click()} className="btn" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>📤 Importar datos</button>
              <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Estadísticas</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
              <div><span style={{ color: "#64748b" }}>Minutos estudiados:</span> <strong>{state.totalMinutes}</strong></div>
              <div><span style={{ color: "#64748b" }}>Errores registrados:</span> <strong>{state.errors.length}</strong></div>
              <div><span style={{ color: "#64748b" }}>Errores dominados:</span> <strong>{state.errors.filter(e => e.mastered).length}</strong></div>
              <div><span style={{ color: "#64748b" }}>Tarjetas SR:</span> <strong>{state.srCards.length}</strong></div>
              <div><span style={{ color: "#64748b" }}>Sesiones shadowing:</span> <strong>{state.shadowLog.length}</strong></div>
              <div><span style={{ color: "#64748b" }}>Outputs registrados:</span> <strong>{state.outputLog.length}</strong></div>
              <div><span style={{ color: "#64748b" }}>Entradas diario:</span> <strong>{state.diary.length}</strong></div>
              <div><span style={{ color: "#64748b" }}>Días para examen:</span> <strong style={{ color: "#fca5a5" }}>{daysLeft}</strong></div>
            </div>
          </div>
          <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#fca5a5" }}>Zona peligrosa</h3>
            <button onClick={() => { if (window.confirm("¿Estás seguro? Se borran TODOS tus datos.")) { setState(defaultState()); saveState(defaultState()); } }} className="btn" style={{ background: "#ef4444" }}>Resetear todo</button>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "16px 0 8px", color: "#475569", fontSize: 10 }}>
        CAE Mastery | {EXAM_DATE} | {daysLeft} días | UPF Barcelona 2027
      </div>
    </div>
  );
}