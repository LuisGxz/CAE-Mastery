import { useState } from 'react';
import Icon from './Icon';

/** Sección plegable con cabecera + chevron. */
export default function Collapsible({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ds-card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        className="between"
        style={{ width: '100%', padding: '13px 14px', cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="row" style={{ gap: 9, fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
          {icon && <Icon name={icon} size={16} color="var(--accent-2)" />}
          {title}
        </span>
        <Icon name={open ? 'up' : 'down'} size={17} color="var(--text-4)" />
      </button>
      {open && <div style={{ padding: '0 14px 14px', display: 'grid', gap: 10 }}>{children}</div>}
    </div>
  );
}
