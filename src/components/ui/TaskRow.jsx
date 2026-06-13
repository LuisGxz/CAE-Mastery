import { useState } from 'react';
import Icon from './Icon';
import ResourceBlock from './ResourceBlock';
import { CAT_VAR } from '../../lib/logic';

/**
 * Fila de tarea del plan: checkbox 22px + label + técnica + detalle expandible
 * (pasos numerados y recurso con "Copiar"). onToggle recibe (week, day, taskText).
 */
export default function TaskRow({ task, week, day, checked, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const hasDetail = (task.steps && task.steps.length > 0) || !!task.resource;
  return (
    <div style={{ borderBottom: '1px solid var(--hairline)', padding: '11px 0' }}>
      <div className="row" style={{ gap: 11, alignItems: 'flex-start' }}>
        <button
          onClick={() => onToggle(week, day, task.t)}
          aria-label="Completar"
          style={{
            width: 22, height: 22, flexShrink: 0, marginTop: 1, borderRadius: 7,
            border: checked ? 'none' : '2px solid var(--border-2)',
            background: checked ? 'var(--success)' : 'transparent',
            display: 'grid', placeItems: 'center', transition: 'all .15s ease', cursor: 'pointer',
          }}
        >
          {checked && <Icon name="check" size={13} color="#0b140d" strokeWidth={3} />}
        </button>
        <div style={{ flex: 1, minWidth: 0, cursor: hasDetail ? 'pointer' : 'default' }} onClick={() => hasDetail && setOpen((o) => !o)}>
          <div className="row" style={{ gap: 7, alignItems: 'flex-start' }}>
            <span className="dot" style={{ background: CAT_VAR[task.cat], marginTop: 6 }} />
            <span style={{ fontSize: 13, lineHeight: 1.45, color: checked ? 'var(--text-4)' : 'var(--text)', textDecoration: checked ? 'line-through' : 'none' }}>{task.t}</span>
          </div>
          <div className="row between" style={{ marginLeft: 14, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--text-4)', fontStyle: 'italic' }}>{task.technique}</span>
            {hasDetail && <Icon name={open ? 'up' : 'down'} size={14} color="var(--text-4)" />}
          </div>
        </div>
      </div>
      {open && hasDetail && (
        <div style={{ marginLeft: 33, marginTop: 9 }}>
          {task.steps && task.steps.map((s, i) => (
            <div key={i} className="row" style={{ gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-2)', marginTop: 1, minWidth: 13 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.45 }}>{s}</span>
            </div>
          ))}
          {task.resource && <ResourceBlock res={task.resource} />}
        </div>
      )}
    </div>
  );
}
