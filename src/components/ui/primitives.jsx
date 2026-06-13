import Icon from './Icon';
import { SKILLS } from '../../data';
import { SKILL_VAR } from '../../lib/logic';

export function SkillSelect({ value, onChange }) {
  return (
    <select className="ds-inp" value={value} onChange={(e) => onChange(e.target.value)}>
      {SKILLS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
    </select>
  );
}

export function ProgressBar({ pct, color, lg }) {
  return (
    <div className={'bar' + (lg ? ' lg' : '')}>
      <span style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color || 'var(--accent)' }} />
    </div>
  );
}

export function Pill({ children, tone, icon }) {
  return (
    <span className={'ds-pill' + (tone ? ' ' + tone : '')}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

export function StatTile({ icon, label, value, sub, tone }) {
  return (
    <div className="ds-card" style={{ padding: 14 }}>
      <div className="row" style={{ gap: 8, marginBottom: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'var(--surface-2)', color: tone || 'var(--text-2)' }}>
          <Icon name={icon} size={17} />
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.02em' }}>{label}</span>
      </div>
      <div className="tnum" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: tone || 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function SkillBar({ skill, score }) {
  const pct = Math.min(100, Math.max(0, ((score - 140) / 60) * 100));
  const c1pct = ((180 - 140) / 60) * 100;
  const gap = 180 - score;
  return (
    <div style={{ marginBottom: 13 }}>
      <div className="between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{skill.label}</span>
        <span className="tnum row" style={{ gap: 6, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: SKILL_VAR[skill.key] }}>{score}</span>
          <span style={{ color: gap > 0 ? 'var(--text-4)' : 'var(--success)', fontSize: 11 }}>
            {gap > 0 ? `${gap}→C1` : 'C1 ✓'}
          </span>
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <ProgressBar pct={pct} color={SKILL_VAR[skill.key]} />
        <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${c1pct}%`, width: 2, background: 'var(--text)', opacity: 0.45, borderRadius: 2 }} title="C1 (180)" />
      </div>
    </div>
  );
}

export function InsightCard({ ins }) {
  const toneVar = { warn: 'var(--warn)', success: 'var(--success)', info: 'var(--accent-2)', danger: 'var(--danger)' }[ins.kind] || 'var(--accent-2)';
  const bgVar = { warn: 'var(--warn-soft)', success: 'var(--success-soft)', info: 'var(--accent-soft)', danger: 'var(--danger-soft)' }[ins.kind] || 'var(--accent-soft)';
  return (
    <div className="ds-card" style={{ padding: 13, display: 'flex', gap: 11, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center', background: bgVar, color: toneVar }}>
        <Icon name={ins.icon} size={17} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{ins.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{ins.body}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, text }) {
  return <div className="empty"><Icon name={icon || 'list'} size={30} /><p>{text}</p></div>;
}

export function ScreenHead({ title, onBack, right }) {
  return (
    <div className="screen-head">
      {onBack && <button className="icon-btn" onClick={onBack} aria-label="Volver"><Icon name="left" size={18} /></button>}
      <h2 style={{ flex: 1 }}>{title}</h2>
      {right}
    </div>
  );
}
