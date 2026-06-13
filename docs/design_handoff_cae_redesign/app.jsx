/* global React, ReactDOM, Icon, useAppState, HoyScreen, PlanScreen, ProgresoScreen, PracticaScreen, SRScreen, ErroresScreen, LecturaScreen, ShadowScreen, OutputScreen, MasScreen, ConfigScreen */
// ============================================================
// App shell + navigation
// ============================================================
const { useState: uSA, useRef: uRA, useEffect: uEA } = React;

const TAB_OF = {
  hoy: 'hoy', plan: 'plan', progreso: 'progreso',
  practica: 'practica', sr: 'practica', errores: 'practica', lectura: 'practica', shadow: 'practica', output: 'practica',
  mas: 'mas', config: 'mas',
};
const NAV = [
  { tab: 'hoy', icon: 'today', label: 'Hoy' },
  { tab: 'plan', icon: 'calendar', label: 'Plan' },
  { tab: 'practica', icon: 'practice', label: 'Práctica' },
  { tab: 'progreso', icon: 'progress', label: 'Progreso' },
  { tab: 'mas', icon: 'grid', label: 'Más' },
];

function App() {
  const { state, setState, up } = useAppState();
  const [stack, setStack] = uSA(['hoy']);
  const route = stack[stack.length - 1];
  const scrollRef = uRA(null);

  const go = (r) => setStack(s => [...s, r]);
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  const navTab = (tab) => setStack(s => (s[s.length - 1] === tab ? s : [tab]));

  uEA(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [route]);

  const due = state.srCards.filter(c => c.nextReview <= Date.now()).length;
  const activeTab = TAB_OF[route] || 'hoy';

  let screen;
  switch (route) {
    case 'hoy': screen = <HoyScreen state={state} up={up} go={go} />; break;
    case 'plan': screen = <PlanScreen state={state} up={up} />; break;
    case 'progreso': screen = <ProgresoScreen state={state} up={up} />; break;
    case 'practica': screen = <PracticaScreen state={state} go={go} />; break;
    case 'sr': screen = <SRScreen state={state} up={up} onBack={back} />; break;
    case 'errores': screen = <ErroresScreen state={state} up={up} onBack={back} />; break;
    case 'lectura': screen = <LecturaScreen state={state} up={up} onBack={back} />; break;
    case 'shadow': screen = <ShadowScreen state={state} up={up} onBack={back} />; break;
    case 'output': screen = <OutputScreen state={state} up={up} onBack={back} />; break;
    case 'mas': screen = <MasScreen state={state} go={go} />; break;
    case 'config': screen = <ConfigScreen state={state} setState={setState} onBack={back} />; break;
    default: screen = <HoyScreen state={state} up={up} go={go} />;
  }

  return (
    <div className="app-shell">
      <div className="scroll-area" ref={scrollRef}>
        {screen}
      </div>
      <nav className="bottom-nav">
        {NAV.map(n => (
          <button key={n.tab} className={'nav-item' + (activeTab === n.tab ? ' active' : '')} onClick={() => navTab(n.tab)}>
            <Icon name={n.icon} size={22} strokeWidth={activeTab === n.tab ? 2.1 : 1.8} />
            {n.tab === 'practica' && due > 0 && <span className="nav-badge tnum">{due}</span>}
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
