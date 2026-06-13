import { useState } from 'react';
import { Icon, Pill, EmptyState, Collapsible } from '../ui';
import { fmtDate, computeStreak, MOOD_LABELS } from '../../lib/logic';

const MOODS = ['😫', '😕', '😐', '🙂', '🔥'];
const EMPTY = { text: '', mood: 3, wins: '', struggles: '', mins: 120 };

export default function DiarioScreen({ state, up, now }) {
  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const streak = computeStreak(state.diary, now);

  const add = () => {
    if (!form.text.trim()) return;
    const ts = Date.now();
    up((s) => ({
      diary: [...s.diary, { ...form, id: ts, ts, date: fmtDate(ts), week: s.currentWeek }],
      totalMinutes: s.totalMinutes + (form.mins || 0),
    }));
    setForm(EMPTY); setOpen(false);
  };

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="row" style={{ gap: 7, marginBottom: 12, flexWrap: 'wrap' }}>
        <Pill tone={streak.current > 0 ? 'warn' : ''} icon="flame">Racha {streak.current}d</Pill>
        <Pill icon="trend">Récord {streak.max}d</Pill>
        <Pill icon="clock">{Math.floor(state.totalMinutes / 60)}h {state.totalMinutes % 60}m</Pill>
      </div>

      <Collapsible open={open} onToggle={() => setOpen((o) => !o)} label="Nueva entrada" icon="edit">
        <span className="field-label">¿Cómo te fue?</span>
        <div className="segmented" style={{ width: '100%' }}>
          {MOODS.map((e, i) => (
            <button key={i} className={form.mood === i + 1 ? 'active' : ''} onClick={() => setForm((p) => ({ ...p, mood: i + 1 }))} title={MOOD_LABELS[i]}>{e}</button>
          ))}
        </div>
        <textarea className="ds-inp" rows={3} style={{ marginTop: 8 }} placeholder="¿Qué aprendiste hoy?" value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} />
        <input className="ds-inp" style={{ marginTop: 8 }} placeholder="🏆 Wins" value={form.wins} onChange={(e) => setForm((p) => ({ ...p, wins: e.target.value }))} />
        <input className="ds-inp" style={{ marginTop: 8 }} placeholder="💪 Struggles" value={form.struggles} onChange={(e) => setForm((p) => ({ ...p, struggles: e.target.value }))} />
        <div style={{ marginTop: 8 }}>
          <span className="field-label">Minutos estudiados</span>
          <input type="number" className="ds-inp" value={form.mins} onChange={(e) => setForm((p) => ({ ...p, mins: parseInt(e.target.value, 10) || 0 }))} />
        </div>
        <button className="ds-btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Guardar entrada</button>
      </Collapsible>

      <div style={{ marginTop: 12 }}>
        {state.diary.length === 0 ? <EmptyState icon="edit" text="Primera reflexión pendiente" /> : [...state.diary].reverse().map((en) => (
          <div key={en.id} className="ds-card" style={{ padding: 13, marginBottom: 8 }}>
            <div className="between" style={{ marginBottom: 5 }}>
              <span style={{ fontSize: 18 }}>{MOODS[en.mood - 1]}</span>
              <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)' }}>Sem {en.week} · {en.date} · {en.mins}min</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{en.text}</p>
            {en.wins && <p style={{ fontSize: 11.5, color: 'var(--success)', marginTop: 4 }}>🏆 {en.wins}</p>}
            {en.struggles && <p style={{ fontSize: 11.5, color: 'var(--danger)', marginTop: 2 }}>💪 {en.struggles}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
