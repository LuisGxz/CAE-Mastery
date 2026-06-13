import { useState, useEffect, useRef } from 'react';
import { TOTAL_WEEKS, daysUntilExam, defaultState } from './data';
import { useAppState } from './hooks/useAppState';
import { useNavStack } from './hooks/useNavStack';
import { BottomNav } from './components/ui';
import HoyScreen from './components/screens/HoyScreen';
import PlanScreen from './components/screens/PlanScreen';
import ProgresoScreen from './components/screens/ProgresoScreen';
import PracticaScreen from './components/screens/PracticaScreen';
import SRScreen from './components/screens/SRScreen';
import ErroresScreen from './components/screens/ErroresScreen';
import LecturaScreen from './components/screens/LecturaScreen';
import ShadowScreen from './components/screens/ShadowScreen';
import OutputScreen from './components/screens/OutputScreen';
import MasScreen from './components/screens/MasScreen';
import ConfigScreen from './components/screens/ConfigScreen';
import DiarioScreen from './components/screens/DiarioScreen';
import SyncScreen from './components/screens/SyncScreen';
import { ChevronLeft, HardDrive, AlertTriangle, RefreshCw, Cloud, CloudOff } from 'lucide-react';

export default function App() {
  const { state, setState, up, fileStatus, setFileStatus, syncState, setSyncState } = useAppState();
  const { route, tab, go, back, selectTab, canBack, title } = useNavStack();
  const scrollRef = useRef(null);

  // `now` se fija al montar (evita Date.now() impuro en render). El badge SR
  // baja igual al calificar, porque sm2() empuja nextReview al futuro.
  const [now] = useState(Date.now);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [route]);

  const daysLeft = daysUntilExam();
  const dueCount = state.srCards.filter((c) => c.nextReview <= now).length;
  const showReconnectBanner = fileStatus === 'needs_permission';

  function renderScreen() {
    switch (route) {
      case 'hoy':      return <HoyScreen state={state} up={up} go={go} now={now} />;
      case 'plan':     return <PlanScreen state={state} up={up} />;
      case 'practica': return <PracticaScreen state={state} go={go} now={now} />;
      case 'sr':       return <SRScreen state={state} up={up} now={now} />;
      case 'errores':  return <ErroresScreen state={state} up={up} />;
      case 'lectura':  return <LecturaScreen state={state} up={up} />;
      case 'shadow':   return <ShadowScreen state={state} up={up} />;
      case 'output':   return <OutputScreen state={state} up={up} />;
      case 'progreso': return <ProgresoScreen state={state} up={up} />;
      case 'mas':      return <MasScreen go={go} />;
      case 'diario':   return <DiarioScreen state={state} up={up} now={now} />;
      case 'sync':     return <SyncScreen state={state} setState={setState} setSyncState={setSyncState} />;
      case 'config':
        return (
          <ConfigScreen
            state={state}
            setState={setState}
            fileStatus={fileStatus}
            setFileStatus={setFileStatus}
            defaultState={defaultState}
          />
        );
      default:         return <HoyScreen state={state} up={up} go={go} now={now} />;
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-row">
          <div className="row" style={{ gap: 10 }}>
            {canBack && (
              <button className="icon-btn" onClick={back} aria-label="Atrás">
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <h1>{title}</h1>
              {route === 'hoy' && (
                <div className="sub tnum">{daysLeft} días · Sem {state.currentWeek}/{TOTAL_WEEKS}</div>
              )}
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            {syncState !== 'off' && (
              <button className="ds-pill" onClick={() => go('sync')}
                style={{ cursor: 'pointer', color: syncState === 'error' ? 'var(--danger)' : 'var(--accent-2)', background: syncState === 'error' ? 'var(--danger-soft)' : 'var(--accent-soft)' }}
                title={syncState === 'error' ? 'Error de sync' : syncState === 'syncing' ? 'Sincronizando…' : 'Sincronizado'}>
                {syncState === 'error' ? <CloudOff size={12} /> : syncState === 'syncing' ? <RefreshCw size={12} /> : <Cloud size={12} />}
              </button>
            )}
            {(fileStatus === 'ready' || fileStatus === 'electron') && (
              <span className="ds-pill success"><HardDrive size={12} /> disco</span>
            )}
          </div>
        </div>

        {showReconnectBanner && (
          <button
            className="ds-card between"
            style={{ width: '100%', marginTop: 10, cursor: 'pointer', padding: 12 }}
            onClick={() => go('config')}
          >
            <span className="row" style={{ gap: 8, color: 'var(--warn)', fontSize: 12, fontWeight: 600 }}>
              <AlertTriangle size={14} /> Reconecta el archivo en disco — toca para ir a Ajustes.
            </span>
          </button>
        )}
      </header>

      <main className="scroll-area" ref={scrollRef}>
        {renderScreen()}
      </main>

      <BottomNav activeTab={tab} onSelect={selectTab} dueCount={dueCount} />
    </div>
  );
}
