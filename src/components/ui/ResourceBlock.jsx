import { useState } from 'react';
import Icon from './Icon';

function resourceMeta(res) {
  if (!res) return null;
  if (res.includes('Claude')) return { icon: 'chat', label: 'Prompt para Claude', tone: 'var(--accent-2)' };
  if (res.startsWith('📺') || res.includes('YouTube')) return { icon: 'video', label: 'Buscar en YouTube', tone: 'var(--sk-uoe)' };
  if (res.startsWith('🎧')) return { icon: 'headphones', label: 'Podcast', tone: 'var(--sk-speaking)' };
  if (res.startsWith('🔍') || res.includes('Google')) return { icon: 'search', label: 'Buscar en Google', tone: 'var(--text-2)' };
  return { icon: 'bookmark', label: 'Recurso', tone: 'var(--text-2)' };
}

/** Bloque de recurso de una tarea (prompt Claude / YouTube / Google) con botón Copiar. */
export default function ResourceBlock({ res }) {
  const [copied, setCopied] = useState(false);
  const meta = resourceMeta(res);
  if (!meta) return null;
  const clean = res
    .replace(/^💬\s*Claude:\s*/, '')
    .replace(/^📺\s*YouTube:\s*/, '')
    .replace(/^🎧\s*/, '')
    .replace(/^🔍\s*Google:\s*/, '')
    .replace(/^"|"$/g, '');
  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(clean);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{ marginTop: 8, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 10 }}>
      <div className="between" style={{ marginBottom: 6 }}>
        <span className="row" style={{ gap: 6, fontSize: 11.5, fontWeight: 700, color: meta.tone }}>
          <Icon name={meta.icon} size={14} /> {meta.label}
        </span>
        <button className="ds-btn sm" onClick={copy} style={{ padding: '4px 9px' }}>
          <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{clean}</div>
    </div>
  );
}
