import { useState } from 'react';
import Icon from './Icon';
import { CAT_VAR } from '../../lib/logic';

/**
 * Fila de tarea del plan: checkbox 22px + label + detalle expandible
 * (pasos y recurso con botón "Copiar").
 */
export default function TaskRow({ task, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasDetail = (task.steps && task.steps.length > 0) || !!task.resource;

  function copyResource() {
    if (!task.resource || !navigator.clipboard) return;
    navigator.clipboard.writeText(task.resource);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div style={{ borderRadius: 'var(--r-sm)', background: checked ? 'var(--success-soft)' : 'transparent', transition: 'background .15s ease' }}>
      <div className="row" style={{ gap: 10, padding: '8px 8px', alignItems: 'flex-start' }}>
        <button
          onClick={onToggle}
          aria-label={checked ? 'Marcar como pendiente' : 'Marcar como hecha'}
          style={{
            width: 22, height: 22, flexShrink: 0, marginTop: 1, borderRadius: 7,
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            background: checked ? 'var(--success)' : 'transparent',
            border: checked ? 'none' : '2px solid var(--border-2)',
            transition: 'all .15s ease',
          }}
        >
          {checked && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            onClick={() => hasDetail && setOpen((o) => !o)}
            style={{ textAlign: 'left', width: '100%', cursor: hasDetail ? 'pointer' : 'default' }}
          >
            <span style={{
              fontSize: 13, fontWeight: 600, lineHeight: 1.4,
              color: checked ? 'var(--text-3)' : 'var(--text)',
              textDecoration: checked ? 'line-through' : 'none',
            }}>
              {task.t}
            </span>
          </button>
          {task.technique && (
            <div style={{ fontSize: 11, fontWeight: 700, color: CAT_VAR[task.cat] || 'var(--text-3)', marginTop: 2 }}>
              {task.technique}
            </div>
          )}

          {open && hasDetail && (
            <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
              {task.steps && task.steps.length > 0 && (
                <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
                  {task.steps.map((s, i) => (
                    <li key={i} style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.45 }}>{s}</li>
                  ))}
                </ol>
              )}
              {task.resource && (
                <div className="ds-card" style={{ padding: 10, background: 'var(--input-bg)' }}>
                  <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {task.resource}
                  </div>
                  <button className="ds-btn sm" style={{ marginTop: 8 }} onClick={copyResource}>
                    <Icon name={copied ? 'check' : 'copy'} size={14} />
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {hasDetail && (
          <button onClick={() => setOpen((o) => !o)} aria-label="Detalle" style={{ cursor: 'pointer', marginTop: 2 }}>
            <Icon name={open ? 'up' : 'down'} size={16} color="var(--text-4)" />
          </button>
        )}
      </div>
    </div>
  );
}
