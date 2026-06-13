import { useState, useCallback } from 'react';

// Las 5 secciones de la barra inferior (orden = orden visual).
export const TABS = [
  { key: 'hoy',      label: 'Hoy',      icon: 'home' },
  { key: 'plan',     label: 'Plan',     icon: 'calendar' },
  { key: 'practica', label: 'Práctica', icon: 'practice' },
  { key: 'progreso', label: 'Progreso', icon: 'progress' },
  { key: 'mas',      label: 'Más',      icon: 'more' },
];

// route → tab activo en la barra inferior.
export const TAB_OF = {
  hoy: 'hoy',
  plan: 'plan',
  practica: 'practica', sr: 'practica', errores: 'practica',
  lectura: 'practica', shadow: 'practica', output: 'practica',
  progreso: 'progreso',
  mas: 'mas', config: 'mas', diario: 'mas',
};

// Título mostrado en la topbar por ruta.
export const ROUTE_TITLE = {
  hoy: 'CAE Mastery',
  plan: 'Plan semanal',
  practica: 'Práctica',
  sr: 'Repaso espaciado',
  errores: 'Banco de errores',
  lectura: 'Log de lectura',
  shadow: 'Shadowing',
  output: 'Output Lab',
  progreso: 'Progreso',
  mas: 'Más',
  config: 'Ajustes y respaldo',
  diario: 'Diario de estudio',
};

// Raíces de tab: no muestran botón "atrás".
const ROOTS = new Set(['hoy', 'plan', 'practica', 'progreso', 'mas']);

/**
 * Stack de navegación de 1 nivel (push/pop) compartido entre tabs.
 * Cambiar de tab en la barra inferior resetea el stack a la raíz de ese tab.
 */
export function useNavStack(initial = 'hoy') {
  const [stack, setStack] = useState([initial]);
  const route = stack[stack.length - 1];
  const tab = TAB_OF[route] || 'hoy';

  const go = useCallback((r) => setStack((s) => [...s, r]), []);
  const back = useCallback(
    () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    [],
  );
  const selectTab = useCallback((tabKey) => setStack([tabKey]), []);

  return {
    stack,
    route,
    tab,
    go,
    back,
    selectTab,
    canBack: stack.length > 1 && !ROOTS.has(route),
    title: ROUTE_TITLE[route] || 'CAE Mastery',
  };
}
