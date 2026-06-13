import { useState } from 'react';
import { Icon, Pill, EmptyState, Collapsible } from '../ui';
import { fmtDate } from '../../lib/logic';

export default function ShadowScreen({ state, up }) {
  const [form, setForm] = useState({ source: '', duration: 10, difficulty: 3, notes: '' });
  const [open, setOpen] = useState(false);
  const total = state.shadowLog.reduce((a, s) => a + (s.duration || 0), 0);
  const add = () => {
    if (!form.source.trim()) return;
    up((s) => ({ shadowLog: [...s.shadowLog, { ...form, id: Date.now(), date: fmtDate(Date.now()) }] }));
    setForm({ source: '', duration: 10, difficulty: 3, notes: '' }); setOpen(false);
  };
  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="row" style={{ marginBottom: 12 }}><Pill tone="accent" icon="headphones">{Math.floor(total / 60)}h {total % 60}min en total</Pill></div>
      <Collapsible open={open} onToggle={() => setOpen((o) => !o)} label="Nueva sesión" icon="headphones">
        <input className="ds-inp" placeholder="Fuente (TED, podcast, noticia…)" value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 8, marginTop: 8 }}>
          <div>
            <span className="field-label">Minutos</span>
            <input type="number" className="ds-inp" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: parseInt(e.target.value, 10) || 0 }))} />
          </div>
          <div>
            <span className="field-label">Dificultad</span>
            <div className="segmented" style={{ width: '100%' }}>
              {[1, 2, 3, 4, 5].map((n) => <button key={n} className={form.difficulty === n ? 'active' : ''} onClick={() => setForm((p) => ({ ...p, difficulty: n }))}>{n}</button>)}
            </div>
          </div>
        </div>
        <textarea className="ds-inp" rows={2} style={{ marginTop: 8 }} placeholder="¿Qué fue difícil? ¿Qué mejorar?" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
        <button className="ds-btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Registrar sesión</button>
      </Collapsible>
      <div style={{ marginTop: 12 }}>
        {state.shadowLog.length === 0 ? <EmptyState icon="headphones" text="Primera sesión pendiente" /> : [...state.shadowLog].reverse().map((s) => (
          <div key={s.id} className="ds-card" style={{ padding: 13, marginBottom: 8 }}>
            <div className="between" style={{ marginBottom: s.notes ? 6 : 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{s.source}</span>
              <span className="tnum" style={{ fontSize: 10.5, color: 'var(--text-4)', flexShrink: 0 }}>{s.duration}min · dif {s.difficulty}/5</span>
            </div>
            {s.notes && <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{s.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
