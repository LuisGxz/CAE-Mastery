import { Icon, Pill } from '../ui';

export default function PracticaScreen({ state, go, now }) {
  const due = state.srCards.filter((c) => c.nextReview <= now).length;
  const pendErr = state.errors.filter((e) => !e.mastered).length;
  const reads = (state.readingLog || []).length;
  const shadowMin = state.shadowLog.reduce((a, s) => a + (s.duration || 0), 0);
  const outW = state.outputLog.filter((o) => o.type === 'writing').length;
  const outS = state.outputLog.filter((o) => o.type.startsWith('speaking')).length;

  const items = [
    { route: 'sr', icon: 'layers', tone: 'var(--accent-2)', title: 'Repaso espaciado', sub: 'Flashcards SM-2', badge: due ? `${due} hoy` : 'al día', badgeTone: due ? 'warn' : 'success' },
    { route: 'errores', icon: 'alert', tone: 'var(--sk-uoe)', title: 'Banco de errores', sub: 'Registra y domina fallos', badge: `${pendErr} activos`, badgeTone: pendErr ? '' : 'success' },
    { route: 'lectura', icon: 'book', tone: 'var(--sk-reading)', title: 'Log de lectura', sub: 'Expresiones C1/C2', badge: `${reads} textos`, badgeTone: '' },
    { route: 'shadow', icon: 'headphones', tone: 'var(--sk-speaking)', title: 'Shadowing', sub: 'Prosodia y ritmo', badge: `${Math.floor(shadowMin / 60)}h ${shadowMin % 60}m`, badgeTone: '' },
    { route: 'output', icon: 'pen', tone: 'var(--sk-writing)', title: 'Output Lab', sub: 'Writing y Speaking', badge: `${outW}W · ${outS}S`, badgeTone: '' },
  ];

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: '0 2px 14px', lineHeight: 1.5 }}>Tus herramientas de estudio activo. El repaso espaciado primero, lo nuevo después.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it) => (
          <button key={it.route} className="ds-card block" onClick={() => go(it.route)}
            style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', background: `color-mix(in oklab, ${it.tone} 16%, transparent)`, color: it.tone }}>
              <Icon name={it.icon} size={21} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{it.sub}</div>
            </div>
            <Pill tone={it.badgeTone}>{it.badge}</Pill>
            <Icon name="right" size={17} color="var(--text-4)" />
          </button>
        ))}
      </div>
    </div>
  );
}
