import { useState } from 'react';
import { Icon, Pill, EmptyState, Collapsible } from '../ui';
import { fmtDate, DAY_MS } from '../../lib/logic';

const READ_TYPES = { article: 'Artículo', cae_text: 'Texto CAE', book: 'Libro', podcast_transcript: 'Transcripción', other: 'Otro' };
const LEVELS = ['B2', 'C1', 'C2'];
const LEVEL_VAR = { B2: 'var(--sk-reading)', C1: 'var(--sk-listening)', C2: 'var(--sk-speaking)' };

export default function LecturaScreen({ state, up }) {
  const [form, setForm] = useState({ title: '', type: 'article', level: 'C1', expressions: '', notes: '' });
  const [open, setOpen] = useState(false);
  const log = [...(state.readingLog || [])].reverse();
  const exprCount = (state.readingLog || []).reduce((a, e) => a + (e.expressions ? e.expressions.split(',').filter((x) => x.trim()).length : 0), 0);

  const add = () => {
    if (!form.title.trim()) return;
    up((s) => ({ readingLog: [...(s.readingLog || []), { ...form, id: Date.now(), date: fmtDate(Date.now()), week: s.currentWeek }] }));
    setForm({ title: '', type: 'article', level: 'C1', expressions: '', notes: '' }); setOpen(false);
  };
  const toSR = (entry) => {
    const exprs = entry.expressions.split(',').map((e) => e.trim()).filter(Boolean);
    if (!exprs.length) return;
    up((s) => ({ srCards: [...s.srCards, ...exprs.map((ex) => ({ id: Date.now() + Math.random(), skill: 'reading', front: ex, back: `(contexto: ${entry.title})`, context: `${READ_TYPES[entry.type]} — ${entry.level}`, interval: 1, nextReview: Date.now() + DAY_MS, ease: 2.5, reps: 0 }))] }));
  };

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="row" style={{ gap: 7, marginBottom: 12 }}>
        <Pill tone="success" icon="book">{state.readingLog?.length || 0} textos</Pill>
        <Pill icon="bookmark">{exprCount} expresiones</Pill>
      </div>
      <Collapsible open={open} onToggle={() => setOpen((o) => !o)} label="Registrar lectura" icon="book">
        <input className="ds-inp" placeholder="Título o fuente" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <select className="ds-inp" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
            {Object.entries(READ_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div className="segmented">
            {LEVELS.map((l) => <button key={l} className={form.level === l ? 'active' : ''} onClick={() => setForm((p) => ({ ...p, level: l }))}>{l}</button>)}
          </div>
        </div>
        <textarea className="ds-inp" rows={2} style={{ marginTop: 8 }} placeholder="Expresiones C1/C2 (separadas por comas)" value={form.expressions} onChange={(e) => setForm((p) => ({ ...p, expressions: e.target.value }))} />
        <textarea className="ds-inp" rows={2} style={{ marginTop: 8 }} placeholder="Notas, resumen, ideas" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
        <button className="ds-btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Registrar</button>
      </Collapsible>

      <div style={{ marginTop: 12 }}>
        {log.length === 0 ? <EmptyState icon="book" text="Primera lectura pendiente" /> : log.map((entry) => {
          const exprs = entry.expressions ? entry.expressions.split(',').map((e) => e.trim()).filter(Boolean) : [];
          return (
            <div key={entry.id} className="ds-card" style={{ padding: 13, marginBottom: 8 }}>
              <div className="between" style={{ marginBottom: 8, gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{entry.title}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: LEVEL_VAR[entry.level], flexShrink: 0 }}>{entry.level}</span>
              </div>
              <div className="row" style={{ gap: 6, marginBottom: exprs.length ? 8 : 0 }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>{READ_TYPES[entry.type]}</span>
                <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)' }}>Sem {entry.week} · {entry.date}</span>
              </div>
              {exprs.length > 0 && (
                <div className="row" style={{ flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                  {exprs.map((ex, i) => <span key={i} style={{ fontSize: 11, color: 'var(--sk-reading)', background: 'color-mix(in oklab, var(--sk-reading) 14%, transparent)', padding: '2px 8px', borderRadius: 6 }}>{ex}</span>)}
                </div>
              )}
              {entry.notes && <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontStyle: 'italic', marginBottom: exprs.length ? 8 : 0 }}>{entry.notes}</div>}
              {exprs.length > 0 && <button className="ds-btn sm block" onClick={() => toSR(entry)}><Icon name="layers" size={14} /> Enviar {exprs.length} a Repaso</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
