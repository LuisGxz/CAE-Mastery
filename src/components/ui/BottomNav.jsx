import { Home, CalendarDays, GraduationCap, TrendingUp, Menu } from 'lucide-react';
import { TABS } from '../../hooks/useNavStack';

const ICONS = {
  home: Home,
  calendar: CalendarDays,
  practice: GraduationCap,
  progress: TrendingUp,
  more: Menu,
};

/**
 * Barra inferior fija de 5 secciones. `practica` muestra un badge rojo con el
 * nº de tarjetas SR vencidas.
 */
export default function BottomNav({ activeTab, onSelect, dueCount = 0 }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, icon }) => {
        const Icon = ICONS[icon] || Home;
        return (
          <button
            key={key}
            className={`nav-item ${activeTab === key ? 'active' : ''}`}
            onClick={() => onSelect(key)}
            aria-label={label}
          >
            <Icon strokeWidth={activeTab === key ? 2.4 : 1.85} />
            {key === 'practica' && dueCount > 0 && (
              <span className="nav-badge tnum">{dueCount > 99 ? '99+' : dueCount}</span>
            )}
            {label}
          </button>
        );
      })}
    </nav>
  );
}
