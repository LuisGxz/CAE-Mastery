import { Layers, AlertCircle, BookOpen, Headphones, PenLine, Settings, NotebookPen, ChevronRight } from 'lucide-react';

/* Hubs transitorios de T2 (Práctica y Más). Se rediseñan en T4. */

function MenuRow({ iconEl, color, title, sub, badge, onClick }) {
  return (
    <button className="ds-card between" style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={onClick}>
      <span className="row" style={{ gap: 12 }}>
        <span style={{
          width: 34, height: 34, borderRadius: 10, display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-2)', color: color || 'var(--accent-2)', flexShrink: 0,
        }}>
          {iconEl}
        </span>
        <span>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{title}</span>
          {sub && <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600 }}>{sub}</span>}
        </span>
      </span>
      <span className="row" style={{ gap: 8 }}>
        {badge && <span className="ds-pill warn">{badge}</span>}
        <ChevronRight size={18} color="var(--text-4)" />
      </span>
    </button>
  );
}

export function PracticaHub({ state, go, now }) {
  const due = state.srCards.filter((c) => c.nextReview <= now).length;
  const activeErr = state.errors.filter((e) => !e.mastered).length;
  return (
    <div className="page" style={{ paddingTop: 8, display: 'grid', gap: 12 }}>
      <MenuRow iconEl={<Layers size={18} />} color="var(--accent-2)" title="Repaso espaciado"
        sub={due > 0 ? `${due} pendientes hoy` : 'Al día'} badge={due > 0 ? `${due} hoy` : null}
        onClick={() => go('sr')} />
      <MenuRow iconEl={<AlertCircle size={18} />} color="var(--sk-uoe)" title="Banco de errores"
        sub={`${activeErr} activos`} onClick={() => go('errores')} />
      <MenuRow iconEl={<BookOpen size={18} />} color="var(--sk-reading)" title="Log de lectura"
        sub={`${(state.readingLog || []).length} textos`} onClick={() => go('lectura')} />
      <MenuRow iconEl={<Headphones size={18} />} color="var(--sk-listening)" title="Shadowing"
        sub={`${(state.shadowLog || []).length} sesiones`} onClick={() => go('shadow')} />
      <MenuRow iconEl={<PenLine size={18} />} color="var(--sk-writing)" title="Output Lab"
        sub={`${(state.outputLog || []).length} entradas`} onClick={() => go('output')} />
    </div>
  );
}

export function MasMenu({ state, go }) {
  return (
    <div className="page" style={{ paddingTop: 8, display: 'grid', gap: 12 }}>
      <MenuRow iconEl={<Settings size={18} />} title="Ajustes y respaldo" sub="Exportar / importar / reiniciar" onClick={() => go('config')} />
      <MenuRow iconEl={<NotebookPen size={18} />} color="var(--sk-speaking)" title="Diario de estudio"
        sub={`${(state.diary || []).length} entradas`} onClick={() => go('diario')} />
      <div className="section-label">Práctica</div>
      <MenuRow iconEl={<Layers size={18} />} color="var(--accent-2)" title="Repaso espaciado" onClick={() => go('sr')} />
      <MenuRow iconEl={<AlertCircle size={18} />} color="var(--sk-uoe)" title="Banco de errores" onClick={() => go('errores')} />
      <MenuRow iconEl={<BookOpen size={18} />} color="var(--sk-reading)" title="Log de lectura" onClick={() => go('lectura')} />
      <MenuRow iconEl={<Headphones size={18} />} color="var(--sk-listening)" title="Shadowing" onClick={() => go('shadow')} />
      <MenuRow iconEl={<PenLine size={18} />} color="var(--sk-writing)" title="Output Lab" onClick={() => go('output')} />
      <p style={{ textAlign: 'center', color: 'var(--text-4)', fontSize: 10.5, marginTop: 10 }}>
        CAE Mastery · rediseño 2026 · Tus datos se guardan en este dispositivo
      </p>
    </div>
  );
}
