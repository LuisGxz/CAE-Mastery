import { useState } from 'react';
import { SKILLS } from '../../data';
import { Icon, EmptyState, Collapsible, SkillSelect } from '../ui';
import { fmtDate, SKILL_VAR, CAT_LABEL, DAY_MS } from '../../lib/logic';

export default function ErroresScreen({ state, up }) {
  const [form, setForm] = useState({ skill: 'uoe', text: '', correction: '', rule: '', why: '' });
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('pending');

  const counts = SKILLS.reduce((a, s) => ({ ...a, [s.key]: state.errors.filter((e) => e.skill === s.key && !e.mastered).length }), {});
  const add = () => {
    if (!form.text.trim()) return;
    up((s) => ({ errors: [...s.errors, { ...form, id: Date.now(), date: fmtDate(Date.now()), mastered: false }] }));
    setForm({ skill: 'uoe', text: '', correction: '', rule: '', why: '' }); setOpen(false);
  };
  const toggle = (id) => up((s) => ({ errors: s.errors.map((e) => (e.id === id ? { ...e, mastered: !e.mastered } : e)) }));
  const toSR = (err) => up((s) => ({ srCards: [...s.srCards, { id: Date.now(), skill: err.skill, front: err.text, back: err.correction || '(sin corrección)', context: err.why || err.rule || '', interval: 1, nextReview: Date.now() + DAY_MS, ease: 2.5, reps: 0 }] }));

  const visible = [...state.errors].reverse().filter((e) => (filter === 'all' ? true : filter === 'mastered' ? e.mastered : !e.mastered));

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <Collapsible open={open} onToggle={() => setOpen((o) => !o)} label="Registrar error" icon="alert">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <SkillSelect value={form.skill} onChange={(v) => setForm((p) => ({ ...p, skill: v }))} />
          <input className="ds-inp" placeholder="Categoría" value={form.rule} onChange={(e) => setForm((p) => ({ ...p, rule: e.target.value }))} />
        </div>
        <textarea className="ds-inp" rows={2} style={{ marginTop: 8 }} placeholder="Frase con error" value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} />
        <textarea className="ds-inp" rows={2} style={{ marginTop: 8 }} placeholder="Corrección" value={form.correction} onChange={(e) => setForm((p) => ({ ...p, correction: e.target.value }))} />
        <input className="ds-inp" style={{ marginTop: 8 }} placeholder="¿Por qué es un error?" value={form.why} onChange={(e) => setForm((p) => ({ ...p, why: e.target.value }))} />
        <button className="ds-btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Agregar error</button>
      </Collapsible>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 7, margin: '12px 0' }}>
        {SKILLS.map((s) => (
          <div key={s.key} className="ds-card" style={{ padding: '9px 4px', textAlign: 'center' }}>
            <div className="tnum" style={{ fontSize: 17, fontWeight: 800, color: SKILL_VAR[s.key] }}>{counts[s.key]}</div>
            <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 700, marginTop: 1 }}>{s.label.split(' ')[0]}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{ gap: 7, marginBottom: 12 }}>
        {[['pending', `Activos (${state.errors.filter((e) => !e.mastered).length})`], ['mastered', `Dominados (${state.errors.filter((e) => e.mastered).length})`], ['all', `Todos (${state.errors.length})`]].map(([f, l]) => (
          <button key={f} className={'chip' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>{l}</button>
        ))}
      </div>

      {visible.length === 0 ? <EmptyState icon="shield" text="Sin errores aquí. ¡Bien!" /> : visible.map((err) => {
        const inSR = state.srCards.some((c) => c.front === err.text);
        return (
          <div key={err.id} className="ds-card" style={{ padding: 13, marginBottom: 8, opacity: err.mastered ? 0.62 : 1 }}>
            <div className="between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
              <span className="row" style={{ gap: 6 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: SKILL_VAR[err.skill], textTransform: 'uppercase', letterSpacing: '0.03em' }}>{CAT_LABEL[err.skill]}</span>
                {err.rule && <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>{err.rule}</span>}
              </span>
              <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)' }}>{err.date}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--danger)', lineHeight: 1.5 }}>✗ {err.text}</div>
            {err.correction && <div style={{ fontSize: 12.5, color: 'var(--success)', lineHeight: 1.5, marginTop: 3 }}>✓ {err.correction}</div>}
            {err.why && <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 5 }}>{err.why}</div>}
            <div className="row" style={{ gap: 7, marginTop: 11 }}>
              <button className="ds-btn sm" disabled={inSR} onClick={() => toSR(err)} style={{ flex: 1 }}>
                <Icon name={inSR ? 'check' : 'layers'} size={14} />{inSR ? 'En repaso' : '→ Repaso'}
              </button>
              <button className="ds-btn sm" onClick={() => toggle(err.id)} style={{ flex: 1, background: err.mastered ? 'var(--success-soft)' : 'var(--surface-2)', color: err.mastered ? 'var(--success)' : 'var(--text-2)', border: 'none' }}>
                <Icon name={err.mastered ? 'checkCircle' : 'flag'} size={14} />{err.mastered ? 'Dominado' : 'Marcar dominado'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
