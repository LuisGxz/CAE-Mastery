import { useState } from 'react';
import { Icon, Pill, EmptyState, Collapsible } from '../ui';
import { fmtDate } from '../../lib/logic';

const OUT_TYPES = { writing: 'Writing', speaking_solo: 'Speaking (solo)', speaking_partner: 'Speaking (partner)', speaking_ai: 'Speaking (IA)' };

export default function OutputScreen({ state, up }) {
  const [form, setForm] = useState({ type: 'writing', prompt: '', text: '', selfScore: 3 });
  const [open, setOpen] = useState(false);
  const [exp, setExp] = useState(null);
  const add = () => {
    if (!form.text.trim()) return;
    up((s) => ({ outputLog: [...s.outputLog, { ...form, id: Date.now(), date: fmtDate(Date.now()), week: s.currentWeek }] }));
    setForm({ type: 'writing', prompt: '', text: '', selfScore: 3 }); setOpen(false);
  };
  const wC = state.outputLog.filter((o) => o.type === 'writing').length;
  const sC = state.outputLog.filter((o) => o.type.startsWith('speaking')).length;
  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="row" style={{ gap: 7, marginBottom: 12 }}>
        <Pill tone="warn" icon="pen">{wC} writing</Pill>
        <Pill icon="mic">{sC} speaking</Pill>
      </div>
      <Collapsible open={open} onToggle={() => setOpen((o) => !o)} label="Nuevo output" icon="pen">
        <select className="ds-inp" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
          {Object.entries(OUT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="field-label" style={{ marginTop: 10 }}>Autoevaluación</span>
        <div className="segmented" style={{ width: '100%' }}>
          {[1, 2, 3, 4, 5].map((n) => <button key={n} className={form.selfScore === n ? 'active' : ''} onClick={() => setForm((p) => ({ ...p, selfScore: n }))}>{n}</button>)}
        </div>
        <input className="ds-inp" style={{ marginTop: 8 }} placeholder="Tema / consigna" value={form.prompt} onChange={(e) => setForm((p) => ({ ...p, prompt: e.target.value }))} />
        <textarea className="ds-inp" rows={5} style={{ marginTop: 8 }} placeholder="Tu output + gaps identificados" value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} />
        <button className="ds-btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Guardar output</button>
      </Collapsible>
      <div style={{ marginTop: 12 }}>
        {state.outputLog.length === 0 ? <EmptyState icon="pen" text="Primer output pendiente" /> : [...state.outputLog].reverse().map((o) => (
          <div key={o.id} className="ds-card" style={{ padding: 13, marginBottom: 8 }}>
            <div className="between" style={{ marginBottom: 6 }}>
              <span className="row" style={{ gap: 6, fontSize: 10.5, fontWeight: 800, color: o.type === 'writing' ? 'var(--sk-writing)' : 'var(--sk-speaking)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <Icon name={o.type === 'writing' ? 'pen' : 'mic'} size={13} />{OUT_TYPES[o.type]}
              </span>
              <span className="row" style={{ gap: 6 }}>
                <span style={{ color: 'var(--warn)', fontSize: 11, letterSpacing: 1 }}>{'★'.repeat(o.selfScore)}<span style={{ color: 'var(--surface-3)' }}>{'★'.repeat(5 - o.selfScore)}</span></span>
                <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)' }}>Sem {o.week}</span>
              </span>
            </div>
            {o.prompt && <div style={{ fontSize: 11.5, color: 'var(--accent-2)', marginBottom: 5, fontWeight: 600 }}>{o.prompt}</div>}
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55, whiteSpace: 'pre-wrap', cursor: 'pointer' }} onClick={() => setExp(exp === o.id ? null : o.id)}>
              {exp === o.id || o.text.length <= 180 ? o.text : o.text.slice(0, 180) + '…'}
              {o.text.length > 180 && <span style={{ color: 'var(--accent-2)', fontWeight: 700, marginLeft: 5 }}>{exp === o.id ? 'menos' : 'más'}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
