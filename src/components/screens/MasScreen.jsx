import { Icon } from '../ui';

const ROWS = [
  { route: 'sync', icon: 'globe', title: 'Sincronización', sub: 'Móvil · web · escritorio' },
  { route: 'config', icon: 'settings', title: 'Ajustes y respaldo', sub: 'Exportar, importar y reiniciar datos' },
  { route: 'diario', icon: 'edit', title: 'Diario de estudio', sub: 'Racha, mood y minutos' },
  { route: 'sr', icon: 'layers', title: 'Repaso espaciado', sub: 'Flashcards SM-2' },
  { route: 'errores', icon: 'alert', title: 'Banco de errores', sub: 'Registra y domina fallos' },
  { route: 'lectura', icon: 'book', title: 'Log de lectura', sub: 'Expresiones C1/C2' },
  { route: 'shadow', icon: 'headphones', title: 'Shadowing', sub: 'Prosodia y ritmo' },
  { route: 'output', icon: 'pen', title: 'Output Lab', sub: 'Writing y Speaking' },
];

export default function MasScreen({ go }) {
  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="ds-card" style={{ padding: 6 }}>
        {ROWS.map((r, i) => (
          <button key={r.route} className="between block" onClick={() => go(r.route)}
            style={{ padding: '12px 10px', textAlign: 'left', borderBottom: i < ROWS.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
            <span className="row" style={{ gap: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--text-2)', display: 'grid', placeItems: 'center' }}><Icon name={r.icon} size={18} /></span>
              <span>
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700 }}>{r.title}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-3)' }}>{r.sub}</span>
              </span>
            </span>
            <Icon name="right" size={17} color="var(--text-4)" />
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 22, color: 'var(--text-4)', fontSize: 11, fontWeight: 600 }}>
        <Icon name="cap" size={22} style={{ marginBottom: 6, opacity: 0.6 }} />
        <div>CAE Mastery · rediseño 2026</div>
        <div style={{ marginTop: 2 }}>Tus datos se guardan en este dispositivo</div>
      </div>
    </div>
  );
}
