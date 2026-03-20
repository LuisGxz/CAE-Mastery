import { useState } from 'react';
import { TABS, EXAM_DATE, daysUntilExam, defaultState } from './data';
import { useAppState } from './hooks/useAppState';
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
import './App.css';

export default function App() {
  const { state, setState, up, fileStatus, setFileStatus } = useAppState();
  const [tab, setTab] = useState('Home');

  const daysLeft = daysUntilExam();
  const dueCount = state.srCards.filter(c => c.nextReview <= Date.now()).length;

  // Storage status banner shown when file storage needs re-connection
  const showReconnectBanner = fileStatus === 'needs_permission';

  return (
    <div className="app">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16, padding: "12px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CAE Mastery → {EXAM_DATE}
        </h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <span className="pill" style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", fontWeight: 600 }}>{daysLeft} días</span>
          <span className="pill" style={{ background: "rgba(168,85,247,0.15)", color: "#c4b5fd" }}>Sem {state.currentWeek}/27</span>
          {fileStatus === 'ready' && (
            <span className="pill" style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", fontSize: 11 }}>💾 disco</span>
          )}
        </div>
      </div>

      {/* Reconnect banner */}
      {showReconnectBanner && (
        <div className="reminder info" style={{ cursor: "pointer" }} onClick={() => setTab('Config')}>
          <span style={{ fontSize: 12, color: "#93c5fd" }}>
            ⚠️ El archivo en disco necesita reconectarse. Haz clic o ve a Config → Reconectar archivo.
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(tb => (
          <button key={tb} className={`tab ${tab === tb ? "active" : ""}`} onClick={() => setTab(tb)}>
            {tb === 'SR' && dueCount > 0 ? `SR (${dueCount})` : tb}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Home'    && <HomeTab     state={state} up={up} />}
      {tab === 'Plan'    && <PlanTab     state={state} up={up} />}
      {tab === 'Tracker' && <TrackerTab  state={state} />}
      {tab === 'Errores' && <ErrorBankTab state={state} up={up} />}
      {tab === 'Diario'  && <DiaryTab    state={state} up={up} />}
      {tab === 'Lectura' && <ReadingTab  state={state} up={up} />}
      {tab === 'SR'      && <SRTab       state={state} up={up} />}
      {tab === 'Shadow'  && <ShadowTab   state={state} up={up} />}
      {tab === 'Output'  && <OutputTab   state={state} up={up} />}
      {tab === 'Config'  && (
        <ConfigTab
          state={state}
          setState={setState}
          fileStatus={fileStatus}
          setFileStatus={setFileStatus}
          defaultState={defaultState}
          daysLeft={daysLeft}
        />
      )}

      <div style={{ textAlign: "center", padding: "16px 0 8px", color: "#475569", fontSize: 10 }}>
        CAE Mastery | {EXAM_DATE} | {daysLeft} días
      </div>
    </div>
  );
}
