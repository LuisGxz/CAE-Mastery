import { useState } from 'react';
import { TABS, EXAM_DATE, TOTAL_WEEKS, daysUntilExam, defaultState } from './data';
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
import { Settings, HardDrive, AlertTriangle } from 'lucide-react';
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
      {/* Sticky header + tabs */}
      <div className="sticky-header">
        <div style={{ position: "relative", textAlign: "center", padding: "12px 0 8px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Manrope', system-ui, sans-serif", letterSpacing: "-0.02em", color: "var(--text)" }}>
            CAE Mastery <span style={{ color: "var(--accent-2)" }}>→ {EXAM_DATE}</span>
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            <span className="pill" style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", fontWeight: 600 }}>{daysLeft} días</span>
            <span className="pill" style={{ background: "rgba(168,85,247,0.15)", color: "#c4b5fd" }}>Sem {state.currentWeek}/{TOTAL_WEEKS}</span>
            {fileStatus === 'ready' && (
              <span className="pill" style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}><HardDrive size={12} /> disco</span>
            )}
          </div>
          {/* Settings icon */}
          <button
            onClick={() => setTab(tab === 'Config' ? 'Home' : 'Config')}
            title="Configuración"
            style={{
              position: "absolute", top: 10, right: 0,
              background: tab === 'Config' ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
              border: tab === 'Config' ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 8px", cursor: "pointer",
              color: tab === 'Config' ? "#a5b4fc" : "#64748b",
              fontSize: 16, lineHeight: 1, transition: "all 0.2s",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Reconnect banner */}
        {showReconnectBanner && (
          <div className="reminder info" style={{ cursor: "pointer", marginBottom: 8 }} onClick={() => setTab('Config')}>
            <span style={{ fontSize: 12, color: "#93c5fd", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={13} /> El archivo en disco necesita reconectarse. Haz clic o ve a Config → Reconectar archivo.
            </span>
          </div>
        )}

        {/* Tabs (sin Config) */}
        {tab !== 'Config' && (
          <div className="tabs">
            {TABS.map(tb => (
              <button key={tb} className={`tab ${tab === tb ? "active" : ""}`} onClick={() => setTab(tb)}>
                {tb === 'SR' && dueCount > 0 ? `SR (${dueCount})` : tb}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="tab-content">
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
      </div>

      <div style={{ textAlign: "center", padding: "16px 0 8px", color: "#475569", fontSize: 10 }}>
        CAE Mastery | {EXAM_DATE} | {daysLeft} días
      </div>
    </div>
  );
}
