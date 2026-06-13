import Icon from './Icon';

/** Sección plegable controlada (open/onToggle gestionados por el padre). */
export default function Collapsible({ open, onToggle, label, icon, children }) {
  return (
    <div className="ds-card" style={{ padding: 0, overflow: 'hidden' }}>
      <button className="between block" onClick={onToggle} style={{ padding: 14, textAlign: 'left' }} aria-expanded={open}>
        <span className="row" style={{ gap: 9, fontSize: 13.5, fontWeight: 700 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--accent-soft)', color: 'var(--accent-2)', display: 'grid', placeItems: 'center' }}>
            <Icon name={icon} size={16} />
          </span>
          {label}
        </span>
        <Icon name={open ? 'up' : 'plus'} size={18} color="var(--text-3)" />
      </button>
      {open && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  );
}
