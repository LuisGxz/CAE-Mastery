import { useState } from 'react';
import { Icon, Pill, EmptyState, Collapsible, SkillSelect } from '../ui';
import { sm2, SKILL_VAR, CAT_LABEL, DAY_MS } from '../../lib/logic';

const GRADES = [
  { q: 1, l: 'No sé', tone: 'var(--danger)' },
  { q: 3, l: 'Difícil', tone: 'var(--warn)' },
  { q: 4, l: 'Bien', tone: 'var(--sk-listening)' },
  { q: 5, l: 'Fácil', tone: 'var(--success)' },
];

export default function SRScreen({ state, up, now }) {
  const [form, setForm] = useState({ front: '', back: '', skill: 'uoe', context: '' });
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const due = state.srCards.filter((c) => c.nextReview <= now).sort((a, b) => a.nextReview - b.nextReview);
  const upcoming = state.srCards.filter((c) => { const d = (c.nextReview - now) / DAY_MS; return d > 0 && d <= 7; }).length;
  const card = due[0];

  const grade = (q) => {
    up((s) => ({ srCards: s.srCards.map((c) => (c.id !== card.id ? c : { ...c, ...sm2(c, q) })) }));
    setShow(false);
  };
  const addCard = () => {
    if (!form.front.trim()) return;
    up((s) => ({ srCards: [...s.srCards, { ...form, id: Date.now(), interval: 1, nextReview: Date.now() + DAY_MS, ease: 2.5, reps: 0 }] }));
    setForm({ front: '', back: '', skill: 'uoe', context: '' }); setOpen(false);
  };
  const del = (id) => up((s) => ({ srCards: s.srCards.filter((c) => c.id !== id) }));

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="row" style={{ gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
        <Pill tone={due.length ? 'warn' : 'success'} icon="clock">{due.length} pendientes</Pill>
        <Pill icon="calendar">{upcoming} en 7 días</Pill>
        <Pill icon="layers">{state.srCards.length} total</Pill>
      </div>

      {card ? (
        <div className="ds-card" style={{ padding: 18, border: '1px solid var(--accent-line)' }}>
          <div className="between" style={{ marginBottom: 14 }}>
            <span className="row" style={{ gap: 6, fontSize: 11.5, fontWeight: 700, color: SKILL_VAR[card.skill] }}>
              <span className="dot" style={{ background: SKILL_VAR[card.skill] }} />{CAT_LABEL[card.skill]}
            </span>
            <span className="tnum" style={{ fontSize: 11, color: 'var(--text-4)' }}>rep {card.reps} · {card.interval}d</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, textAlign: 'center', padding: '18px 6px', lineHeight: 1.4 }}>{card.front}</div>
          {!show ? (
            <button className="ds-btn primary block" onClick={() => setShow(true)}>Mostrar respuesta</button>
          ) : (
            <>
              <div style={{ background: 'var(--success-soft)', borderRadius: 12, padding: '14px 16px', textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)', lineHeight: 1.4 }}>{card.back}</div>
                {card.context && <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 6 }}>{card.context}</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 7 }}>
                {GRADES.map((g) => (
                  <button key={g.q} onClick={() => grade(g.q)} className="ds-btn sm" style={{ flexDirection: 'column', gap: 2, padding: '9px 4px', background: `color-mix(in oklab, ${g.tone} 18%, transparent)`, color: g.tone, border: 'none', fontWeight: 700 }}>
                    {g.l}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="tnum" style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', marginTop: 14 }}>{due.length} restantes hoy</div>
        </div>
      ) : (
        <div className="ds-card" style={{ textAlign: 'center', padding: 28 }}>
          <Icon name="checkCircle" size={34} color="var(--success)" />
          <p style={{ fontSize: 15, fontWeight: 700, marginTop: 10 }}>¡Repaso al día!</p>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 }}>No tienes tarjetas pendientes hoy. Vuelve mañana.</p>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <Collapsible open={open} onToggle={() => setOpen((o) => !o)} label="Nueva tarjeta" icon="plus">
          <SkillSelect value={form.skill} onChange={(v) => setForm((p) => ({ ...p, skill: v }))} />
          <input className="ds-inp" style={{ marginTop: 8 }} placeholder="Frente (pregunta / error / expresión)" value={form.front} onChange={(e) => setForm((p) => ({ ...p, front: e.target.value }))} />
          <input className="ds-inp" style={{ marginTop: 8 }} placeholder="Reverso (respuesta / corrección)" value={form.back} onChange={(e) => setForm((p) => ({ ...p, back: e.target.value }))} />
          <input className="ds-inp" style={{ marginTop: 8 }} placeholder="Contexto (opcional)" value={form.context} onChange={(e) => setForm((p) => ({ ...p, context: e.target.value }))} />
          <button className="ds-btn primary block" style={{ marginTop: 10 }} onClick={addCard}><Icon name="plus" size={16} /> Crear tarjeta</button>
        </Collapsible>
      </div>

      <div className="section-label">Todas las tarjetas ({state.srCards.length})</div>
      {state.srCards.length === 0 ? <EmptyState icon="layers" text="Aún no tienes tarjetas" /> : (
        [...state.srCards].sort((a, b) => a.nextReview - b.nextReview).map((c) => {
          const d = Math.ceil((c.nextReview - now) / DAY_MS);
          return (
            <div key={c.id} className="ds-card" style={{ padding: '10px 12px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="dot" style={{ background: SKILL_VAR[c.skill] }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.front}</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.back}</div>
              </div>
              <span className="tnum" style={{ fontSize: 10.5, fontWeight: 700, color: d <= 0 ? 'var(--warn)' : 'var(--text-4)', flexShrink: 0 }}>{d <= 0 ? 'hoy' : `${d}d`}</span>
              <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => del(c.id)}><Icon name="x" size={15} /></button>
            </div>
          );
        })
      )}
    </div>
  );
}
