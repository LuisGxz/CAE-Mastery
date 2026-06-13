import { useState, useEffect, useRef } from 'react';
import { TOTAL_WEEKS, daysUntilExam, defaultState } from './data';
import { useAppState } from './hooks/useAppState';
import { useNavStack } from './hooks/useNavStack';
import BottomNav from './components/ui/BottomNav';
import { PracticaHub, MasMenu } from './components/screens/Hubs';
import HomeTab from './components/tabs/HomeTab';
import PlanTab from './components/tabs/PlanTab';
import TrackerTab from './components/tabs/TrackerTab';
import ErrorBankTab from './components/tabs/ErrorBankTab';
import DiaryTab from './components/tabs/DiaryTab';
import ReadingTab from './components/tabs/ReadingTab';
import SRTab from './components/tabs/SRTab';
import ShadowTab from './components/tabs/ShadowTab';
import OutputTab from './components/tabs/OutputTab';
import ConfigTab from './components/tabs/ConfigTab';
import { ChevronLeft, HardDrive, AlertTriangle } from 'lucide-react';
import './App.css';

export default function App() {
  const { state, setState, up, fileStatus, setFileStatus } = useAppState();
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
      case 'hoy':      return <HomeTab state={state} up={up} />;
      case 'plan':     return <PlanTab state={state} up={up} />;
      case 'practica': return <PracticaHub state={state} go={go} now={now} />;
      case 'sr':       return <SRTab state={state} up={up} />;
      case 'errores':  return <ErrorBankTab state={state} up={up} />;
      case 'lectura':  return <ReadingTab state={state} up={up} />;
      case 'shadow':   return <ShadowTab state={state} up={up} />;
      case 'output':   return <OutputTab state={state} up={up} />;
      case 'progreso': return <TrackerTab state={state} />;
      case 'mas':      return <MasMenu state={state} go={go} />;
      case 'diario':   return <DiaryTab state={state} up={up} />;
      case 'config':
        return (
          <ConfigTab
            state={state}
            setState={setState}
            fileStatus={fileStatus}
            setFileStatus={setFileStatus}
            defaultState={defaultState}
            daysLeft={daysLeft}
          />
        );
      default:         return <HomeTab state={state} up={up} />;
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
          {(fileStatus === 'ready' || fileStatus === 'electron') && (
            <span className="ds-pill success"><HardDrive size={12} /> disco</span>
          )}
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
